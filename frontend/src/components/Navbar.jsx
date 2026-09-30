
import "./Navbar.css"

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>Marketplace</h2>
            </div>

            <div className="navbar-links">
                <a href="/">Home</a>
                
                <a href="/login">login</a>
                <a href="/register">Register</a>
            </div>

            <div>
                <button>cart</button>
            </div>
        </nav>
    )
}

export default Navbar