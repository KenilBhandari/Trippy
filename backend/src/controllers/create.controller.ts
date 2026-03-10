import type { TripInput } from "../types/trips.types";
import Trip from "../models/trips.models.js";
import type { Response } from "express";
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";


   
export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const { trip } = req.body;

    const newTrip = await Trip.create({
      ...trip,
      user: req.user!.id,
    });
    
    return res.status(201).json({
      status: "success",
      data: newTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create trip",
      error: error,
    });
  }
};
