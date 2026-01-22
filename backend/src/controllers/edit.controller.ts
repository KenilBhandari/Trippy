import type { Request, Response } from "express";
import Trip from "../models/trips.models"

export const editTrip = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(
      _id,
      {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        fare: req.body.fare,
        tripDate: req.body.tripDate,
        returnTrip: req.body.returnTrip,
        updatedAt: Date.now(),
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
