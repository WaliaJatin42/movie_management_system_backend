const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require("../models/UserModel");
const validateRequest = require('../services/validateRequest');
const { getPaginationParams } = require('../utils/pagination');

const userSchema = z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    role: z.string().min(3).max(32),
    first_name: z.string().min(3).max(32),
    last_name: z.string().min(3).max(32),
    phone_number: z.string().min(3).max(32)
});

const getUserSchema = z.object({
    user_id: z.string().min(1).refine(val => !isNaN(Number(val)), {
        message: "user_id must be a number"
    })
});

const createUser = async (req, res) => {
    const validated = validateRequest(userSchema, req.body, res, 'createUser');
    if (!validated) return;

    const { username, email, password, role, first_name, last_name, phone_number } = validated;

    try {
        const userEmailExists = await User.findOne({ email });
        const userUserNameExists = await User.findOne({ username });

        if (userUserNameExists || userEmailExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            first_name,
            last_name,
            phone_number
        });

        res.json({ message: "User created successfully", data: user });
    } catch (err) {
        console.error('createUser error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getUserById = async (req, res) => {
    const validated = validateRequest(getUserSchema, req.params, res, 'getUserById');
    if (!validated) return;
    const { user_id } = validated;
    try {
        const user = await User.findOne({ user_id: Number(user_id) }).select('-password'); // Use custom field // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: user });
    } catch (err) {
        console.error('getUserById error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit);
        const total = await User.countDocuments();
        res.json({
            total_records: total,
            data: users
        });
    } catch (err) {
        console.error('getAllUsers error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateUserById = async (req, res) => {
    const validatedParams = validateRequest(getUserSchema, req.params, res, 'updateUser');
    if (!validatedParams) return;

    const { user_id } = validatedParams;
    const updatedData = { ...req.body };

    try {
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        const user = await User.findOneAndUpdate(
            { user_id: Number(user_id) },
            updatedData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", data: user });
    } catch (err) {
        console.error('updateUserById error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


// 🗑️ Delete user
const deleteUserById = async (req, res) => {
    const validated = validateRequest(getUserSchema, req.params, res, 'deleteUser');
    if (!validated) return;

    const { user_id } = validated;

    try {
        const result = await User.findOneAndDelete({ user_id: Number(user_id) });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error('deleteUserById error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = {
    createUser,
    getUserById,
    getAllUsers, updateUserById,
    deleteUserById
};
