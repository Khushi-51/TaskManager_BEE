import { Metadata } from 'next';
import TaskManagerApp from '@/components/TaskManagerApp';

export const metadata: Metadata = {
  title: 'Task Manager - Full-Stack App',
  description: 'Feature-rich task manager with real-time updates',
};

export default function Page() {
  return <TaskManagerApp />;
}
