import type { Request, Response } from "express";
import type { TripFilter } from "../types/trips.types";
import Trip from "../models/trips.models"

export const fetchCustomTrips = async (req: Request, res: Response) => {
  try {
    const filter: TripFilter = req.body;
    
    const { limit, sort, dateFrom, dateTo, searchString, recent } = filter;

    let limitDefault = Number(limit) || 100;

    if (limit === -1) {
      limitDefault = 500;
    }
    let sortBy: Record<string, 1 | -1> =
      sort === "updated" ? { updatedAt: -1 } : { createdAt: -1 };
      
    if (sort === "updated") {
      sortBy = { updatedAt: -1 };
    } else if (sort === "tripdate") {
      sortBy = { tripDate: 1 };
    }

    if (searchString || dateFrom || dateTo || recent) {
      sortBy = { tripDate: 1 };
    } else if (sort === "updated") {
      sortBy = { updatedAt: -1 };
    } else if (sort === "tripdate") {
      sortBy = { tripDate: -1 };
    }

    const query: any = {};

    if (searchString) {
      query.$or = [
        { startPoint: { $regex: searchString, $options: "i" } },
        { endPoint: { $regex: searchString, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      query.tripDate = {};
      if (dateFrom) {
        query.tripDate.$gte = new Date(dateFrom).setHours(0, 0, 0, 0);
      }

      if (dateTo) {
        query.tripDate.$lte = new Date(dateTo).setHours(23, 59, 59, 999);
      }
    }

    if (!dateFrom && !dateTo && recent) {
      let from: number | undefined;

      if (recent === "today") {
        from = new Date().setHours(0, 0, 0, 0);
      } else if (recent === "last_7_days") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        from = d.getTime();
      } else if (recent === "month") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        from = d.getTime();
      }

      if (from !== undefined) {
        query.tripDate = { $gte: from };
      }
    }

    const tripList = await Trip.find(query).sort(sortBy).limit(limitDefault);

    return res.status(200).json({
      status: "success",
      data: tripList,
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch trip",
    });
  }
};