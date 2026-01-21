import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    fare: { type: Number, required: true },
    tripDate: { type: Number, required: true },
    returnTrip: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", TripSchema);
