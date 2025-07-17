import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' },
  badge: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
  },
  contact: {
    type: Number,
  },

}, {timestamps: true});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
