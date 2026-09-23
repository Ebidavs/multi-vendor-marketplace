import "./products.css"

function Products(){
    return (
        
        <div className="products-page">
            <h1>Products</h1>
            <p>Explore products from different vendors.</p>
        
            
                
                <div className="product-grid">

                <div className="product-card">
                    <div className="product-image">Electronics</div>
                    <h2>Electronics</h2>
                    <p>Phones, laptops, gadgets and more.</p>
                    <button>Shop Now</button>

                </div>
                <div className="product-card">
                    <div className="product-image">Fashion</div>
                    <h2>Fashion</h2>
                    <p>Clothing, shoes, bags and accessories</p>
                    <button>Shop Now</button>
                </div>

                <div className="product-card">
                    <div className="product-image">Makeup & Beauty</div>
                    <h2>Makeup & Beauty</h2>
                    <p>Makeup, skincare and beauty products</p>
                    <button>Shop Now</button>
                </div>
            <div className="product-card">
                <div className="product-image">Home & Kitchen</div>
                <h2>Home & Kitchen</h2>
                <p>Furniture, kitchen items and home essentials</p>
                <button>Shop Now</button>
            </div>

            <div className="product-card">
        <div className="product-image">Shoes & Bags</div>
        <h2>Shoes & Bags</h2>
        <p>Footwear, handbag, backpacks and more.</p>
        <button>Shop Now</button>
            </div>

            <div className="product-card">
                <div className="product-image">Sports & Fitness</div>
                <h2>Sports & Fitness</h2>
                <p>Sportswear, gym equipment and fitness essentials.</p>
                <button>Shop Now</button>
            </div>
            </div>
    </div>
        
        

        
    );
}
export default Products