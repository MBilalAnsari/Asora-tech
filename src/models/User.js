import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser; // password only required for normal users
    }
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, 
    required: false
  },
  email: {
    type: String,
    required: true, unique: true
  },
  emiratesId: {
    type: Number,
    unique: true
  },
  brokerNumber: {
    type: Number,
    unique: true
  },
  googleId: {
    type: String,
    default: null
  },
  picture: {
    type: String,
    default: null
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
export default User;
