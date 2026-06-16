import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import cloudinary from "@/helpers/cloudinary";
import User from "@/models/userModel";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { ConnectDb } from "@/dbConfig/dbConfig";

ConnectDb();

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser(req); // 🔥 PASS REQUEST

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { username, email, password, image } =
      await req.json();

    const exists = await User.findOne({ email });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (image) {
      const upload =
        await cloudinary.uploader.upload(image, {
          folder: "users",
        });

      imageUrl = upload.secure_url;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
      isAdmin: false,
    });

    return NextResponse.json({
      success: true,
      userId: user._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
