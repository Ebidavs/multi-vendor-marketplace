// API product -> shape the existing components already use (title, not name).
export const toProduct = (p) => ({
  id: p.id,
  title: p.name,
  price: p.price,
  image: p.image ?? p.images?.[0],
  category: p.category,
  categoryId: p.categoryId,
  vendorId: p.vendorId,
  inStock: p.inStock,
  rating: p.rating,
  reviewCount: p.reviewCount,
});

// Checkout form value -> API enum.
// TODO: confirm with client what "paystack" should map to.
const PAYMENT_METHODS = {
  card: "credit_card",
  paystack: "credit_card",
  bank: "bank_transfer",
  cod: "cash_on_delivery",
};

// Checkout form state -> POST /orders body.
export const toOrderPayload = (delivery, paymentMethod) => ({
  shippingAddress: {
    fullName: delivery.name,
    phone: delivery.phone,
    street: delivery.address,
    city: delivery.city,
    state: delivery.state,
    country: "Nigeria",
  },
  paymentMethod: PAYMENT_METHODS[paymentMethod],
});
