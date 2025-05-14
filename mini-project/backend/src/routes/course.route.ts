import express from "express";
import courseController from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", courseController.getAll);
router.get("/search", courseController.getBySearch);
router.post("/create", courseController.create);
router.put("/update/:id", courseController.update);
router.delete("/delete/:id", courseController.delete);

export default router;
