import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/users.models";
import { generateToken } from "../utils/generateToken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    if (
      payload.iss !== "accounts.google.com" &&
      payload.iss !== "https://accounts.google.com"
    ) {
      throw new Error("Invalid issuer");
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    const token = generateToken(user._id.toString());

    console.log("Verified user:", payload?.email);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });

    // res.json({ message: "User verified", email: payload.email });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
