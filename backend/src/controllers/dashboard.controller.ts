import type { Response } from "express";
import mongoose from "mongoose";
import Trip from "../models/trips.models.js";
import { getWeekTimestamp } from "../utils/dashboard.utils.js";
import connectDB from "../db/config.js";
import type { AuthRequest } from "../auth.middleware.js";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();
    // console.log("ENV CHECK:", !!process.env.MONGO_URI, process.env.MONGO_URI);
    const now = new Date();

    const startOfMonth = new Date(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00+05:30`,
    ).getTime();
    const endOfMonth = new Date(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}T23:59:59+05:30`,
    ).getTime();

    const { startTimeStamp, endTimeStamp } = getWeekTimestamp();

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const userId = req.user!.id;

    const monthStatsAgg = await Trip.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          tripDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
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
        $match: {
          user: new mongoose.Types.ObjectId(req.user!.id),
          tripDate: {
            $gte: sevenDaysAgo.getTime(),
            $lte: today.getTime(),
          },
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
          totalRevenue: { $sum: "$fare" },
          totalTrips: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const thisWeek = await Trip.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user!.id),
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
          user: new mongoose.Types.ObjectId(req.user!.id),
          $expr: {
            $and: [
              {
                $gte: [
                  { $toDate: "$tripDate" },
                  new Date(`${now.getFullYear()}-01-01T00:00:00+05:30`),
                ],
              },
              {
                $lte: [
                  { $toDate: "$tripDate" },
                  new Date(`${now.getFullYear()}-12-31T23:59:59+05:30`),
                ],
              },
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
