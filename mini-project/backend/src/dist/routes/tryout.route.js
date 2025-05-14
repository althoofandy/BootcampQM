import express from "express";
import tryoutController from "../controllers/tryout.controller.js";
const router = express.Router();
// Consolidated RESTful routes with proper prefixes
router.get("/", tryoutController.getAll);
router.get("/search", tryoutController.getBySearch);
router.post("/create", tryoutController.create);
router.put("/update/:id", tryoutController.update);
router.delete("/delete/:id", tryoutController.delete);
export default router;
