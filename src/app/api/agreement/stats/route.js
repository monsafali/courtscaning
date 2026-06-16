import { NextResponse } from "next/server";
import { ConnectDb } from "@/dbConfig/dbConfig";
import Agreement from "@/models/AgreementModel";

ConnectDb();

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayCount = await Agreement.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    return NextResponse.json({ todayCount });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
