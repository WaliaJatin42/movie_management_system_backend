// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Expected format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // Attach decoded user to request
        next();
    });
};

// Middleware to check if user has allowed role(s)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
