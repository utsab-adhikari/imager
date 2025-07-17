import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/db/ConnectDB';
import Project from '@/models/projectModel';

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await Project.find({ creator: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
