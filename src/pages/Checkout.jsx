import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Checkout.css"; // Import the separate CSS file

const Checkout = () => {
  // Mock cart state (replace with Firebase or Redux later)
  const [cartItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 49.99, quantity: 1 },
    { id: 2, name: "Smartphone Case", price: 19.99, quantity: 2 },
  ]);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, you’d send this data to Firebase or a payment gateway
    console.log("Order submitted:", { cartItems, shippingInfo, total });
    alert("Order placed successfully! (This is a mock submission)");
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {!isSubmitted ? (
        <>
          <section className="cart-summary">
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="cart-total">
                  <strong>Total: ${total.toFixed(2)}</strong>
                </div>
              </div>
            ) : (
              <p>Your cart is empty.</p>
            )}
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
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Checkout;