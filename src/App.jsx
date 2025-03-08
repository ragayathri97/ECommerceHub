import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Cart from "./components/Cart";
import AuthForm from "./components/AuthForm";
import ProductDetail from "./pages/ProductDetail"; // Import the new page
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/product/:id" element={<ProductDetail />} /> {/* New route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;