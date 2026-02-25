import type { Response } from "express";
import mongoose from "mongoose";
import Trip from "../models/trips.models.js";
import { getTimeStamps } from "../utils/dashboard.utils.js";
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    const { startOfMonthTS, endOfMonthTS, startOfWeekTS, endOfWeekTS } =
      getTimeStamps();
      
    const userId = req.user!.id;

    const defaultSummary = {
      monthRevenue: 0,
      trips: 0,
      avgFare: 0,
    };

    const [summary = defaultSummary] = await Trip.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          tripDate: { $gte: startOfMonthTS, $lte: endOfMonthTS },
        },
      },
      {
        $group: {
          _id: null,
          trips: { $sum: 1 },
          avgFare: { $avg: "$fare" },
          monthRevenue: { $sum: "$fare" },
          weekRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$tripDate", startOfWeekTS] },
                    { $lte: ["$tripDate", endOfWeekTS] },
                  ],
                },
                "$fare",
                0,
              ],
            },
          },
        },
      },
    ]);

    const last7DaysSeries = await Trip.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$tripDate" },
              timezone: "Asia/Kolkata",
            },
          },
          dailyRevenue: { $sum: "$fare" },
          totalTrips: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } }, // latest active days first
      { $limit: 7 }, // pick 7 non-null(active) days
      { $sort: { _id: 1 } }, // re-sort for chart left->right
    ]);

    const monthlySeries = await Trip.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$tripDate" },
              timezone: "Asia/Kolkata",
            },
          },
          monthlyRevenue: { $sum: "$fare" },
          totalTrips: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } }, // latest active days first
      { $limit: 12 },
      { $sort: { _id: 1 } }, // re-sort for chart left->right
    ]);

    // console.log(monthlySeries);

    return res.status(200).json({
      status: "success",
      data: {
        summary: {
          trips: summary.trips,
          avgFare: Math.round(summary.avgFare),
          monthRevenue: Math.round(summary.monthRevenue),
          weekRevenue: Math.round(summary.weekRevenue),
        },
        series: {
          last7DaysSeries: last7DaysSeries,
          monthlySeries: monthlySeries,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
