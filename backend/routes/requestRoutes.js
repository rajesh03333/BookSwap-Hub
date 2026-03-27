// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Authentication middleware
const {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateRequestStatus
} = require('../controllers/requestController');

// All routes are protected by auth middleware

// POST /api/requests - Create a new request
router.post('/', auth, createRequest);

// GET /api/requests/incoming - Get requests for the user's books
router.get('/incoming', auth, getIncomingRequests);

// GET /api/requests/outgoing - Get requests made by the user
router.get('/outgoing', auth, getOutgoingRequests);

// PUT /api/requests/:id - Update request status (accept, decline, cancel)
router.put('/:id', auth, updateRequestStatus);

module.exports = router;