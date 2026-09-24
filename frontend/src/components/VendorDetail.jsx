import { useParams, Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function VendorDetail({ vendors, products, onAddToCart }) {
  const { id } = useParams();

  // Guard: find vendor by ID or name
  const vendor = vendors.find(
    (v) => v.id.toLowerCase() === id?.toLowerCase() || v.name.toLowerCase() === id?.toLowerCase()
  );

  if (!vendor) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Not Found</h2>
        <p className="mt-2 text-gray-600">The vendor you are looking for does not exist.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Back to Marketplace
        </Link>
      </main>
    );
  }

  // Filter products belonging to this vendor
  const vendorProducts = products.filter(
    (p) =>
      p.vendorName?.toLowerCase() === vendor.name.toLowerCase() ||
      p.vendorId?.toLowerCase() === vendor.id.toLowerCase()
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Verified Vendor
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-gray-900">{vendor.name}</h1>
        <p className="mt-2 text-gray-600">{vendor.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>⭐ {vendor.rating} / 5.0</span>
          <span>📍 {vendor.location}</span>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Products by {vendor.name} ({vendorProducts.length})
      </h2>

      {vendorProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendorProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products listed for this vendor yet.</p>
      )}
    </main>
  );
}