import { NextResponse } from "next/server";
import { ConnectDb } from "@/dbConfig/dbConfig";
import Agreement from "@/models/AgreementModel";
import cloudinary from "@/helpers/cloudinary";
import { getCurrentUser } from "@/helpers/getCurrentUser";

ConnectDb();

export async function POST(req) {
  try {

   const user = await getCurrentUser(req);



    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    const uploadImage = async (img) => {
      if (!img) return "";
      const res = await cloudinary.uploader.upload(img, {
        folder: "agreements",
      });
      return res.secure_url;
    };

    const firstImage = await uploadImage(
      data.firstParty.image
    );
    const secondImage = await uploadImage(
      data.secondParty.image
    );

    const agreement = await Agreement.create({
      firstParty: {
        name: data.firstParty.name,
        cnic: data.firstParty.cnic,
        image: firstImage,
      },
      secondParty: {
        name: data.secondParty.name,
        cnic: data.secondParty.cnic,
        image: secondImage,
      },
      createdBy: user.id,
    });

    return NextResponse.json({
      success: true,
      id: agreement._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
