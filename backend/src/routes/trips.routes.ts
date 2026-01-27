import { Router } from "express";
import { createTrip } from "../controllers/create.controller.js";
import { fetchCustomTrips } from "../controllers/fetchCustom.controller.js";
import { editTrip } from "../controllers/edit.controller.js";
import { deleteTripByID } from "../controllers/delete.controller.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";



const router = Router();

router.post("/add", createTrip);

router.post("/fetchCustom", fetchCustomTrips);

router.put("/edit/:_id", editTrip);

router.delete("/delete/:_id", deleteTripByID);

router.get("/dashboard", getDashboardStats);

router.get("/hello", (req,res) => {
  res.send("hello");
});

export default router;
