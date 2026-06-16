import bcrypt from "bcryptjs";
import User from "@/models/userModel"; // MUST exist

export async function createDefaultAdmin() {
  try {
    const email = process.env.ADMIN;

    if (!email) {
      console.log("ADMIN env not found");
      return;
    }

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash( process.env.ADMIN_PASSWORD, 10);

    await User.create({
      username: "Admin",
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("Default admin created");
  } catch (error) {
    console.error("Admin creation error:", error);
  }
}
