// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const { uploadBookImage } = require('../controllers/upload'); // Import the uploadBookImage middleware
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController"); // Destructured controller functions

// --- Public Routes ---
// GET /api/books - Get all books
router.get("/", getAllBooks);

// GET /api/books/:id - Get a single book by ID
router.get("/:id", getBookById);

// --- Protected Routes (Require Authentication) ---

// POST /api/books - Add a new book
// Apply auth middleware, then uploadBookImage middleware, then call the addBook function
router.post("/", auth, uploadBookImage, addBook);

// PUT /api/books/:id - Update an existing book
// Apply auth middleware, then call the updateBook function
router.put("/:id", auth, updateBook);

// DELETE /api/books/:id - Delete a book
// Apply auth middleware, then call the deleteBook function
router.delete("/:id", auth, deleteBook);

// The duplicate router.post('/add', addBook); has been removed.
// The lines attempting to use bookController.addBook etc. have been removed as they were incorrect after destructuring.

module.exports = router;