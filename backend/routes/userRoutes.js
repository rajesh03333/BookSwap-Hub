const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require('multer'); // Add multer import for error handling
const { uploadProfilePicture } = require('../controllers/upload'); // <-- Import the uploadProfilePicture middleware
const bcrypt = require('bcrypt'); // <-- Import bcrypt
const jwt = require('jsonwebtoken'); // <-- Import jsonwebtoken
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users - Get all users (no changes)
router.get("/", async (req, res) => {
    // ... (keep existing code)
    try {
      const users = await User.find().select("-password"); // exclude passwords
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
  });

  // GET /api/users/:id - Get user by ID (no changes)
  router.get("/:id", async (req, res) => {
    // ... (keep existing code)
    try {
      const { id } = req.params;

      const user = await User.findById(id).select("-password"); // exclude password
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user", details: error.message });
    }
  });
// ... (other GET routes remain the same) ...

// POST /api/users/register - Updated to use uploadProfilePicture middleware
router.post("/register", uploadProfilePicture, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
       return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    // Add password length validation if desired

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let profilePicPath = null;
    if (req.file) {
      profilePicPath = '/uploads/' + req.file.filename;
    }

    // --- Hash Password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // --- End Hash Password ---

    const newUser = new User({
        name,
        email,
        password: hashedPassword, // <-- Save hashed password
        profilePic: profilePicPath
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User registered successfully", user: userResponse });

  } catch (error) {
    // ... (keep existing error handling) ...
     if (error instanceof require('multer').MulterError) { // Be specific with MulterError import if needed
        return res.status(400).json({ message: `File upload error: ${error.message}` });
     } else if (error.message === 'Error: Images Only!') {
         return res.status(400).json({ message: error.message });
     }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user", details: error.message });
  }
});

// POST /api/users/login - User Login
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required." });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: "Invalid credentials." }); // User not found
      }

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials." }); // Password doesn't match
      }

      // --- Generate JWT ---
      const payload = {
          user: {
              id: user.id, // Include user ID in the token payload
              name: user.name // Optionally include other non-sensitive info
          }
      };

      jwt.sign(
          payload,
          process.env.JWT_SECRET, // Your secret key from .env
          { expiresIn: '1h' }, // Token expiration (e.g., 1 hour)
          (err, token) => {
              if (err) throw err;

              // Exclude password from user object sent back
              const userResponse = user.toObject();
              delete userResponse.password;

              // Send token and user info (without password)
              res.status(200).json({
                  message: "Login successful",
                  token,
                  user: userResponse
              });
          }
      );
      // --- End JWT Generation ---

  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login.", details: error.message });
  }
});

// GET /api/users/me - Get current logged-in user data
router.get("/me", authMiddleware, async (req, res) => {
  try {
      // req.user.id is attached by authMiddleware
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
  }
});

// GET /api/users/me/listings - Get listings for current user
router.get("/me/listings", authMiddleware, async (req, res) => {
  try {
      const books = await require('../models/Book').find({ user: req.user.id }); // Find books by user ID from token
      res.json(books);
  } catch (error) {
       console.error(error.message);
       res.status(500).send("Server Error");
  }
});

// GET /api/users/me/wishlist - Get wishlist for current user
router.get("/me/wishlist", authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).populate('wishlist');
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json(user.wishlist);
  } catch (error) {
       console.error(error.message);
       res.status(500).send("Server Error");
  }
});

// POST /api/users/me/wishlist/:bookId - Add book to wishlist
router.post("/me/wishlist/:bookId", authMiddleware, async (req, res) => {
  try {
      const { bookId } = req.params;
      const userId = req.user.id;

      // Check if book exists
      const book = await require('../models/Book').findById(bookId);
      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      // Add book to wishlist if not already there
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if book is already in wishlist
      if (user.wishlist.includes(bookId)) {
          return res.status(400).json({ message: "Book already in wishlist" });
      }

      // Add book to wishlist
      user.wishlist.push(bookId);
      await user.save();

      res.status(200).json({ message: "Book added to wishlist", wishlist: user.wishlist });
  } catch (error) {
       console.error(error.message);
       res.status(500).send("Server Error");
  }
});

// DELETE /api/users/me/wishlist/:bookId - Remove book from wishlist
router.delete("/me/wishlist/:bookId", authMiddleware, async (req, res) => {
  try {
      const { bookId } = req.params;
      const userId = req.user.id;

      // Remove book from wishlist
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if book is in wishlist
      if (!user.wishlist.includes(bookId)) {
          return res.status(400).json({ message: "Book not in wishlist" });
      }

      // Remove book from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
      await user.save();

      res.status(200).json({ message: "Book removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
       console.error(error.message);
       res.status(500).send("Server Error");
  }
});



module.exports = router;