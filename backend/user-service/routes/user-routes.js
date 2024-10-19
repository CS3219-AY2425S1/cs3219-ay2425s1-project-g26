import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getAllActiveUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
  addQuestionToUser,
  getQuestionDetails,
  getPublicProfile,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

//Get public profile (all and id)
router.get("/public", getPublicProfile);

//Get active users only
router.get("/active", verifyAccessToken, verifyIsAdmin, getAllActiveUsers);

//Get all users
router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.post("/", createUser);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

//Soft delete
router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);


//Get all completed questions from a user
router.get("/questions/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getQuestionDetails);

//Save completed questions by id
router.patch("/questions/:id", verifyAccessToken, verifyIsOwnerOrAdmin, addQuestionToUser);




export default router;
