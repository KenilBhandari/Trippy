import { Router } from "express";
import { createTrip } from "../controllers/create.controller";
import { fetchCustomTrips } from "../controllers/fetchCustom.controller";
import { editTrip } from "../controllers/edit.controller";
import { deleteTripByID } from "../controllers/delete.controller";
import { getDashboardStats } from "../controllers/dashboard.controller";



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
