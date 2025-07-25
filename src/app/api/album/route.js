import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Album from "@/models/albumModel";
import connectDB from "@/db/ConnectDB";

export async function POST(request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  try {
    const { albumName, albumImg, description } = await request.json();

    const existingAlbum = await Album.findOne({ albumName: albumName });
    const data = await res.json();
    if (existingAlbum) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Album already exists",
      });
    }

    const newAlbum = new Album({
      albumName,
      albumImg,
      creatorId: session.user.id,
      creator: session.user.name,
      description,
    });

    await newAlbum.save();

    return NextResponse.json({
      status: 201,
      success: false,
      message: "Album Created Successfully",
      newAlbum,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  try {
    const albums = await Album.find({}).sort({ createdAt: -1 });

    if (!albums || albums.length === 0) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "No albums found",
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Albums loaded successfully",
      albums,
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
