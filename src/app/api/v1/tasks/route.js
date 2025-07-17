import connectDB from "@/db/ConnectDB";
import Task from "@/models/taskModel";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET: Fetch tasks by ID or parent, filtered by creator
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const parent = searchParams.get("parent");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id) {
      const task = await Task.findOne({ _id: id, creator: user._id });
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      return NextResponse.json(task);
    }

    const filter = {
      creator: user._id,
      parent: parent ? parent : null,
    };

    const tasks = await Task.find(filter);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST: Create a new task with title, optional description & dueDate
export async function POST(request) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const task = await Task.create({
      title: body.title,
      description: body.description || "",       // optional
      parent: body.parent || null,               // optional
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      creator: user._id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PUT: Update task (only if owned by user)
export async function PUT(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Enforce creator-based permission
    const existing = await Task.findOne({ _id: id, creator: user._id });
    if (!existing) {
      return NextResponse.json({ error: "Not authorized to update this task" }, { status: 403 });
    }

    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }

    const updated = await Task.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE: Delete task and subtasks (only if owned by user)
export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await Task.findOne({ _id: id, creator: user._id });
    if (!task) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);
    await Task.deleteMany({ parent: id }); // delete subtasks
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
