// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Contact = require("./models/Contact");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * MongoDB Connection
 */
async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    console.log("====================================");
    console.log("Connecting to MongoDB...");
    console.log(
      "MONGO_URI:",
      process.env.MONGO_URI.replace(
        /(mongodb\+srv:\/\/)(.*):(.*)@/,
        "$1****:****@"
      )
    );
    console.log("====================================");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    await mongoose.connection.db.admin().ping();

    console.log("MongoDB Ping Successful");
  } catch (err) {
    console.error("MongoDB Connection Failed");
    console.error(err);

    process.exit(1);
  }
}

/**
 * MongoDB Events
 */

mongoose.connection.on("connected", () => {
  console.log("Mongo Event: connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongo Event: error");
  console.error(err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongo Event: disconnected");
});

/**
 * Routes
 */

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is running smoothly"
  });
});

/**
 * Create Contact
 */
app.post("/api/contacts", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const contact = new Contact(req.body);

    console.log("Saving contact...");

    const savedContact = await contact.save();

    console.log("Contact Saved");

    res.status(201).json(savedContact);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Get All Contacts
 */
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      name: 1,
    });

    res.json(contacts);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * Get Single Contact
 */
app.get("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json(contact);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * Update Contact
 */
app.put("/api/contacts/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * Delete Contact
 */
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * Start Server
 */

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log("====================================");
    console.log(`Server Running on Port ${PORT}`);
    console.log("====================================");
  });
}

startServer();