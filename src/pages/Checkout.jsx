import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import "../styles/Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  // Fetch cart items from Firestore
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

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!shippingInfo.name.trim()) errors.name = "Full Name is required";
    if (!shippingInfo.address.trim()) errors.address = "Address is required";
    if (!shippingInfo.city.trim()) errors.city = "City is required";
    if (!shippingInfo.postalCode.trim()) errors.postalCode = "Postal Code is required";
    if (!shippingInfo.country.trim()) errors.country = "Country is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Simulate payment processing (replace with actual payment gateway in production)
      setIsSubmitted(true);
      console.log("Order submitted:", { cartItems, shippingInfo, total });

      // Clear the cart in Firestore
      const cartQuery = query(
        collection(db, "cart"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(cartQuery);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Failed to place order. Please try again.");
      setIsSubmitted(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {loading ? (
        <p className="loading">Loading cart...</p>
      ) : !user ? (
        <p className="empty-cart">
          Please <Link to="/auth">log in</Link> to proceed with checkout.
        </p>
      ) : cartItems.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. <Link to="/shop">Continue shopping</Link>.
        </p>
      ) : !isSubmitted ? (
        <>
          <section className="cart-summary">
            <h2>Your Cart</h2>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.docId} className="cart-item">
                  <span className="item-name">{item.name} x{item.quantity}</span>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
            </div>
          </section>

          <section className="shipping-details">
            <h2>Shipping Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  required
                />
                {formErrors.name && <span className="error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  required
                />
                {formErrors.address && <span className="error">{formErrors.address}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleChange}
                  required
                />
                {formErrors.city && <span className="error">{formErrors.city}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleChange}
                  required
                />
                {formErrors.postalCode && <span className="error">{formErrors.postalCode}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleChange}
                  required
                />
                {formErrors.country && <span className="error">{formErrors.country}</span>}
              </div>
              <button type="submit" className="place-order-button">
                Place Order
              </button>
            </form>
          </section>
        </>
      ) : (
        <div className="order-confirmation">
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been placed successfully.</p>
          <p>Total Paid: ${total.toFixed(2)}</p>
          <p>Redirecting to homepage in 3 seconds...</p>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Checkout;