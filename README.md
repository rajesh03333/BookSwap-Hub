# BookSwap Hub 📚

BookSwap Hub is a full-stack web application that provides a centralized marketplace for buying and selling second-hand books. Users can create book listings, browse available books, search by title or author, manage wishlists, send purchase requests, and communicate with other users through real-time chat.

The project is built with React.js, Node.js, Express.js, MongoDB, and Socket.IO.

## ✨ Features

### 📚 Book Marketplace

* Create and manage second-hand book listings
* Add book title, author, genre, description, condition, and price
* Upload book images
* View detailed information about individual books
* Update and delete your own listings
* Track book availability

### 🔍 Book Search

* Browse all available books
* Search books by title, author, or genre
* Debounced search to reduce unnecessary API requests
* MongoDB text indexes for title, author, and genre

### 🔐 Authentication

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes for authenticated users
* Google authentication using Google Identity Services
* Google OAuth support through Passport.js

### ❤️ Wishlist

* Add books to a personal wishlist
* View saved books
* Remove books from the wishlist

### 🤝 Book Requests

* Send requests for available books
* Add a message and optional contact details
* View incoming requests for your listings
* View outgoing requests made by you
* Accept, decline, or cancel requests
* Authorization checks ensure only the appropriate user can modify a request

### 💬 Real-Time Chat

* Real-time buyer-seller messaging using Socket.IO
* Room-based conversations
* Messages are stored in MongoDB
* Previous messages can be loaded when reopening a conversation

### 👤 User Dashboard

* View personal information
* Manage book listings
* View incoming and outgoing book requests
* Manage wishlist items

### 🖼️ Image Uploads

* Profile picture uploads
* Book image uploads
* Supports JPEG, JPG, PNG, GIF, and WebP
* Maximum upload size of 5 MB
* Uploaded images are served through the backend `/uploads` route

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Vite
* Socket.IO Client
* Google OAuth

### Backend

* Node.js
* Express.js
* REST APIs
* Socket.IO
* Passport.js
* JWT
* Multer
* bcrypt

### Database

* MongoDB
* Mongoose

---

## 🏗️ Architecture

```text
BookSwap Hub
│
├── frontend/
│   ├── components/
│   │   ├── Navbar
│   │   ├── Footer
│   │   ├── BookCard
│   │   ├── Chat
│   │   └── SwapRequestModal
│   │
│   ├── pages/
│   │   ├── HomePage
│   │   ├── BrowsePage
│   │   ├── BookDetailsPage
│   │   ├── AddBookPage
│   │   ├── Dashboard
│   │   ├── WishlistPage
│   │   ├── ChatPage
│   │   ├── LoginPage
│   │   └── SignupPage
│   │
│   └── context/
│       └── AuthContext
│
└── backend/
    ├── controllers/
    │   ├── auth.js
    │   ├── bookController.js
    │   ├── requestController.js
    │   └── upload.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Book.js
    │   ├── Request.js
    │   └── Message.js
    │
    ├── routes/
    │   ├── auth.js
    │   ├── bookRoutes.js
    │   ├── requestRoutes.js
    │   └── userRoutes.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    └── server.js
```

---

## 🔄 Application Flow

```text
User
  │
  ▼
React Frontend
  │
  ├── Authentication
  │      │
  │      ▼
  │   JWT / Google Auth
  │
  ├── Book Operations
  │      │
  │      ▼
  │   Express REST APIs
  │      │
  │      ▼
  │   MongoDB
  │
  ├── Book Requests
  │      │
  │      ▼
  │   Request API
  │      │
  │      ▼
  │   MongoDB
  │
  └── Real-Time Chat
         │
         ▼
      Socket.IO
         │
         ▼
      MongoDB
```

---

## 📁 Database Models

### User

Stores user information including:

* Name
* Email
* Hashed password
* Profile picture
* Google ID
* Wishlist
* User connections
* Timestamps

### Book

Stores:

* Title
* Author
* Genre
* Description
* Condition
* Price
* Availability
* Image URL
* Listing owner
* Timestamps

A MongoDB text index is created on:

```text
title
author
genre
```

### Request

Stores book request information:

* Requested book
* Seller
* Requester
* Message
* Contact details
* Request status
* Timestamps

Request statuses:

```text
pending
accepted
declined
cancelled
```

### Message

Stores chat messages containing:

* Room ID
* Sender ID
* Receiver ID
* Message text
* Creation timestamp

---

## 🔌 API Endpoints

### Books

| Method | Endpoint         | Description                  | Auth |
| ------ | ---------------- | ---------------------------- | ---- |
| GET    | `/api/books`     | Get all books / search books | No   |
| GET    | `/api/books/:id` | Get book details             | No   |
| POST   | `/api/books`     | Create a book listing        | Yes  |
| PUT    | `/api/books/:id` | Update a listing             | Yes  |
| DELETE | `/api/books/:id` | Delete a listing             | Yes  |

### Authentication

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| POST   | `/api/users/register` | Register a user           |
| POST   | `/api/users/login`    | Login with email/password |
| POST   | `/api/auth/google`    | Google authentication     |
| GET    | `/api/users/me`       | Get current user          |

### Wishlist

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/users/me/wishlist`         | Get wishlist              |
| POST   | `/api/users/me/wishlist/:bookId` | Add book to wishlist      |
| DELETE | `/api/users/me/wishlist/:bookId` | Remove book from wishlist |

### Book Requests

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/requests`          | Create book request   |
| GET    | `/api/requests/incoming` | Get incoming requests |
| GET    | `/api/requests/outgoing` | Get outgoing requests |
| PUT    | `/api/requests/:id`      | Update request status |

### Chat

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/api/messages/:roomId` | Get messages for a chat room        |
| GET    | `/api/chats/:userId`    | Get messages associated with a user |

Real-time messaging is handled through Socket.IO events:

```text
join_room
send_message
receive_message
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/rajesh03333/BookSwap-Hub.git
cd BookSwap-Hub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
PORT=5000
```

For the frontend, configure the Vite environment variables required by the application, such as:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Never commit your actual `.env` file, passwords, JWT secrets, or OAuth credentials to GitHub.**

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🔒 Security

The application implements several security mechanisms:

* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* Authorization checks for book ownership
* Authorization checks for request actions
* Google ID token verification
* Passwords excluded from user responses
* File type validation for uploads
* 5 MB upload size limit

---

## 📌 Future Improvements

Potential improvements include:

* Payment integration
* Advanced filtering by genre, condition, and price
* Pagination for large book collections
* Improved chat notifications
* Cloud-based image storage
* Book recommendation system
* Ratings and reviews
* Deployment with production-ready infrastructure
* Automated testing
* API documentation with Swagger/OpenAPI

---
