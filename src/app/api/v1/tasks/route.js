import connectDB from "@/db/ConnectDB";
import Task from "@/models/taskModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import User from "@/models/userModel";

export async function GET(request) {
  await connectDB();

  const { id, parent } = Object.fromEntries(request.nextUrl.searchParams);

  try {
    if (id) {
      const task = await Task.findById(id);
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      return NextResponse.json(task);
    }

    const filter = parent ? { parent } : { parent: null };
    const tasks = await Task.find(filter);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();

  try {
    console.log("Hery");
    const session = await getServerSession(authOptions);
    const creatorEmail = session.user.email;
    const useR = await User.findOne({ email: creatorEmail });
    if (!session || !session.user || !useR._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const task = await Task.create({ ...body, creator: useR._id });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PUT: Update a task by id
export async function PUT(request) {
  await connectDB();

  const { id } = Object.fromEntries(request.nextUrl.searchParams);

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const updated = await Task.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a task and its subtasks
export async function DELETE(request) {
  await connectDB();

  const { id } = Object.fromEntries(request.nextUrl.searchParams);

  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  try {
    await Task.findByIdAndDelete(id);
    await Task.deleteMany({ parent: id }); // Recursively delete subtasks
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
