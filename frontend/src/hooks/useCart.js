import { useCallback, useEffect, useRef, useState } from "react";

import { CART_STORAGE_KEY } from "../utils/constants";
import {
  addServerCartItem,
  clearServerCart,
  getProductById,
  getServerCart,
  removeServerCartItem,
  updateServerCartItem,
} from "../services/api";
import { useAuth } from "./useAuth";

const OBJECT_ID = /^[0-9a-f]{24}$/i;

const getStoredCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const storeGuestCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

// Backend cart line -> display shape used by ProductCard / CartPage / CartBar.
// `id` stays the productId so ProductCard's in-cart lookup keeps working,
// while `cartItemId` holds the backend line id used for PUT/DELETE.
const hydrateCartLines = async (cart, productCache) => {
  const lines = Array.isArray(cart?.items) ? cart.items : [];

  return Promise.all(
    lines.map(async (line) => {
      const productId = String(line.productId);
      let product = productCache.current[productId];

      if (product === undefined) {
        try {
          const body = await getProductById(productId);
          product = body?.data?.product || null;
        } catch {
          product = null;
        }
        productCache.current[productId] = product;
      }

      return {
        id: productId,
        cartItemId: String(line._id),
        title: product?.name || "Unavailable product",
        image: product?.images?.[0] || "",
        price: Number(line.price) || Number(product?.price) || 0,
        quantity: Number(line.quantity) || 1,
        inStock: product ? Boolean(product.inStock) : false,
        category: product?.category || "",
        vendorId: product?.vendorId || null,
      };
    })
  );
};

export function useCart() {
  const { isCustomer } = useAuth();

  const [guestItems, setGuestItems] = useState(getStoredCart);
  const [serverItems, setServerItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [notice, setNotice] = useState(null);
  const [pendingSync, setPendingSync] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const productCache = useRef({});

  // Backend cart is the source of truth for authenticated customers;
  // everyone else keeps using the localStorage guest cart.
  const cartItems = isCustomer ? serverItems : guestItems;

  const refreshServerCart = useCallback(async () => {
    const cart = await getServerCart();
    const items = await hydrateCartLines(cart, productCache);
    setServerItems(items);
    return items;
  }, []);

  // -----------------------------------------------
  // Guest cart -> backend cart synchronization
  // -----------------------------------------------
  const syncGuestCart = useCallback(async () => {
    const guest = getStoredCart();
    const syncable = guest.filter((item) =>
      OBJECT_ID.test(String(item.id))
    );

    if (syncable.length === 0) {
      setPendingSync(false);
      return true;
    }

    try {
      for (const item of syncable) {
        const quantity =
          Number.isInteger(item.quantity) && item.quantity >= 1
            ? item.quantity
            : 1;

        // The backend merges quantities for products already in
        // the cart, so no custom duplicate handling is needed.
        await addServerCartItem(item.id, quantity);
      }

      // Only clear the guest cart after every line synced
      // successfully. Unsyncable legacy entries (non-ObjectId
      // ids) are kept so nothing is silently lost.
      const leftovers = guest.filter(
        (item) => !OBJECT_ID.test(String(item.id))
      );

      storeGuestCart(leftovers);
      setGuestItems(leftovers);
      setPendingSync(false);
      setCartError("");
      setNotice({
        type: "success",
        text: "Your guest cart was synced to your account.",
      });
      return true;
    } catch (err) {
      // Keep the guest cart so it can be retried later.
      setPendingSync(true);
      setCartError(
        err.message ||
          "We couldn't sync your guest cart to your account."
      );
      return false;
    }
  }, []);

  // -----------------------------------------------
  // Load / sync when a customer session is active
  // -----------------------------------------------
  useEffect(() => {
    if (!isCustomer) {
      setServerItems([]);
      setCartLoading(false);
      // Leaving customer mode: restore the latest guest cart.
      setGuestItems(getStoredCart());
      return undefined;
    }

    let isCurrent = true;

    const load = async () => {
      setCartLoading(true);

      await syncGuestCart();

      try {
        await refreshServerCart();
      } catch (err) {
        if (isCurrent) {
          setCartError(
            err.message || "Unable to load your cart."
          );
        }
      } finally {
        if (isCurrent) {
          setCartLoading(false);
        }
      }
    };

    load();

    return () => {
      isCurrent = false;
    };
  }, [isCustomer, reloadToken, syncGuestCart, refreshServerCart]);

  // Persist the guest cart (only outside customer mode).
  useEffect(() => {
    if (!isCustomer) {
      storeGuestCart(guestItems);
    }
  }, [guestItems, isCustomer]);

  // Auto-dismiss transient success notices.
  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleAddToCart = useCallback(
    (product, quantityToAdd = 1) => {
      if (isCustomer) {
        addServerCartItem(product.id, quantityToAdd)
          .then(() => refreshServerCart())
          .then(() => {
            setCartError("");
            setNotice({
              type: "success",
              text: "Added to your cart.",
            });
          })
          .catch((err) => {
            setCartError(
              err.message ||
                "Could not add the product to your cart."
            );
          });
        return;
      }

      setGuestItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantityToAdd,
                }
              : item
          );
        }

        return [
          ...prevItems,
          { ...product, quantity: quantityToAdd },
        ];
      });
    },
    [isCustomer, refreshServerCart]
  );

  const handleIncreaseQuantity = useCallback(
    (productId) => {
      if (isCustomer) {
        const item = serverItems.find(
          (entry) => entry.id === productId
        );

        if (!item) return;

        updateServerCartItem(item.cartItemId, item.quantity + 1)
          .then(() => refreshServerCart())
          .catch((err) => {
            setCartError(
              err.message || "Could not update your cart."
            );
          });
        return;
      }

      setGuestItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    },
    [isCustomer, serverItems, refreshServerCart]
  );

  const handleDecreaseQuantity = useCallback(
    (productId) => {
      if (isCustomer) {
        const item = serverItems.find(
          (entry) => entry.id === productId
        );

        if (!item) return;

        // The backend requires quantity >= 1, so removing the
        // last unit removes the line (matches guest behavior).
        const request =
          item.quantity <= 1
            ? removeServerCartItem(item.cartItemId)
            : updateServerCartItem(
                item.cartItemId,
                item.quantity - 1
              );

        request
          .then(() => refreshServerCart())
          .catch((err) => {
            setCartError(
              err.message || "Could not update your cart."
            );
          });
        return;
      }

      setGuestItems((prevItems) =>
        prevItems
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [isCustomer, serverItems, refreshServerCart]
  );

  const handleRemoveItem = useCallback(
    (productId) => {
      if (isCustomer) {
        const item = serverItems.find(
          (entry) => entry.id === productId
        );

        if (!item) return;

        removeServerCartItem(item.cartItemId)
          .then(() => refreshServerCart())
          .catch((err) => {
            setCartError(
              err.message || "Could not update your cart."
            );
          });
        return;
      }

      setGuestItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    },
    [isCustomer, serverItems, refreshServerCart]
  );

  const handleClearCart = useCallback(() => {
    if (isCustomer) {
      clearServerCart()
        .then(() => refreshServerCart())
        .catch((err) => {
          setCartError(
            err.message || "Could not clear your cart."
          );
        });
      return;
    }

    setGuestItems([]);
  }, [isCustomer, refreshServerCart]);

  const retryCartSync = useCallback(
    () => setReloadToken((token) => token + 1),
    []
  );

  const dismissCartError = useCallback(
    () => setCartError(""),
    []
  );

  const dismissNotice = useCallback(
    () => setNotice(null),
    []
  );

  return {
    cartItems,
    cartLoading,
    cartError,
    notice,
    pendingSync,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
    retryCartSync,
    dismissCartError,
    dismissNotice,
  };
}
