import { NextResponse } from "next/server";
import connectDB from "@/db/ConnectDB";
import Project from "@/models/projectModel";

export async function PUT(req, { params }) {
  await connectDB();
  const { id, topicId } = await params;
  const { content } = await req.json();

  try {
    const project = await Project.findById(id);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const topic = project.topics.id(topicId);
    if (!topic)
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    topic.content = content;
    await project.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id, topicId } = await params;

  try {
    const project = await Project.findById(id);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    project.topics = project.topics.filter((t) => t._id.toString() !== topicId);
    await project.save();

    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
