const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
}, {
  id: false,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
