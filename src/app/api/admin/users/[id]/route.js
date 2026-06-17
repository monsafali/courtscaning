import { NextResponse } from "next/server";
import { ConnectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getCurrentUser } from "@/helpers/getCurrentUser";

ConnectDb();

export async function DELETE(req, { params }) {
  try {
    const admin = await getCurrentUser(req);

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }


      const { id } = await params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Optional safety: prevent deleting another admin
    if (user.isAdmin) {
      return NextResponse.json(
        { error: "Cannot delete admin user" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
