import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

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
          imageUrl: product.imageUrl || "https://via.placeholder.com/50", // Store imageUrl
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

  return (
    <div className="product-card">
      <img
        src={product.imageUrl || "https://via.placeholder.com/150"}
        alt={product.name}
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;