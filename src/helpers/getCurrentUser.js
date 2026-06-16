import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { ConnectDb } from "@/dbConfig/dbConfig";

export async function getCurrentUser(req) {
  try {
    await ConnectDb();

    // 🔥 GET COOKIE FROM REQUEST (NOT cookies())
    const token =
      req.cookies?.get?.("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    return user;
  } catch (error) {
    return null;
  }
}
