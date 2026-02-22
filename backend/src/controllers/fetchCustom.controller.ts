import type { Request, Response } from "express";
import type { TripFilter } from "../types/trips.types";
import Trip from "../models/trips.models.js";
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware";

export const fetchCustomTrips = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
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
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        query.tripDate.$gte = fromDate.getTime();
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.tripDate.$lte = toDate.getTime();
      }
    }

    if (!dateFrom && !dateTo && recent) {
      let from: number | undefined;

      const now = new Date();

      if (recent === "today") {
        now.setHours(0, 0, 0, 0);
        from = now.getTime();
      } else if (recent === "last_7_days") {
        now.setDate(now.getDate() - 7);
        now.setHours(0, 0, 0, 0);
        from = now.getTime();
      } else if (recent === "month") {
        now.setDate(now.getDate() - 30);
        now.setHours(0, 0, 0, 0);
        from = now.getTime();
      }

      if (from !== undefined) {
        query.tripDate = { $gte: from };
      }
    }

    // console.log(query);

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
