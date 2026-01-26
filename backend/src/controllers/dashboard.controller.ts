import type { Request, Response } from "express";
import Trip from "../models/trips.models";
import { getWeekTimestamp } from "../utils/dashboard.utils";

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

    const { startTimeStamp, endTimeStamp } = getWeekTimestamp();

    const startOfYear =
      new Date(Date.UTC(now.getFullYear(), 0, 1, 0, 0, 0)).getTime() +
      5.5 * 60 * 60 * 1000; // add 5h30m for IST

    // Get end of year in IST
    const endOfYear =
      new Date(Date.UTC(now.getFullYear(), 11, 31, 23, 59, 59, 999)).getTime() +
      5.5 * 60 * 60 * 1000;


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

    const last7Days = await Trip.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$tripDate" },
              timezone: "Asia/Kolkata",
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

    const thisWeek = await Trip.aggregate([
      {
        $match: {
          tripDate: {
            $gte: startTimeStamp,
            $lte: endTimeStamp,
          },
        },
      },
      {
        $group: {
          _id: null,
          thisWeekRevenue: { $sum: "$fare" },
        },
      },
    ]);

const monthlyRaw = await Trip.aggregate([
  {
    $match: {
      $expr: {
        $and: [
          { $gte: [
              { $toDate: "$tripDate" },
              new Date(`${now.getFullYear()}-01-01T00:00:00+05:30`)
          ] },
          { $lte: [
              { $toDate: "$tripDate" },
              new Date(`${now.getFullYear()}-12-31T23:59:59+05:30`)
          ] },
        ],
      },
    },
  },
  {
    $group: {
      _id: {
        $month: {
          date: { $toDate: "$tripDate" },
          timezone: "Asia/Kolkata",
        },
      },
      totalRevenue: { $sum: "$fare" },
    },
  },
  { $sort: { _id: 1 } },
]);


    const monthStats = monthStatsAgg[0] || {
      totalRevenue: 0,
      totalTrips: 0,
      avgFare: 0,
    };

    const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = monthlyRaw.find((m) => m._id === month);

      return {
        _id: month,
        totalRevenue: found?.totalRevenue || 0,
        totalTrips: found?.totalTrips || 0,
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        monthStats: {
          totalRevenue: Math.round(monthStats.totalRevenue),
          totalTrips: monthStats.totalTrips,
          avgFare: Math.round(monthStats.avgFare),
        },
        monthlyTotals,
        last7Days,
        thisWeek,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
