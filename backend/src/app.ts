import express from "express";
import cors from "cors";
import tripRouter from "./routes/trips.routes";  
import dotenv from 'dotenv'

dotenv.config();
if (!process.env.MONGO_URI) {
  
  throw new Error("DATABASE_URL environment variable is not set");
}

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/test", (_req, res) => {
  res.json({ message: "Backend is working!" });
});

app.use("/trip", tripRouter);



export default app;
