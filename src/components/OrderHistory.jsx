import React, { useState, useEffect } from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [orders, setOrders] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}; // Lấy thông tin người dùng

  // Fetch orders from db.json (mock API)
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `http://localhost:5000/orders?userId=${userInfo.id}` // Lọc đơn hàng theo userId
      );
      const data = await response.json();
      setOrders(data);
    };

    if (userInfo.id) {
      fetchOrders();
    }
  }, [userInfo.id]);

  // Hàm để lọc đơn hàng theo tab được chọn
  const filterOrders = () => {
    switch (selectedTab) {
      case "Completed":
        return orders.filter((order) => order.status === "Completed");
      case "Prepare":
        return orders.filter((order) => order.status === "Prepare Dish");
      case "Delivery":
        return orders.filter((order) => order.status === "Are Delivery");
      case "Ord":
        return orders.filter((order) => order.status === "Ord");
      default:
        return orders; // ALL
    }
  };

  return (
    <div className="order-history">
      <h2 className="title">Lịch Sử Đặt Hàng</h2>

      <div className="tabs">
        <button
          onClick={() => setSelectedTab("ALL")}
          className={selectedTab === "ALL" ? "active" : ""}
        >
          Tất Cả
        </button>
        <button
          onClick={() => setSelectedTab("Completed")}
          className={selectedTab === "Completed" ? "active" : ""}
        >
          Đã Đặt Hàng
        </button>
        <button
          onClick={() => setSelectedTab("Prepare")}
          className={selectedTab === "Prepare" ? "active" : ""}
        >
          Đang Chuẩn bị
        </button>
        <button
          onClick={() => setSelectedTab("Delivery")}
          className={selectedTab === "Delivery" ? "active" : ""}
        >
          Đang Giao
        </button>
        <button
          onClick={() => setSelectedTab("Ord")}
          className={selectedTab === "Ord" ? "active" : ""}
        >
          Ord
        </button>
      </div>

      <div className="order-list">
        {filterOrders().length === 0 ? (
          <p>Bạn chưa đặt hàng.</p>
        ) : (
          <ul>
            {filterOrders().map((order) => (
              <li key={order.id}>
                <p>
                  <strong>Order #{order.id}</strong>
                </p>
                <p>Status: {order.status}</p>
                <p>Total: {order.total} USD</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
