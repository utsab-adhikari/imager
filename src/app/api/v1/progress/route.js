import connectDB from "@/db/ConnectDB";
import Progress from "@/models/progressModel";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET: fetch all or one progress by id
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (id) {
      const progress = await Progress.findOne({ _id: id, creator: user._id });
      if (!progress) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(progress);
    }

    const progresses = await Progress.find({ creator: user._id }).sort({
      dayNumber: 1,
    });
    return NextResponse.json(progresses);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: create new progress
export async function POST(request) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    const body = await request.json();

    const progress = await Progress.create({
      dayNumber: body.dayNumber,
      title: body.title,
      description: body.description || "",
      content: [],
      creator: user._id,
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create progress" },
      { status: 500 }
    );
  }
}

// PUT: update existing progress
export async function PUT(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    const existing = await Progress.findOne({ _id: id, creator: user._id });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = await request.json();

    const updated = await Progress.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: delete a progress
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    const progress = await Progress.findOne({ _id: id, creator: user._id });

    if (!progress) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await Progress.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
