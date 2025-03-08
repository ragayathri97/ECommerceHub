import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div>
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><a href="/auth">Login</a></li>
            <li><a href="/auth">Sign Up</a></li>
            <li><a href="/orders">Order Tracking</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow Us</h4>
          <ul>
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
          </ul>
        </div>
      </div>
      <p className="footer-copyright">
        © 2025 ECommerceHub. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;