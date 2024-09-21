import React, { useState } from "react";
import { sendPasswordReset } from "./Firebase";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    await sendPasswordReset(email);
  };

  return (
    <div className="forgot-password">
      <Link to="/" className="back-link">
        <span className="back-arrow">&larr;</span>
      </Link>
      <h2>Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Đặt lại mật khẩu</button>
    </div>
  );
};

export default ForgotPassword;
