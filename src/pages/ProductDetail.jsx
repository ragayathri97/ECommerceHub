import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          navigate("/shop");
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
        navigate("/shop");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    setIsLoading(true);
    try {
      const cartQuery = query(
        collection(db, "cart"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const querySnapshot = await getDocs(cartQuery);

      if (!querySnapshot.empty) {
        const cartItemDoc = querySnapshot.docs[0];
        const cartItemRef = doc(db, "cart", cartItemDoc.id);
        const newQuantity = cartItemDoc.data().quantity + 1;
        await updateDoc(cartItemRef, { quantity: newQuantity });
      } else {
        await addDoc(collection(db, "cart"), {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || "https://via.placeholder.com/50",
          quantity: 1,
        });
      }
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <p className="loading">Loading product details...</p>;
  }

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Shop
      </button>
      <div className="product-detail">
        <div className="product-image-container">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className={`product-image ${isZoomed ? "zoomed" : ""}`}
            onClick={handleImageClick}
          />
        </div>
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-description">
            {product.description ||
              "This is a high-quality product designed to enhance your experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;