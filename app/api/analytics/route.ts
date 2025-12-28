import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const tasks = await Task.find({ userId, isTemplate: false });

    const analytics = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      mediumPriority: tasks.filter(t => t.priority === 'medium').length,
      lowPriority: tasks.filter(t => t.priority === 'low').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
      completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
      byCategory: {},
      byPriority: { high: 0, medium: 0, low: 0 },
      byStatus: { todo: 0, 'in-progress': 0, completed: 0 },
    };

    tasks.forEach(task => {
      if (task.category) {
        analytics.byCategory[task.category] = (analytics.byCategory[task.category] || 0) + 1;
      }
      analytics.byPriority[task.priority]++;
      analytics.byStatus[task.status]++;
    });

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
