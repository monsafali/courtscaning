import { ConnectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

import cloudinary from "@/helpers/cloudinary";

ConnectDb();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, image } = await request.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    // ☁️ Upload image to Cloudinary (if exists)
    let imageUrl = "";
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "users",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
      verifyTokenExpiry: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();


    return NextResponse.json({
      message: "Signup successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
