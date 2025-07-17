// app/api/projects/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/db/ConnectDB';
import Project from '@/models/projectModel';

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { name, description, links } = body;

  if (!name) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
  }

  try {
    const project = await Project.create({
      name,
      description: description || '',
      creator: userId,
      collaborators: [userId],
      links: {
        website: links?.website || '',
        github: links?.github || '',
        discord: links?.discord || ''
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
