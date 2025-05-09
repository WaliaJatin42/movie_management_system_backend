const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require("../models/UserModel");
const validateRequest = require('../services/validateRequest');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

const loginSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(8).max(32)
});

const Login = async (req, res) => {
    const validated = validateRequest(loginSchema, req.body, res, 'login');
    if (!validated) return;

    const { username, password } = validated;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error('login error:', err);
        res.status(400).json({ message: "Some exception occurred", error: err.message });
    }
};

module.exports = { Login };