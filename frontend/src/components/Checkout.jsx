import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Check, CreditCard, LockKeyhole, Pencil, Truck, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DELIVERY_FEE = 5000;
const formatPrice = (price) => `₦${price.toLocaleString()}`;
const steps = ["Delivery", "Payment", "Review"];

function Stepper({ currentStep }) {
  return (
    <ol className="flex items-center justify-center gap-3 py-5" aria-label="Checkout progress">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3">
          <span className={`flex items-center gap-2 text-xs font-semibold ${index <= currentStep ? "text-emerald-700" : "text-gray-400"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index < currentStep ? "bg-emerald-700 text-white" : index === currentStep ? "border-2 border-emerald-700" : "border border-gray-300"}`}>
              {index < currentStep ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span className="hidden sm:inline">{step}</span>
          </span>
          {index < steps.length - 1 && <span className={`h-px w-8 ${index < currentStep ? "bg-emerald-700" : "bg-gray-300"}`} />}
        </li>
      ))}
    </ol>
  );
}

export default function Checkout({ cartItems, onClearCart }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState("checkout");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [delivery, setDelivery] = useState({ name: "", phone: "", address: "", state: "", city: "" });
  const [orderNumber, setOrderNumber] = useState("");
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  useEffect(() => {
    if (screen !== "processing") return undefined;
    const timer = window.setTimeout(() => setScreen("success"), 900);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const placeOrder = () => {
    setOrderNumber(`MH-${Math.floor(10000 + Math.random() * 89999)}`);
    onClearCart();
    setScreen("processing");
  };

  if (cartItems.length === 0 && screen === "checkout") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Add products before starting checkout.</p>
        <Link to="/products" className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Browse products</Link>
      </main>
    );
  }

  if (screen === "processing") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-700" aria-label="Placing your order" />
        <p className="mt-4 text-sm text-gray-600">Placing your order...</p>
      </main>
    );
  }

  if (screen === "success") {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-9 w-9" /></span>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Your order is confirmed</h1>
        <p className="mt-2 text-gray-600">Order {orderNumber}</p>
        <p className="mt-1 text-sm text-gray-500">Your order details have been saved.</p>
        <Link to="/products" className="mt-8 rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Continue Shopping</Link>
      </main>
    );
  }

  const updateDelivery = (event) => {
    const { name, value } = event.target;
    setDelivery((current) => ({ ...current, [name]: value }));
  };

  const submitStep = (event) => {
    event.preventDefault();
    if (step < 2) setStep((current) => current + 1);
    else placeOrder();
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header className="border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => step === 0 ? navigate("/cart") : setStep((current) => current - 1)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-gray-900">Secure Checkout</h1>
          <LockKeyhole className="ml-auto h-4 w-4 text-gray-500" aria-label="Secure checkout" />
        </div>
        <Stepper currentStep={step} />
      </header>

      <form onSubmit={submitStep}>
        <div className="space-y-5 py-6">
          {step === 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required autoComplete="name" name="name" value={delivery.name} onChange={updateDelivery} placeholder="Full name" aria-label="Full name" className="rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" />
                <input required autoComplete="tel" name="phone" value={delivery.phone} onChange={updateDelivery} placeholder="Phone number" aria-label="Phone number" className="rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" />
                <input required autoComplete="street-address" name="address" value={delivery.address} onChange={updateDelivery} placeholder="Street address" aria-label="Street address" className="rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 sm:col-span-2" />
                <input required autoComplete="address-level1" name="state" value={delivery.state} onChange={updateDelivery} placeholder="State" aria-label="State" className="rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" />
                <input required autoComplete="address-level2" name="city" value={delivery.city} onChange={updateDelivery} placeholder="City" aria-label="City" className="rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700" />
              </div>
              <fieldset className="space-y-2">
                <legend className="mb-2 font-semibold text-gray-900">Delivery Method</legend>
                {[{ id: "standard", label: "Standard Delivery", detail: "2-5 business days", icon: Truck }, { id: "express", label: "Express Delivery", detail: "1-2 business days", icon: Zap }].map(({ id, label, detail, icon: Icon }) => (
                  <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${deliveryMethod === id ? "border-emerald-700 bg-emerald-50" : "border-gray-200"}`}>
                    <input type="radio" name="deliveryMethod" value={id} checked={deliveryMethod === id} onChange={() => setDeliveryMethod(id)} className="accent-emerald-700" />
                    <Icon className="h-5 w-5 text-emerald-700" />
                    <span className="flex-1"><span className="block text-sm font-medium text-gray-900">{label}</span><span className="block text-xs text-gray-500">{detail}</span></span>
                  </label>
                ))}
              </fieldset>
            </section>
          )}

          {step === 1 && (
            <fieldset className="space-y-2">
              <legend className="mb-3 text-lg font-semibold text-gray-900">Payment Method</legend>
              {[{ id: "card", label: "Card", detail: "Visa, Mastercard, Verve", icon: CreditCard }, { id: "bank", label: "Bank Transfer", detail: "Direct transfer", icon: Building2 }, { id: "paystack", label: "Paystack", detail: "Pay securely with Paystack", icon: Zap }].map(({ id, label, detail, icon: Icon }) => (
                <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 ${paymentMethod === id ? "border-emerald-700 bg-emerald-50" : "border-gray-200"}`}>
                  <input type="radio" name="paymentMethod" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-emerald-700" />
                  <Icon className="h-5 w-5 text-emerald-700" />
                  <span className="flex-1"><span className="block text-sm font-medium text-gray-900">{label}</span><span className="block text-xs text-gray-500">{detail}</span></span>
                </label>
              ))}
              <p className="pt-2 text-xs text-gray-500">Payment processing is not connected yet. No payment will be charged.</p>
            </fieldset>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="font-semibold text-gray-900">Delivery</h2>
                  <p className="mt-1 text-sm text-gray-600">{delivery.name}, {delivery.phone}</p>
                  <p className="text-sm text-gray-600">{delivery.address}, {delivery.city}, {delivery.state}</p>
                  <p className="text-sm text-gray-600">{deliveryMethod === "express" ? "Express" : "Standard"} delivery</p>
                </div>
                <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><Pencil className="h-4 w-4" />Edit</button>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div><h2 className="font-semibold text-gray-900">Payment</h2><p className="mt-1 text-sm capitalize text-gray-600">{paymentMethod === "paystack" ? "Paystack" : paymentMethod === "bank" ? "Bank Transfer" : "Card"}</p></div>
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><Pencil className="h-4 w-4" />Edit</button>
              </div>
              <div>
                <h2 className="mb-2 font-semibold text-gray-900">Items ({cartItems.length})</h2>
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <img src={item.image} alt="" className="h-12 w-12 rounded-md bg-gray-100 object-cover" />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900">{item.title} × {item.quantity}</p><p className="text-xs text-gray-500">{item.vendorName}</p></div>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-gray-200 pt-4" aria-label="Order total">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm text-gray-600"><span>Delivery fee</span><span>{formatPrice(DELIVERY_FEE)}</span></div>
            <div className="mt-3 flex justify-between font-bold text-gray-900"><span>Total</span><span>{formatPrice(total)}</span></div>
          </section>
        </div>

        <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-white p-4 sm:-mx-6 sm:px-6">
          <button type="submit" className="w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800">
            {step === 0 ? "Continue to Payment" : step === 1 ? "Continue to Review" : `Place Order · ${formatPrice(total)}`}
          </button>
        </div>
      </form>
    </main>
  );
}