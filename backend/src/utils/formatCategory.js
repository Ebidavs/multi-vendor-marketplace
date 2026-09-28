const formatCategory = (category, productCount = null) => {
  const shaped = {
    id: category.id,
    name: category.name,
    icon: category.icon,
    description: category.description,
  };
  if (productCount !== null) {
    shaped.productCount = productCount;
  }
  return shaped;
};

module.exports = formatCategory;