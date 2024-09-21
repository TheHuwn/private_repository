import React, { useState, useEffect } from "react";
import "./AccountInfo.css";

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState({
    id: null,
    fullName: "",
    dob: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // Lấy thông tin từ localStorage
      const savedInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (savedInfo) {
        setUserInfo(savedInfo);
      } else {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();
        if (data.length > 0) {
          setUserInfo(data[0]);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const saveInfo = () => {
    const method = userInfo.id ? "PUT" : "POST";
    const url = userInfo.id
      ? `http://localhost:5000/users/${userInfo.id}`
      : "http://localhost:5000/users";

    // Gửi thông tin tới server
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!userInfo.id) {
          setUserInfo({ ...userInfo, id: data.id });
        }
        localStorage.setItem("userInfo", JSON.stringify(data));
        alert("Information saved!");
      })
      .catch((error) => console.error("Error saving to db.json:", error));
  };

  const deleteInfo = () => {
    if (!userInfo.id) {
      alert("No user found to delete.");
      return;
    }

    // Xóa thông tin khỏi server
    fetch(`http://localhost:5000/users/${userInfo.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        localStorage.removeItem("userInfo");
        setUserInfo({
          id: null,
          fullName: "",
          dob: "",
          phone: "",
          email: "",
        });
        alert("Account deleted!");
      })
      .catch((error) => console.error("Error deleting from db.json:", error));
  };

  return (
    <div className="account-info">
      <h2 className="title">Thông Tin Tài Khoản</h2>

      <div className="form-group">
        <label>Họ và Tên</label>
        <input
          type="text"
          name="fullName"
          value={userInfo.fullName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Ngày Sinh</label>
        <input
          type="date"
          name="dob"
          value={userInfo.dob}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Số Điện Thoại</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="buttons">
        <button className="delete-btn" onClick={deleteInfo}>
          Xóa Tài Khoản
        </button>
        <button className="save-btn" onClick={saveInfo}>
          Lưu Thông Tin
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
