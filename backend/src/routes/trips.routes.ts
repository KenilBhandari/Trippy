import { Router } from "express";
import { createTrip, deleteTripByID, editTrip, fetchCustomTrips, getDashboardSummary } from "../controllers/trips.controllers";


const router = Router();

router.post("/add", createTrip);

router.post("/fetchCustom", fetchCustomTrips);

router.put("/edit/:_id", editTrip);

router.delete("/delete/:_id", deleteTripByID);

router.get("/summary", getDashboardSummary);

router.get("/hello", (req,res) => {
  res.send("hello");
});





export default router;
