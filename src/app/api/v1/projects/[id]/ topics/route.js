import { NextResponse } from 'next/server';
import Project from '@/models/projectModel';
import connectDB from '@/db/ConnectDB';

export async function POST(req, { params }) {
  await connectDB();
  const { id } = await params;
  const { title } = await req.json();

  console.log(id, title);

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    project.topics.push({ title });
    await project.save();
    return NextResponse.json(project);
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to add topic' }, { status: 500 });
  }
}
