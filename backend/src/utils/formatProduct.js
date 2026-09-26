const formatProductSummary = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0] || null,
  category: product.category && product.category.name ? product.category.name : null,
  categoryId: product.category ? product.category.id : null,
  vendorId: product.vendor.toString(),
  inStock: product.stock > 0,
  rating: product.ratingsAverage,
  reviewCount: product.ratingsCount,
});

const formatProductDetail = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  images: product.images,
  category: product.category && product.category.name ? product.category.name : null,
  categoryId: product.category ? product.category.id : null,
  inStock: product.stock > 0,
  stockQuantity: product.stock,
  vendorId: product.vendor.toString(),
  specifications: product.specifications || {},
  rating: product.ratingsAverage,
  reviewCount: product.ratingsCount,
  createdAt: product.createdAt,
});

module.exports = { formatProductSummary, formatProductDetail };