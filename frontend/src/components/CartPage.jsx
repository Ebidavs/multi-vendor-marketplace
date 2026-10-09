import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const formatPrice = (price) => `₦${price.toLocaleString()}`;

export default function CartPage({
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">MarketHub</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Your Cart</h1>
        </div>
        <Link to="/products" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-600">Find something you love in the marketplace.</p>
          <Link to="/products" className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <section aria-label="Cart items" className="divide-y divide-gray-200 border-y border-gray-200">
            {cartItems.map((item) => (
              <article key={item.id} className="flex gap-4 py-5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-20 w-20 shrink-0 rounded-md bg-gray-100 object-cover sm:h-24 sm:w-24"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sold by {item.vendorName || "Verified Vendor"}
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">{formatPrice(item.price)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-gray-300">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.title} quantity`}
                        onClick={() => onDecreaseQuantity(item.id)}
                        className="p-2 text-gray-600 hover:text-emerald-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.title} quantity`}
                        onClick={() => onIncreaseQuantity(item.id)}
                        className="p-2 text-gray-600 hover:text-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="hidden font-semibold text-gray-900 sm:block">{formatPrice(item.price * item.quantity)}</p>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Delivery fees are calculated at checkout.</p>
            <div className="mt-5 border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                onClick={onClearCart}
                className="mt-3 w-full rounded-md px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}