const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  profile: {
    name: { type: String, default: '' },
    major: { type: String, default: '' },
    about: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
