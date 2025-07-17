import connectDB from "@/db/ConnectDB";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    await connectDB();

    const users = await User.find({});

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Users Loaded successgully",
      users,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
