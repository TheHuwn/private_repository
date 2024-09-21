import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    location: "",
    issue: "",
    content: "",
    fullName: "",
    phone: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      setSuccessMessage("Phản hồi thành công! Cảm ơn bạn đã đóng góp.");
      setShowSuccessMessage(true);
      setFeedbackData({
        location: "",
        issue: "",
        content: "",
        fullName: "",
        phone: "",
        email: "",
      });

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-form">
      <h2>Phản Hồi</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cơ sở</label>
          <select
            name="location"
            value={feedbackData.location}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn cơ sở</option>
            <option value="Cơ sở 1">Cơ sở 1</option>
            <option value="Cơ sở 2">Cơ sở 2</option>
            <option value="Cơ sở 3">Cơ sở 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>Vấn đề phản hồi</label>
          <select
            name="issue"
            value={feedbackData.issue}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn vấn đề</option>
            <option value="Dịch vụ">Dịch vụ</option>
            <option value="Chất lượng món ăn">Chất lượng món ăn</option>
            <option value="Vệ sinh">Vệ sinh</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nội dung phản hồi</label>
          <textarea
            name="content"
            value={feedbackData.content}
            onChange={handleInputChange}
            required
          />
        </div>

        <h3>Thông tin người phản hồi</h3>

        <div className="form-group">
          <label>Tên</label>
          <input
            type="text"
            name="fullName"
            value={feedbackData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={feedbackData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={feedbackData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="buttons">
          <button type="submit" className="submit-btn">
            Gửi
          </button>
        </div>
        {showSuccessMessage && (
          <p className="success-message">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default Feedback;
