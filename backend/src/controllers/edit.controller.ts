import type { Response } from "express";
import Trip from "../models/trips.models.js"
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";

export const editTrip = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB()
    const { _id: tripId } = req.params;
    
    const updatedTrip = await Trip.findOneAndUpdate(
      {_id: tripId, user: req.user!.id},
      {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        fare: req.body.fare,
        tripDate: req.body.tripDate,
        numberPlate: req.body.numberPlate,
        returnTrip: req.body.returnTrip,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    
    if (!updatedTrip) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: updatedTrip,
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch trip",
    });
  }
};
