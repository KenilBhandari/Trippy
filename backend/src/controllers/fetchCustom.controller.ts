import type { Request, Response } from "express";
import type { TripFilter } from "../types/trips.types.js";
import Trip from "../models/trips.models.js";
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";
import { getTimeStamps } from "../utils/fetchQuery.utils.js";

export const fetchCustomTrips = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    const filter: TripFilter = req.body;

    const { limit, sort, dateFrom, dateTo, searchString, recent } = filter;
    const { todayTS, last7DaysTS, startOfMonthTS } = getTimeStamps();

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

    query.user = req.user!.id;

    if (searchString) {
      query.$or = [
        { startPoint: { $regex: searchString, $options: "i" } },
        { endPoint: { $regex: searchString, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      query.tripDate = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        query.tripDate.$gte = from.getTime();
      }

      if (dateTo) {
        const to = new Date(dateTo);
        query.tripDate.$lte = to.getTime();
      }
    }

    if (!dateFrom && !dateTo && recent) {
      if (recent === "today") {
        query.tripDate = { $gte: todayTS };
      } else if (recent === "last_7_days") {
        query.tripDate = { $gte: last7DaysTS };
      } else if (recent === "month") {
        query.tripDate = { $gte: startOfMonthTS };
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
