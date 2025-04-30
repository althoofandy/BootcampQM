import express from "express";
import userController from "../controllers/user.controller.js";
const router = express.Router();
router.get("/cart/:userId", userController.getCartByUser);
router.post("/cart/:userId", userController.addToCart);
router.delete("/cart/:cartId", userController.deleteCart);
export default router;
