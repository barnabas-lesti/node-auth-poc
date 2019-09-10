const mongoose = require('mongoose');

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
    required: true,
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

class User {
  constructor ({ _id, userId, email, fullName, profileImageId }) {
    this.userId = _id || userId;
    this.email = email;
    this.fullName = fullName;
    this.profileImageId = profileImageId;
  }

  static async findOne (...args) {
    const doc = await Model.findOne(...args);
    return doc ? new User(doc) : null;
  }

  static async create (...args) {
    const doc = await Model.create(...args);
    return doc ? new User(doc) : null;
  }
}

module.exports = User;
