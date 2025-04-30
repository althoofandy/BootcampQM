import express from "express";
import productRouter from "./product.route.js";
import categoryRouter from "./category.route.js";
import userRouter from "./user.route.js";
const router = express.Router();

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/user", userRouter);

export default router;
