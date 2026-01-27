import express from "express";
import cors from "cors";
import tripRouter from "../src/routes/trips.routes.js";  
import dotenv from 'dotenv'

dotenv.config();
if (!process.env.MONGO_URI) {
  
  throw new Error("DATABASE_URL environment variable is not set");
}

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://trippyyer.vercel.app",
      "http://192.168.0.105:5173",
      "http://localhost:3000",
      "https://trippy-serverless.vercel.app",
    ],
  }),
);

app.use(express.json());


app.get("/api/test", (_req, res) => {
  res.json({ message: "Backend is working!" });
});

app.use("/trip", tripRouter);



export default app;
