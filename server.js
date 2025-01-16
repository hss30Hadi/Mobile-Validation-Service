const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://hss30:H%40di1254%2C@cluster0.dcrio.mongodb.net/taskcode?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });


// Define Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mobileNumber: { type: String },
});

const Item = mongoose.model("Item", itemSchema);

// API for Mobile Validation
app.post("/validate", async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || typeof mobileNumber !== "string") {
    return res.status(400).json({ error: "Invalid number format" });
  }

  try {
    const response = await axios.get(
      `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${mobileNumber}`
    );

    console.log("Numverify API Response:", response.data);

    const { country_code, country_name, carrier } = response.data;

    res.json({
      countryCode: country_code,
      countryName: country_name,
      operatorName: carrier,
    });
  } catch (error) {
    console.error("Numverify API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch mobile details" });
  }
});

// Add Item
app.post("/api/add", async (req, res) => {
  const { name, description, mobileNumber } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const newItem = new Item({ name, description, mobileNumber });
    await newItem.save();
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update Item
app.put("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, mobileNumber } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description, mobileNumber },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete Item
app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get All Items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ error: error.message });
  }
});


  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
