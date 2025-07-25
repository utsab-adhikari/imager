import connectDB from "@/db/ConnectDB";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Album from "@/models/albumModel";
import Image from "@/models/imageModel";

export async function POST(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  try {
    const { imageUrls, albumName } = await request.json();
    const decodedAlbumName = decodeURIComponent(albumName);

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0 || !albumName) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Both image URLs and album name are required.",
      });
    }


    const album = await Album.findOne({ albumName: decodedAlbumName });
    if (!album) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Album not found",
      });
    }

    // ✅ Create new image entry
    const newImages = new Image({
      uploaderId: session.user.id,
      albumId: album._id,
      uploader: session.user.name,
      image: imageUrls,
    });

    await newImages.save();

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Images uploaded successfully",
      newImages,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
