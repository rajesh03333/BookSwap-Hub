const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: String,
    description: String,
    condition: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: String,

    // Relationship: Which user created this listing
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
