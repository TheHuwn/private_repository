// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import AccountInfo from "./components/AccountInfo";
import ShippingAddress from "./components/ShippingAddress";
import OrderHistory from "./components/OrderHistory";
import Feedback from "./components/Feedback";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <div className={`content ${isLoggedIn ? "logged-in" : ""}`}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/account-info" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/account-info"
              element={isLoggedIn ? <AccountInfo /> : <Navigate to="/" />}
            />
            <Route
              path="/shipping"
              element={isLoggedIn ? <ShippingAddress /> : <Navigate to="/" />}
            />
            <Route
              path="/orders"
              element={isLoggedIn ? <OrderHistory /> : <Navigate to="/" />}
            />
            <Route
              path="/feedback"
              element={isLoggedIn ? <Feedback /> : <Navigate to="/" />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
