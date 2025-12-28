import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const templates = await Task.find({ userId, isTemplate: true });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { taskId, templateName } = await req.json();

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const template = new Task({
      ...task.toObject(),
      _id: undefined,
      isTemplate: true,
      templateName,
      status: 'todo',
    });

    await template.save();
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
