import connectDB from "@/db/ConnectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Image from "@/models/imageModel";
import { NextResponse } from "next/server";
import Album from "@/models/albumModel";

export async function GET(request, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  try {
    const { albumName } = await params;
    const album = await Album.findOne({ albumName: albumName });
    const images = await Image.find({ albumId: album._id });

    if (!images || images.length === 0) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "No images found",
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Images loaded successfully",
      images,
    });
  } catch (error) {
    console.error("Error loading albums:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}
