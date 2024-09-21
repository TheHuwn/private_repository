import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShippingFast,
  FaHistory,
  FaSignOutAlt,
  FaHeart,
  FaList,
  FaComments,
  FaHeadset,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    id: null,
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    photoURL: "default-avatar.png",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const savedInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (savedInfo) {
      setUserInfo(savedInfo);
      setPreviewImage(savedInfo.photoURL);
    }
  }, []);

  const handleSignOut = () => {
    onLogout();
    navigate("/");
  };

  // Xử lý khi người dùng chọn ảnh mới
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result;
        setPreviewImage(newImage);
        updateUserInfoWithNewImage(newImage);
      };
      reader.readAsDataURL(file); // Đọc file ảnh và chuyển thành base64
    }
  };

  // Hàm cập nhật ảnh người dùng trong db.json
  const updateUserInfoWithNewImage = (newImage) => {
    const updatedUserInfo = { ...userInfo, photoURL: newImage };

    fetch(`http://localhost:5000/users/${userInfo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserInfo(data);
      })
      .catch((error) => console.error("Error updating user info:", error));
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <div className="avatar">
          <label htmlFor="avatar-input">
            <img
              src={previewImage || "default-avatar.png"}
              alt="avatar"
              style={{ cursor: "pointer" }}
            />
          </label>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="username">{userInfo.fullName || "Guest"}</div>
      </div>

      <ul className="menu">
        <li>
          <Link to="/account-info" className="menu-link">
            <FaUser /> Thông tin tài khoản
          </Link>
        </li>

        <li>
          <Link to="/shipping" className="menu-link">
            <FaShippingFast /> Địa chỉ giao hàng
          </Link>
        </li>
        <li>
          <Link to="/orders" className="menu-link">
            <FaHistory /> Lịch sử đơn hàng
          </Link>
        </li>
        <li>
          <Link to="/coupons" className="menu-link">
            <FaList /> Phiếu giảm giá
          </Link>
        </li>
        <li>
          <Link to="/wishlist" className="menu-link">
            <FaHeart /> Danh sách yêu thích
          </Link>
        </li>
        <li>
          <Link to="/feedback" className="menu-link">
            <FaComments /> Phản hồi
          </Link>
        </li>
        <li>
          <a
            href="https://www.facebook.com/messages/t/8426391594066578"
            className="menu-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaHeadset /> Hỗ trợ
          </a>
        </li>
        <li className="menu-link Sign-out-btn">
          <button onClick={handleSignOut}>
            <FaSignOutAlt /> Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
