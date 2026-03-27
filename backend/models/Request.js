const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  // The book being requested
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  // The user who owns the book (seller)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The user making the request (buyer)
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Message from the requester to the seller
  message: {
    type: String,
    required: true
  },
  // Status of the request: 'pending', 'accepted', 'declined', 'cancelled'
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  },
  // Optional contact details provided by the requester
  contactDetails: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);