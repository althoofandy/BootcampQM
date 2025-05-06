import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load swagger.json secara aman
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "swagger.json"), "utf-8"));
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
// API routes
app.use("/", routes);
// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Optional: serve swagger.json as raw JSON (useful for Swagger UI remote load)
app.get("/swagger.json", (req, res) => {
    res.json(swaggerDocument);
});
app.listen(3000, () => {
    console.log("✅ Server is running on http://localhost:3000");
    console.log("📚 Swagger docs available at http://localhost:3000/api-docs");
});
