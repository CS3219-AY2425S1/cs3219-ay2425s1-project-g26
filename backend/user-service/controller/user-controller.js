import axios from 'axios';
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findAllActiveUsers as _findAllActiveUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
  softDeleteUserById as _softDeleteUserById,
  updateOnlineTimeById as _updateOnlineTimeById,
  updateQuestionDoneById as _updateQuestionDoneById,
} from "../model/repository.js";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username && email && password) {
      const existingUser = await _findUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res.status(409).json({ message: "username or email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword);
      console.log(`Created new user ${username} successfully`);
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: formatUserResponse(createdUser),
      });
    } else {
      return res.status(400).json({ message: "username and/or email and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res.status(200).json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _findAllUsers();

    return res.status(200).json({ message: `Found all users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting all users!" });
  }
}

export async function getAllActiveUsers(req, res) {
  try {
    const users = await _findAllActiveUsers();

    return res.status(200).json({ message: `Found active users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting all active users!" });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username || email || password) {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      let hashedPassword;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }
      const updatedUser = await _updateUserById(userId, username, email, hashedPassword);
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "No field to update: username and email and password are all missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {  // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(userId, isAdmin === true);
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function updateOnlineTime(user) {
  const currentDate = new Date(Date.now());
  const parsedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  const onlineDate = user.onlineDate;
  const foundDate = onlineDate.filter(date => date == parsedDate);
  if (foundDate == 0) {
    onlineDate.push(parsedDate);
    await _updateOnlineTimeById(user.id, onlineDate);
    console.log("New login date updated");
  }
}

export async function addQuestionToUser(req, res) {

  const userId = req.params.id;
  const questionId = req.body.question_id;

  if (!isValidObjectId(userId)) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  if (!questionId) {
    return res.status(404).json({ message: `question_id not found in body` });
  }

  const user = await _findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const questionDone = user.questionDone;
  if (questionDone.filter(question => question == questionId) == 0) {

    questionDone.push(questionId);
    await _updateQuestionDoneById(user.id, questionDone);
    console.log(`Question ${questionId} added to User ${userId}.`);
    return res.status(200).json({ message: `Question ${questionId} added to User ${userId}.`, data: user});
  }
  return res.status(409).json({ message: `Question ${questionId} already exist!` });
}

export async function getQuestionDetails(req, res) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];
  const userId = req.params.id;
  if (!isValidObjectId(userId)) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const user = await _findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: `User ${userId} not found` });
  }

  const questionDone = user.questionDone;
  
    try {
      // Make a GET request to user-service with the token
      const dataToSend = { questions: questionDone };
      const response = await axios.post('http://question-service:8080/questions/selected', dataToSend, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });
  
      if (!response) {
          return res.status(error.status).json({ error: `${error.response}` });
      } 
      
      return res.status(200).json({ data: response.data });
  
  } catch (error) {
      console.log(`${error.status}: ${error.response.data.message}`);
      return res.status(error.status).json({ error: `${error.response}` });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    //await _deleteUserById(userId);
    await _softDeleteUserById(userId);
    return res.status(200).json({ message: `Soft deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when deleting user!" });
  }
}

export function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    onlineDate: user.onlineDate,
    questionDone: user.questionDone,
    createdAt: user.createdAt,
  };
}
