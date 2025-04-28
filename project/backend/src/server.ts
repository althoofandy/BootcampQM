import express from "express";
import cors from "cors";
import usersRoute from "./routes/users.routes";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/users", usersRoute);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

app.listen(3000, () => {
  console.log("Server berjalan pada port 3000");
});
