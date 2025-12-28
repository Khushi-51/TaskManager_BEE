'use client';

import React, { useState } from 'react';
import './kanban.css';

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  category?: string;
  tags?: string[];
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

const STATUSES = ['todo', 'in-progress', 'completed'];

export default function KanbanBoard({ tasks, onUpdateTask }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask) {
      onUpdateTask(draggedTask, { status: status as any });
      setDraggedTask(null);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  return (
    <div className="kanban-board">
      {STATUSES.map(status => (
        <div key={status} className="kanban-column">
          <div className="column-header">
            <h3>{getStatusLabel(status)}</h3>
            <span className="column-count">{tasks.filter(t => t.status === status).length}</span>
          </div>
          <div 
            className="column-content"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            {tasks
              .filter(t => t.status === status)
              .map(task => (
                <div
                  key={task._id}
                  className={`kanban-card priority-${task.priority}`}
                  draggable
                  onDragStart={() => handleDragStart(task._id)}
                  title={task.description}
                >
                  <div className="card-content">
                    <div className="card-title-row">
                      <span className="priority-icon">{getPriorityIcon(task.priority)}</span>
                      <div className="card-title">• {task.title}</div>
                    </div>
                    {task.description && <div className="card-description">✓ {task.description}</div>}
                  </div>
                  <div className="card-meta">
                    {task.category && <span className="card-category">{task.category}</span>}
                    {task.dueDate && <span className="card-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
