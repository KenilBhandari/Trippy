import { Router } from "express";
import { createTrip } from "../controllers/create.controller.js";
import { fetchCustomTrips } from "../controllers/fetchCustom.controller.js";
import { editTrip } from "../controllers/edit.controller.js";
import { deleteTripByID } from "../controllers/delete.controller.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import {authMiddleware} from "../auth.middleware.js"



const router = Router();

router.post("/add", authMiddleware, createTrip);

router.post("/fetchCustom",authMiddleware, fetchCustomTrips);

router.put("/edit/:_id", authMiddleware, editTrip);

router.delete("/delete/:_id", authMiddleware, deleteTripByID);

router.get("/dashboard", authMiddleware, getDashboardStats);

router.get("/hello", (req,res) => {
  res.send("hello");
});

export default router;
