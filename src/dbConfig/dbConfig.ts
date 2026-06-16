import mongoose from "mongoose";

import { createDefaultAdmin } from "../helpers/createAdmin";

export async function ConnectDb() {
  try {
    const dbconection = await mongoose.connect(
      process.env.MONGO_URL!
    );

    console.log(
      "MongoDB Connected:",
      dbconection.connection.host
    );

    await createDefaultAdmin(); // safe AFTER connection

  } catch (error) {
    console.error("MongoDB error:", error);
  }
}
