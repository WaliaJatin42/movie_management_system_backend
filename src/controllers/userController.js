const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require("../models/UserModel");
const validateRequest = require('../services/validateRequest');

const userSchema = z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    role: z.string().min(3).max(32),
    first_name: z.string().min(3).max(32),
    last_name: z.string().min(3).max(32),
    phone_number: z.string().min(3).max(32)
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

        res.json({ user }); // removed ...tokens
    } catch (err) {
        console.error('createUser error:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = { createUser };
