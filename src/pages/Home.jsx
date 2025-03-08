import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch featured products from Firestore
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Limit to 8 products for "featured" section
        setFeaturedProducts(productList.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Welcome to ECommerceHub</h1>
        <p>Discover the best deals on electronics, fashion, and more!</p>
        <p>Shop now and enjoy fast shipping on all orders over $50.</p>
        <Link to="/shop" className="shop-now-button">
          Shop Now
        </Link>
      </header>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        {featuredProducts.length > 0 ? (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="loading">Loading featured products...</p>
        )}
      </section>

      {/* Promotional Banner Section */}
      <section className="promo-section">
        <div className="promo-banner">
          <h3>Special Offer!</h3>
          <p>Get 20% off on your first purchase. Use code: WELCOME20</p>
          <Link to="/shop" className="shop-now-button">
            Claim Offer
          </Link>
        </div>
        <div className="promo-banner">
          <h3>Free Shipping</h3>
          <p>Enjoy free shipping on orders over $50. Shop today!</p>
          <Link to="/shop" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <h2>About ECommerceHub</h2>
        <p>
          At ECommerceHub, we’re passionate about bringing you the best products
          at the lowest prices. With a wide range of categories including
          electronics, clothing, and accessories, we strive to make your shopping
          experience seamless and enjoyable. Join thousands of satisfied
          customers today!
        </p>
        <Link to="/shop" className="shop-now-button">
          Explore Our Story
        </Link>
      </section>
    </div>
  );
};

export default Home;