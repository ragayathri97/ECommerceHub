import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import "../styles/Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-link">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-shop">No products available.</p>
      )}
    </div>
  );
};

export default Shop;