import type { TripInput } from "../types/trips.types";
import Trip from "../models/trips.models.js";
import type { Request, Response } from "express";
import connectDB from "../db/config.js";

export const createTrip = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const input: TripInput = req.body;

    const trip = {
      ...input,
      numberPlate: input.numberPlate ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newTrip = await Trip.create(trip);
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
