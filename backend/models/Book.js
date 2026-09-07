// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     genre: String,
//     description: String,
//     condition: { type: String, required: true },
//     price: { type: Number, required: true },
//     available: { type: Boolean, default: true },
//     imageUrl: String,

//     // Relationship: Which user created this listing
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

bookSchema.index({
  title: 'text',
  author: 'text',
  genre: 'text'
});

bookSchema.index({ title: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ condition: 1 });
bookSchema.index({ createdAt: -1 });

const Book = mongoose.model('Book', bookSchema);

async function searchBooks() {
  const result = await Book.find({
    $text: { $search: "java" }
  }).explain("executionStats");

  console.log(
    "Search Time:",
    result.executionStats.executionTimeMillis,
    "ms"
  );

  console.log(
    "Documents Examined:",
    result.executionStats.totalDocsExamined
  );

  console.log(
    "Documents Returned:",
    result.executionStats.nReturned
  );
}

searchBooks();

module.exports = mongoose.model('Book', bookSchema);
