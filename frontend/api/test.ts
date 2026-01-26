import connectDB from "../lib/db";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    res.status(200).json({ message: "DB connected successfully!" });
  } catch (error) {
    res.status(500).json({ error: "DB connection failed" });
  }
}
