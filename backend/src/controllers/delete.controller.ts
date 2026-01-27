import type { Request, Response } from "express";
import Trip from "../models/trips.models.js"
import connectDB from "../db/config.js";

export const deleteTripByID = async (req: Request, res: Response) => {
  try {
    await connectDB()
    const { _id } = req.params;
    const deleted = await Trip.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      status: "success",
      isDeleted: true,
    });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete trip",
    });
  }
};
