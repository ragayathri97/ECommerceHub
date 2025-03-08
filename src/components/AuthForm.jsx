import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/AuthForm.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        navigate("/"); // Redirect to home page after login
      } else {
        // Sign Up
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        setIsLogin(true); // Switch to login form
        setEmail(""); // Clear email field
        setPassword(""); // Clear password field
      }
    } catch (error) {
      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        alert("User already exists. Please log in.");
        setIsLogin(true); // Switch to login form if user already exists
        setEmail(email); // Retain email field
        setPassword(""); // Clear password field
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(error.message); // Display other errors
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleAuth} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="submit-button">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null); // Clear error when switching forms
            setEmail(""); // Clear email field
            setPassword(""); // Clear password field
          }}
          className="switch-button"
        >
          Switch to {isLogin ? "Sign Up" : "Login"}
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default AuthForm;