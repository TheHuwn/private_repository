import React, { useState } from "react";
import "./Login.css";
import { registerWithEmail } from "./Firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Xử lý đăng ký bằng email và mật khẩu
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerWithEmail(email, password);
      navigate("/account-info");
    } catch (error) {
      console.error("Error registering with email:", error);
    }
  };

  // Xử lý chuyển hướng đến trang đăng nhập
  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-0">Tạo tài khoản</h2>

        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="action-buttons">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="action-btn"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
          <button type="submit" className="login-btn">
            Đăng ký
          </button>
        </form>
      </div>
      <div className="banner-img">
        <img
          src="https://th.bing.com/th/id/R.939539618b114aae1546c478ee95cd70?rik=G09qZmQz9iucDQ&pid=ImgRaw&r=0"
          alt="banner"
        />
      </div>
    </div>
  );
};

export default Register;
