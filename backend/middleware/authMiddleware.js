const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure JWT_SECRET is loaded

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token format is correct (Bearer <token>)
    if (!token.startsWith('Bearer ')) {
         return res.status(401).json({ message: 'Token format is invalid' });
    }

    // Extract token value
    const tokenValue = token.split(' ')[1];

    if (!tokenValue) {
         return res.status(401).json({ message: 'Token value missing' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Add user payload from token to the request object
        req.user = decoded.user; // Assuming your payload has a 'user' object with 'id'
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};