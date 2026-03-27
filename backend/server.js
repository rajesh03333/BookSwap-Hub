const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// 🔥 NEW (Socket.IO)
const http = require("http");
const { Server } = require("socket.io");

// Load env
dotenv.config();

// Passport & Routes
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const Message = require("./models/Message");

// Debug logs
console.log("bookRoutes:", bookRoutes);
console.log("userRoutes:", userRoutes);
console.log("requestRoutes:", requestRoutes);

// App setup
const app = express();

// 🔥 Create HTTP server
const server = http.createServer(app);

// ENV
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://book-swap-lac.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("BookSwap API is running!");
});


// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  app.get("/api/chats/:userId", async (req, res) => {
  const userId = req.params.userId;

  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  res.json(messages);
});

app.get("/api/messages/:roomId", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: 1 });

  res.json(messages);
});

  // Send message
  const Message = require("./models/Message");

socket.on("send_message", async (data) => {
  console.log("📩 Incoming message:", data);

  try {
    const saved = await Message.create(data);
    console.log("✅ Saved to DB:", saved);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }

  socket.to(data.roomId).emit("receive_message", data);
});

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});


// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // 🔥 IMPORTANT: use server.listen (NOT app.listen)
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));