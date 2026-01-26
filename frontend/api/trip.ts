/// <reference types="node" />

import connectDB from "../lib/db.js";

export default async function handler(req: any, res: any) {
  await connectDB();

  if (req.method === "GET") {
    return res.status(200).json({ message: "Trip GET working" });
  }

  if (req.method === "POST") {
    return res.status(201).json({ message: "Trip POST working" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
