import { Router } from "express";
import {
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserDetail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
