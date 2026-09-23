export default function CartBar({ cartItems, onClearCart }) {
  // Calculate total items and total cost
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (totalCount === 0) return null; // Hide bar if cart is empty

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-sm text-emerald-700">
            {totalCount}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Cart Total</p>
            <p className="text-lg font-bold text-gray-900">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClearCart}
            className="px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:text-red-600"
          >
            Clear
          </button>
          <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
            View Cart & Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}