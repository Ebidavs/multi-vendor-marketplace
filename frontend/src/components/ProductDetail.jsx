import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewList from '../components/ReviewList';

export default function ProductDetailPage({ products = [], onAddToCart }) {
  const { id } = useParams();
  
  // Find product by ID
  const product = products.find((p) => String(p.id) === String(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <p className="mt-2 text-xs text-gray-500">The item you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  // Fallback images if product image gallery is a single string or array
  const images = Array.isArray(product.images)
    ? product.images
    : [product.image || 'https://via.placeholder.com/600x600'];

  // Mock reviews if not present on dataset
  const mockReviews = product.reviews || [
    {
      id: 1,
      author: 'Amina B.',
      rating: 5,
      comment: 'Excellent product quality! Delivery was super quick and vendor was communicative.',
      date: '2 days ago',
    },
    {
      id: 2,
      author: 'David O.',
      rating: 4,
      comment: 'Matches the description well. Good value for money.',
      date: '1 week ago',
    },
  ];

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/products" className="hover:text-emerald-600">Products</Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="font-medium text-gray-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery & Main Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnail Selectors */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Tag & Vendor Link */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                {product.category}
              </span>
              
              {/* Link to Vendor Profile Page */}
              <Link
                to={`/vendor/${product.vendorId || encodeURIComponent(product.vendor || 'official-vendor')}`}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Sold by {product.vendor || 'Verified Vendor'}</span>
                <span>→</span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

            {/* Price & Stock */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-2xl font-black text-gray-900">
                  ₦{(product.price || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.inStock !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || 'High quality item sourced directly from trusted vendors across Nigeria.'}
            </p>
          </div>

          {/* Actions Section */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-xs font-bold uppercase text-gray-500">Quantity</label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.inStock !== false ? `Add ${quantity} to Cart • ₦${(product.price * quantity).toLocaleString()}` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description vs Reviews */}
      <div className="mt-12 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div className="mb-6 flex space-x-6 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs font-bold transition-all ${
              activeTab === 'description'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold transition-all ${
              activeTab === 'reviews'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Customer Reviews ({mockReviews.length})
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="text-xs text-gray-600 leading-relaxed space-y-3">
            <p>{product.description || 'No detailed description available for this product.'}</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-500">
              <li>Guaranteed authentic from official vendor</li>
              <li>Eligible for fast nationwide delivery</li>
              <li>Standard 7-day return policy applies</li>
            </ul>
          </div>
        ) : (
          <ReviewList reviews={mockReviews} />
        )}
      </div>
    </div>
  );
}