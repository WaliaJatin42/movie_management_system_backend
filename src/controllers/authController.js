const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require("../models/UserModel");
const Session = require("../models/SessionModel");
const validateRequest = require('../services/validateRequest');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

const loginSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(8).max(32)
});

const resetSchema = z.object({
    user_id: z.string(),
    newPassword: z.string().min(8).max(32)
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
        await Session.updateMany({ userId: user._id }, { isValid: false });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await Session.create({ userId: user._id, refreshToken });
        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error('login error:', err);
        res.status(400).json({ message: "Some exception occurred", error: err.message });
    }
};

const Logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
    try {
        await Session.findOneAndUpdate({ refreshToken }, { isValid: false });
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error('logout error:', err);
        res.status(400).json({ message: "Logout failed", error: err.message });
    }
};

const ResetPassword = async (req, res) => {
    const validated = validateRequest(resetSchema, req.body, res, 'reset');
    if (!validated) return;
    const { user_id, newPassword } = validated;
    try {
        const user = await User.findOne({ user_id: Number(user_id) });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error('reset error:', err);
        res.status(400).json({ message: "Password reset failed", error: err.message });
    }
};

module.exports = { Login, Logout, ResetPassword };