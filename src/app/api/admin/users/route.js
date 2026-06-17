
import { NextResponse } from "next/server";
import { ConnectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Agreement from "@/models/AgreementModel";
import { getCurrentUser } from "@/helpers/getCurrentUser";

ConnectDb();

export async function GET(req) {
  try {
    const admin = await getCurrentUser(req);

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await User.find({})
      .select("-password")
      .lean();

    // 📅 today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 🔥 attach stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const todayCount = await Agreement.countDocuments({
          createdBy: u._id,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        });

        const totalCount = await Agreement.countDocuments({
          createdBy: u._id,
        });

        return {
          ...u,
          todayCount,
          totalCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
