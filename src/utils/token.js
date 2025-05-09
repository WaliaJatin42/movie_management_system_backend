const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // 24 hours
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }  // 7 days
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
