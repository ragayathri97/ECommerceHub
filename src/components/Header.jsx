import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  const user = auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">ECommerceHub</Link>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
          <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link></li>
          <li><Link to="/checkout" onClick={() => setIsMenuOpen(false)}>Checkout</Link></li>
        </ul>
        <div>
          {user ? (
            <button
              className="logout-button"
              onClick={() => signOut(auth)}
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="auth-button">
              Login/Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;