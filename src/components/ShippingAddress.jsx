import React, { useState, useEffect } from "react";
import { FaFlag, FaEdit, FaTrash } from "react-icons/fa";
import "./ShippingAddress.css";

const ShippingAddress = () => {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    addressName: "",
    address: "",
    note: "",
    isDefault: false,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await fetch(
        `http://localhost:5000/address?userId=${userInfo.id}`
      );
      const data = await response.json();
      setAddresses(data);
    };

    if (userInfo.id) {
      fetchAddresses();
    }
  }, [userInfo.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value,
    });
  };

  const updateOtherAddressesToNonDefault = async () => {
    let updatedAddresses = [...addresses];
    updatedAddresses = updatedAddresses.map((addr) => {
      if (addr.isDefault) {
        addr.isDefault = false;

        fetch(`http://localhost:5000/address/${addr.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isDefault: false }),
        });
      }
      return addr;
    });

    setAddresses(updatedAddresses);
  };

  const handleAddOrUpdate = async () => {
    if (newAddress.isDefault) {
      await updateOtherAddressesToNonDefault();
    }

    if (isEditing) {
      try {
        const response = await fetch(
          `http://localhost:5000/address/${editingAddressId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newAddress),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update address");
        }

        const updatedAddress = await response.json();
        setAddresses(
          addresses.map((addr) =>
            addr.id === editingAddressId ? updatedAddress : addr
          )
        );

        setNewAddress({
          addressName: "",
          address: "",
          note: "",
          isDefault: false,
        });
        setShowForm(false);
        setIsEditing(false);
        setEditingAddressId(null);
      } catch (error) {
        console.error("Error updating address:", error);
      }
    } else {
      try {
        const addressWithUser = {
          ...newAddress,
          userId: userInfo.id,
          email: userInfo.email,
        };

        const response = await fetch("http://localhost:5000/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressWithUser),
        });

        if (!response.ok) {
          throw new Error("Failed to save address");
        }

        const addedAddress = await response.json();
        setAddresses([...addresses, addedAddress]);

        // Reset form
        setNewAddress({
          addressName: "",
          address: "",
          note: "",
          isDefault: false,
        });
        setShowForm(false);
      } catch (error) {
        console.error("Error adding new address:", error);
      }
    }
  };

  const handleCancel = () => {
    setNewAddress({
      addressName: "",
      address: "",
      note: "",
      isDefault: false,
    });

    setShowForm(false);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  const handleEdit = (addressId) => {
    const addressToEdit = addresses.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      setNewAddress({
        addressName: addressToEdit.addressName,
        address: addressToEdit.address,
        note: addressToEdit.note,
        isDefault: addressToEdit.isDefault,
      });
      setIsEditing(true);
      setEditingAddressId(addressId);
      setShowForm(true);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await fetch(`http://localhost:5000/address/${addressId}`, {
        method: "DELETE",
      });
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="shipping-address">
      <h2 className="title">Địa Chỉ Giao Hàng</h2>
      {!showForm ? (
        <>
          <div className="address-list">
            {addresses.length === 0 ? (
              <p>Bạn chưa thêm địa chỉ.</p>
            ) : (
              <ul>
                {addresses.map((addr) => (
                  <li key={addr.id} className={addr.isDefault ? "default" : ""}>
                    <div className="address-header">
                      {addr.isDefault && <FaFlag className="flag-icon" />}
                      <div className="address-controls">
                        <button onClick={() => handleEdit(addr.id)}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(addr.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p>
                      <strong>{addr.addressName}</strong> ({addr.address})
                    </p>
                    <p>{addr.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Thêm Địa Chỉ
          </button>
        </>
      ) : (
        <div className="form-container">
          <div className="form-group">
            <label>Tên Địa Chỉ</label>
            <input
              type="text"
              name="addressName"
              value={newAddress.addressName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Địa Chỉ</label>
            <input
              type="text"
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Ghi Chú</label>
            <textarea
              name="note"
              value={newAddress.note}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group toggle-group">
            <span>Đặt làm địa chỉ mặc định</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancel}>
              Hủy
            </button>
            <button className="add-new-btn" onClick={handleAddOrUpdate}>
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
