

import { NextResponse } from "next/server";
import { ConnectDb } from "@/dbConfig/dbConfig";
import Agreement from "@/models/AgreementModel";
import { getCurrentUser } from "@/helpers/getCurrentUser";

ConnectDb();

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayCount = await Agreement.countDocuments({
      createdBy: user._id,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalCount = await Agreement.countDocuments({
      createdBy: user._id,
    });

    return NextResponse.json({
      todayCount,
      totalCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


