import { Link } from "react-router-dom";

export default function Cart({
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? "item" : "items"}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Clear cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-800">Your cart is empty</p>
          <p className="mt-2 text-sm text-gray-500">
            Find something you love in the marketplace.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <section className="space-y-3" aria-label="Cart items">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 rounded-xl bg-gray-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    ₦{item.price.toLocaleString()} each
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.title} quantity`}
                    onClick={() => onDecreaseQuantity(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.title} quantity`}
                    onClick={() => onIncreaseQuantity(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="min-w-28 text-right font-bold text-gray-900">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
            <div className="mt-4 flex justify-between border-b border-gray-100 pb-4 text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Shipping and payment details can be confirmed during checkout.
            </p>
            <Link
              to="/products"
              className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
