import UserModel from "./user-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  const user = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_ENDPOINT;
  const dbName = process.env.MONGODB_DB;

  const DATABASE_URI = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority&appName=PeerPrep`

  await connect(DATABASE_URI);
}

export async function createUser(username, email, password) {
  return new UserModel({ username, email, password }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { email },
    ],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function findAllActiveUsers() {
  return UserModel.find({ isActive: true });
}

export async function updateUserById(userId, username, email, password) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateOnlineTimeById(userId, onlineDate) {
  const foundUser = await UserModel.findOne({ _id: userId }).exec();
  foundUser.onlineDate = onlineDate;
  const result = await foundUser.save();
  return foundUser;
}

export async function updateQuestionDoneById(userId, questionDone) {
  const foundUser = await UserModel.findOne({ _id: userId }).exec();
  foundUser.questionDone = questionDone;
  const result = await foundUser.save();
  return foundUser;
}

export async function softDeleteUserById(userId, isActive = false) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isActive,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}
