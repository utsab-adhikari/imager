import connectDB from "@/db/ConnectDB";

import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { email } = await params;

    if (!email) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Email is Required",
      });
    }

    const profile = await User.findOne({ email: email });
    const blogs = await Blog.find({ authorId: profile._id });

    if (!profile) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Profile Not Found",
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Profile Loaded Successfully",
      profile,
      blogs,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: ["Internal Server Error", error.message],
    });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { email } = await params;

    const { bio, contact, image, name } = await request.json();

    if (!email) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Email is Required",
      });
    }

    const profile = await User.findOne({ email: email });

    if (!profile) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Profile Not Found",
      });
    }

    await User.findByIdAndUpdate(profile._id, {
      bio: bio,
      contact: contact,
      image: image,
      name: name,
    });

    await Blog.updateMany(
      { authorId: profile._id },
      { $set: { author: name } }
    );

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: ["Internal Server Error", error.message],
    });
  }
}
