import dotenv from 'dotenv'
dotenv.config();

import cors from 'cors'

import express from "express";
import projectsRouter from "./src/routes/projects.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://api-integration-1.vercel.app",
    ],
    // credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);

app.use("/api/v1/projects", projectsRouter);

app.get("/", async (req, res) => {
  res.status(200).send('it works')
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
