import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  questionDone: {
    type: Array,
    default: [], //Just store question id.
  },
  history:{
    type: Array,
    default: [], // Store history details: Time of Attempt, Questions attempted, other user, attempt details
  },
  onlineDate: {
    type: Array,
    default: [],
  },
  isMatched: {
    type: Boolean,
    default: false,
  },
  matchData: {
    type: Object,
    default: {},
  },
  resetToken: {
    type: String,
    default: null, 
  },
  resetTokenExpiration: {
    type: Date,
    default: null, 
  },
});

export default mongoose.model("UserModel", UserModelSchema);
