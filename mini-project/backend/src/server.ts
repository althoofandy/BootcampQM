import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf-8")
);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.listen(5000, () => {
  console.log("✅ Server is running on http://localhost:5000");
  console.log("📚 Swagger docs available at http://localhost:5000/api-docs");
});
