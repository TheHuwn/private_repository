import React, { useState } from "react";
import "./Login.css";
import { signInWithGoogle, loginWithEmail } from "./Firebase";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Xử lý đăng nhập bằng email và mật khẩu
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginWithEmail(email, password);
      if (user) {
        onLogin();
        navigate("/account-info");
      }
    } catch (error) {
      console.error("Error logging in with email:", error);
    }
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google User:", user);

      onLogin();
      navigate("/account-info");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Đăng nhập bằng Google không thành công, vui lòng thử lại.");
    }
  };
  // Xử lý chuyển hướng đến trang quên mật khẩu
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Xử lý chuyển hướng đến trang tạo tài khoản mới
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-0">Đăng nhập</h2>

        <form onSubmit={handleEmailLogin}>
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
              onClick={handleForgotPassword}
              className="action-btn"
            >
              Quên mật khẩu?
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="action-btn"
            >
              Tạo tài khoản
            </button>
          </div>
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>

        <br />
        <p className="text-1">hoặc Đăng nhập bằng</p>
        <div className="social-login">
          <button className="google-btn" onClick={handleGoogleSignIn}>
            GOOGLE
          </button>
        </div>
      </div>
      <div className="banner-img">
        <img
          src="https://th.bing.com/th/id/R.939539618b114aae1546c478ee95cd70?rik=G09qZmQz9iucDQ&pid=ImgRaw&r=0"
          alt="banner"
        />
      </div>
    </div>
  );
}

export default Login;
