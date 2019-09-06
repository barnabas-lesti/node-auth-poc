const mongoose = require('mongoose');

const UserDto = require('./user.dto');

const UserSchema = new mongoose.Schema({
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
  profileImageId: {
    type: String,
  },
}, {
  id: false,
  toJSON: { versionKey: false },
  toObject: { versionKey: false },
});

const Model = mongoose.model('User', UserSchema);

class UserDao {
  static async findOne (...args) {
    const doc = await Model.findOne(...args);
    return doc ? new UserDto(doc) : null;
  }

  static async create (...args) {
    const doc = await Model.create(...args);
    return doc ? new UserDto(doc) : null;
  }
}

module.exports = UserDao;
