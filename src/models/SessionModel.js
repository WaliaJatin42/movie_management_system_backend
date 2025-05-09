// models/SessionModel.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'session' });

module.exports = mongoose.model('Session', sessionSchema);
