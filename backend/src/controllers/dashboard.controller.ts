import type { Request, Response } from "express";
import Trip from "../models/trips.models";

export const getDashboardStats = async (req: Request, res: Response) => {
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

    const monthStatsAgg = await Trip.aggregate([
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

    const monthStats = monthStatsAgg[0] || {
      totalRevenue: 0,
      totalTrips: 0,
      avgFare: 0,
    };

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

    const monthlyRaw = await Trip.aggregate([
      { $match: { tripDate: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { $month: { $toDate: "$tripDate" } },
          totalRevenue: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const found = monthlyRaw.find(m => m._id === month);

  return {
    month,
    totalRevenue: found?.totalRevenue || 0,
    totalTrips: found?.totalTrips || 0
  };
});


    res.json({
      status: "success",
      data: {
        monthStats: {
          totalRevenue: Math.round(monthStats.totalRevenue),
          totalTrips: monthStats.totalTrips,
          avgFare: Math.round(monthStats.avgFare),
        },
        monthlyTotals,
        last7Days,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
