import Navbar from "../components/Navbar"

import heroImage from "../assets/hero.png"; 
import shoppingImage from "../assets/web-shopping.svg";
import "./Home.css";



function Home() {
    const categories = [
        {
            icon: "💻",
            name: "Electronics",
            description: "Phones, laptops & gadgets",

    },
    {
        icon: "👘",
        name: "Fashion",
        description: "Clothing, shoes & accessories",

    },
    {
        icon: "💋",
        name: "Makeup & Beauty",
        description: "Furniture & home essentials",
        
    },
    {
        icon: "👟",
        name: "Shoes & Bags",
        description: "Footwear & stylish bags",
    },
    {
        icon: "🤸‍♂️",
        name: "Sports & Fitness",
        description: "Fitness gear & equipment",
    },

];
const products = [
    {
    icon: "Wireless Headphone",
    price: "N45,000",
    rating: "*****",
    reviews: "120",
},
{
    icon: "",
    name: "Smart Watch",
    price: "N60,000",
    rating: "*****",
    reviews: "95",

},
{
    icon: "👝",
    name: "Ladies Handbag",
    price: "N32,000",
    rating: "*****",
    reviews: "88",
},
 {
    icon: "👟",
    name: "Premium Sneakers",
    price: "N28,000",
    rating: "*****",
    reviews: "76",
 },
 {
    icon: "🌸",
    name: "Perfume Set",
    price: "N25,000",
    reviews: "64",
 },
 {
    icon: "🍴",
    name: "Kitchen Utesil",
    price: "30,000",
    rating: "*****",
    reviews: "52",
 },
];

return (
    <div className="home-page">
        <Navbar />
        {/* HERO */}
        <section className="home-hero">
        <div className="hero-content">
            <span className="hero-label">🎒 Shop from Multiple Vendors</span>

            <h1>
                Everything You Need
                <span>In One Marketplace</span>
            </h1>
            <p>Discover amazing products from trusted vendors. Shop electronics, fashion,
                beauty, home essentials and more - all in one place.
            </p>
            <div className="hero-buttons">
                <button className="primary-btn">Shop Now</button>
            </div>
        </div>
        <div className="hero-image">
            <img src={shoppingImage} alt="Online shopping"></img>
        </div>

        </section>
    </div>
)

}

export default Home