// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Ensures exactly 10 digits
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  email: { 
    type: String, 
    unique: true, // Prevents duplicate emails
    sparse: true, // Allows multiple contacts to not have an email
    trim: true,
    lowercase: true
  },
  notes: { 
    type: String,
    maxLength: [200, 'Notes cannot exceed 200 characters']
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Contact', ContactSchema);