import React, { useEffect, useState } from "react";
import "../styles/App.css";
import { validateMobile } from "./MobileValidation.js";

const ItemManagement = ({ apiBaseUrl }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch Items
  const fetchItems = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/items`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add Item
  const addItem = async (e) => {
    e.preventDefault();

    const validationResult = await validateMobile(mobileNumber, apiBaseUrl);
    if (validationResult.startsWith("Country Code: Unknown Code, Country Name: Unknown Country, Operator Name: Unknown Operator") ) {
      alert("Invalid Number");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, mobileNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      alert("Item added successfully");
      fetchItems();
      setName("");
      setDescription("");
      setMobileNumber("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Update Item
  const updateItem = async (e) => {
    e.preventDefault();

    const validationResult = await validateMobile(mobileNumber, apiBaseUrl);
    if (validationResult.startsWith("Country Code: Unknown Code, Country Name: Unknown Country, Operator Name: Unknown Operator")) {
      alert("Invalid Number");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, mobileNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      alert("Item updated successfully");
      fetchItems();
      setEditId(null);
      setName("");
      setDescription("");
      setMobileNumber("");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setName(item.name);
    setDescription(item.description);
    setMobileNumber(item.mobileNumber || "");
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      <h2>Item Management</h2>
      <form onSubmit={editId ? updateItem : addItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number (optional)"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button type="submit">{editId ? "Update Item" : "Add Item"}</button>
        {editId && <button onClick={() => setEditId(null)}>Cancel</button>}
      </form>
      <h3>Item List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.mobileNumber || "N/A"}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Update</button>
                <button
                className="delete-btn"
                onClick={() => {
                  const confirmed = window.confirm("Are you sure you want to delete this item?");
                  if (confirmed) {
                    fetch(`${apiBaseUrl}/api/delete/${item._id}`, { method: "DELETE" })
                      .then(() => fetchItems())
                      .catch(console.error);
                  }
                }}
                >
                Delete
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemManagement;


