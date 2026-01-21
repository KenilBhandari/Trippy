import type { Request, Response } from "express";
import type {
  TripFilter,
  TripInput,
  Trip as TripType,
} from "../types/trips.types";
import Trip from "../models/trips.models";

export const createTrip = async (req: Request, res: Response) => {
  try {
    const input: TripInput = req.body;

    const trip = {
      ...input,
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

    if (searchString || dateFrom || dateTo) {
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

export const deleteTripByID = async (req: Request, res: Response) => {
  try {
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



export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).getTime();

    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59).getTime();

    const monthStats = await Trip.aggregate([
      { $match: { tripDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fare" },
          totalTrips: { $sum: 1 },
          avgFare: { $avg: "$fare" },
        },
      },
    ]);

    const last7Days = await Trip.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$tripDate" },
              timezone: "Asia/Kolkata", // ✅ CRITICAL
            },
          },
          totalRevenue: { $sum: "$fare" },
          totalTrips: { $sum: 1 },
          lastTripDate: { $max: "$tripDate" },
        },
      },
      { $sort: { lastTripDate: -1 } },
      { $limit: 7 },
      { $sort: { _id: 1 } },
    ]);

    const monthlyTotals = await Trip.aggregate([
      { $match: { tripDate: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { $month: { $toDate: "$tripDate" } },
          totalRevenue: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.send({ monthlyTotals, last7Days, monthStats });
    
    return monthlyTotals;
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
