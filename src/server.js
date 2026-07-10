// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Contact = require('./models/Contact');

const app = express();
app.use(express.json()); // Allows the server to parse JSON payloads

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Database connection error:', err));

// 1. CREATE: Add a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. READ: Get all contacts (Sorted alphabetically from A to Z)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ name: 1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. UPDATE: Modify a contact's details by ID
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // "runValidators" ensures updates still pass the 10-digit phone rule
    );
    if (!updatedContact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. DELETE: Remove a contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json({ message: 'Contact successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));