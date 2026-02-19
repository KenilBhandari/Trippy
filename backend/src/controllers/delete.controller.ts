import type { Response } from "express";
import Trip from "../models/trips.models.js"
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";

export const deleteTripByID = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB()
    const { _id : tripId } = req.params;
    const deleted = await Trip.findOneAndDelete({
  _id: tripId,
  user: req.user!.id,
});

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
