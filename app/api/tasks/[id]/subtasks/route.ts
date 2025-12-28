import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { title } = await req.json();
    const subtaskId = new mongoose.Types.ObjectId();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId },
      { 
        $push: { 
          subtasks: { _id: subtaskId, title, completed: false } 
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add subtask' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { subtaskId, completed } = await req.json();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId, 'subtasks._id': subtaskId },
      {
        $set: { 'subtasks.$.completed': completed },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!task) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { subtaskId } = await req.json();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId },
      { 
        $pull: { subtasks: { _id: subtaskId } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!task) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
  }
}
