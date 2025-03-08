import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import "../styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cartQuery = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(cartQuery);
        const items = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (docId, delta) => {
    const item = cartItems.find((item) => item.docId === docId);
    const newQuantity = Math.max(1, item.quantity + delta);

    try {
      const itemRef = doc(db, "cart", docId);
      await updateDoc(itemRef, { quantity: newQuantity });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.docId === docId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity: ", error);
    }
  };

  const handleRemoveItem = async (docId) => {
    try {
      const itemRef = doc(db, "cart", docId);
      await deleteDoc(itemRef);
      setCartItems((prevItems) => prevItems.filter((item) => item.docId !== docId));
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {loading ? (
        <p className="loading">Loading cart...</p>
      ) : !user ? (
        <p className="empty-cart">Please log in to view your cart.</p>
      ) : cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.docId} className="cart-item">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/50"}
                  alt={item.name}
                  className="cart-item-image"
                />
                <span className="item-name">{item.name}</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.docId, -1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.docId, 1)}
                  >
                    +
                  </button>
                </div>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.docId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <Link to="/checkout" className="proceed-to-checkout">
            Proceed to Checkout
          </Link>
        </>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;