require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/category');

const categories = [
  { name: 'Electronics', icon: '📱', description: 'Phones, laptops, accessories and gadgets' },
  { name: 'Fashion', icon: '👗', description: 'Clothing, shoes and accessories for men, women and kids' },
  { name: 'Groceries', icon: '🛒', description: 'Everyday food and household essentials' },
  { name: 'Home & Living', icon: '🛋️', description: 'Furniture, kitchenware and home decor' },
  { name: 'Health & Beauty', icon: '💄', description: 'Skincare, cosmetics and personal care products' },
  { name: 'Sports & Outdoors', icon: '⚽', description: 'Fitness gear, sportswear and outdoor equipment' },
  { name: 'Baby & Kids', icon: '🍼', description: "Toys, baby care and children's essentials" },
  { name: 'Books & Stationery', icon: '📚', description: 'Books, office and school supplies' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  for (const cat of categories) {
    await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
  }
  console.log('Categories seeded/updated');
  process.exit(0);
});