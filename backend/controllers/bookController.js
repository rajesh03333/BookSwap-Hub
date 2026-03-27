// controllers/bookController.js
const Book = require("../models/Book");


// GET /api/books - Fetch all books (Public)
const getAllBooks = async (req, res) => {
  try {
    // Optional: Add filtering/pagination later if needed
    const books = await Book.find()
                            .populate('user', 'name email profilePic') // Populate seller info
                            .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(books);
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).json({ message: "Failed to fetch books", details: error.message });
  }
};

// GET /api/books/:id - Fetch book by ID (Public)
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id)
                           .populate('user', 'name email profilePic'); // Populate seller info

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
     console.error("Get book by ID error:", error);
     // Handle invalid ObjectId format error
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid book ID format" });
     }
    res.status(500).json({ message: "Failed to fetch book", details: error.message });
  }
};

// POST /api/books - Add a new book (Protected by authMiddleware)
const addBook = async (req, res) => {
  try {
    // User ID is now obtained from the verified token via authMiddleware
    const userId = req.user.id;

    // Get book data from request body
    const { title, author, genre, description, condition, price, available } = req.body;

    // Basic validation (User ID comes from token, no need to validate its existence here)
    if (!title || !author || !condition || price === undefined) {
      return res.status(400).json({ message: "Title, Author, Condition, and Price are required" });
    }

    // Handle uploaded image if present
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newBook = new Book({
      title,
      author,
      genre, // Optional
      description, // Optional
      condition,
      price,
      available: available !== undefined ? available : true, // Default to available if not provided
      user: userId, // Set the user ID from the token
      imageUrl, // Set the image URL from the uploaded file
    });

    await newBook.save();
    // Populate user info in the response
    const populatedBook = await Book.findById(newBook._id).populate('user', 'name email profilePic');

    res.status(201).json({ message: "Book added successfully", book: populatedBook });
  } catch (error) {
    console.error("Add book error:", error);
    if (error instanceof require('multer').MulterError) {
      return res.status(400).json({ message: `File upload error: ${error.message}` });
    } else if (error.message === 'Error: Images Only!') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to add book", details: error.message });
  }
};

// PUT /api/books/:id - Update an existing book (Protected by authMiddleware)
const updateBook = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.id; // Get user ID from token
    const { title, author, description, genre, condition, price, available, imageUrl } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // --- Ownership Check ---
    if (book.user.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to update this book" });
    }
    // --- End Ownership Check ---

    // Update fields if they are provided in the request body
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (genre) book.genre = genre;
    if (condition) book.condition = condition;
    if (price !== undefined) book.price = price;
    if (available !== undefined) book.available = available;
    if (imageUrl !== undefined) book.imageUrl = imageUrl; // Allow updating image URL (or handle file upload)

    const updatedBook = await book.save();
    const populatedBook = await Book.findById(updatedBook._id).populate('user', 'name email profilePic');

    res.status(200).json({ message: "Book updated successfully", book: populatedBook });
  } catch (error) {
     console.error("Update book error:", error);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid book ID format" });
     }
    res.status(500).json({ message: "Failed to update book", details: error.message });
  }
};

// DELETE /api/books/:id - Delete a book by ID (Protected by authMiddleware)
const deleteBook = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.id; // Get user ID from token

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // --- Ownership Check ---
    if (book.user.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to delete this book" });
    }
    // --- End Ownership Check ---

    await Book.findByIdAndDelete(bookId);
    // TODO: Consider deleting associated image file from storage if applicable

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid book ID format" });
     }
    res.status(500).json({ message: "Failed to delete book", details: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};