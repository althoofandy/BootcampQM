import express from "express";
import categoryController from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", categoryController.getAll);

export default router;
