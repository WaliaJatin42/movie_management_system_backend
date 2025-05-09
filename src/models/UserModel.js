const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
  },
  username: {
    type: String,
    maxlength: 512,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    required: true
  },
  first_name: {
    type: String,
    maxlength: 255,
  },
  last_name: {
    type: String,
    maxlength: 255,
  },
  email: {
    type: String,
    maxlength: 512,
  },
  password: {
    type: String,
    maxlength: 512,
  },
  phone_number: {
    type: String,
    maxlength: 255,
  },
  status: {
    type: Number,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_by: {
    type: String,
  },
  ip_address: {
    type: String,
    maxlength: 255,
  }
});

userSchema.plugin(AutoIncrement, { inc_field: 'user_id', start_seq: 1 });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;


