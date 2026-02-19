import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
