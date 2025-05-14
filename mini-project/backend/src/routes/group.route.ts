import express from "express";
import groupController from "../controllers/group.controller.js";

const router = express.Router();

router.get("/", groupController.getAll);
router.get("/search", groupController.getBySearch);
router.post("/create", groupController.create);
router.put("/update/:id", groupController.update);
router.delete("/delete/:id", groupController.delete);

export default router;
