import { NextResponse } from 'next/server';
import Project from '@/models/projectModel';
import connectDB from '@/db/ConnectDB';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
