import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "How do I place an order?",
    answer:
      "Add products to your cart, open the cart, and continue to checkout. You can track every order from the Orders page.",
  },
  {
    question: "Where is my cart saved?",
    answer:
      "Guest carts are saved in your browser. Once you log in, your cart is synced to your account and follows you across devices.",
  },
  {
    question: "How do I track an order?",
    answer:
      "Open the Orders page and select an order to see its live status, items, and delivery updates.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Returns are handled per the return policy shown in your order confirmation. Contact support with your order number to start a return.",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        XI Market
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">
        Help / Support
      </h1>

      <p className="mt-2 text-sm text-gray-600">
        Answers to the most common questions about shopping on
        XI Market.
      </p>

      <div className="mt-6 space-y-4">
        {FAQS.map((faq) => (
          <section
            key={faq.question}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-base font-semibold text-gray-900">
              {faq.question}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {faq.answer}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-base font-semibold text-emerald-800">
          Still need help?
        </h2>
        <p className="mt-2 text-sm text-emerald-800">
          Reach out through the support contact details in your
          order confirmation emails, and our team will get back
          to you.
        </p>
      </section>

      <div className="mt-6">
        <Link
          to="/products"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          &larr; Back to shopping
        </Link>
      </div>
    </main>
  );
}
