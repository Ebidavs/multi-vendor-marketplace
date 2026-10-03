import Navbar from "../components/Navbar";
import shoppingImage from "../assets/web-shopping.svg";
import "./Home.css";


function Home() {
    return (
        <div>
            <main className="hero">
                <div className="hero-content">
                    <h1>Welcome to our <span>Marketplace</span></h1>
                    <p>Find products from different vendors in one place</p>

                     <div className="hero-buttons">
                        <button>Shop Now</button>
                        <button>Browse Categories</button>
                     </div>

                </div>

                <div className="hero-image">
                    <img src={heroImage} alt="Marketplace products" />
                </div>

            </main>
        </div>
    )
}

export default Home