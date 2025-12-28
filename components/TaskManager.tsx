'use client';

import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import SearchFilter from './SearchFilter';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  category?: string;
  tags?: string[];
  subtasks?: Array<{ _id: string; title: string; completed: boolean }>;
  createdAt?: string; // Added missing createdAt field for sorting
  updatedAt?: string;
}

interface TaskManagerProps {
  authToken: string;
  userId: string;
}

export default function TaskManager({ authToken, userId }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'kanban' | 'calendar' | 'dashboard'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all', sortBy: 'dueDate' });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // Only fetch tasks after we have a valid auth token. If there's no token, skip fetching.
  useEffect(() => {
    if (authToken) {
      fetchTasks();
    } else {
      // No token - nothing to load
      setLoading(false);
      setTasks([]);
      setCategories([]);
    }
  }, [authToken]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, searchQuery]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        // Try to parse error body for better diagnostics
        const errBody = await response.json().catch(() => null);
        console.error('Failed to fetch tasks:', response.status, errBody);
        setTasks([]);
        setCategories([]);
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Unexpected tasks response (expected array):', data);
        setTasks([]);
        setCategories([]);
        return;
      }

      setTasks(data);

      const uniqueCategories = [...new Set(data.map((t: Task) => t.category).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tasks];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      
      if (filters.sortBy === 'priority') {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (filters.sortBy === 'created') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      
      const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dueA - dueB;
    });

    setFilteredTasks(filtered);
  };

  const handleAddTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }
      
      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      
      if (taskData.category && !categories.includes(taskData.category)) {
        setCategories(prev => [...prev, taskData.category!]);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }
      
      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }
      
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  return (
    <div className="task-manager">
      <div className="view-controls">
        <button className={`view-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          Dashboard
        </button>
        <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          List
        </button>
        <button className={`view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
          Kanban
        </button>
        <button className={`view-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
          Calendar
        </button>
      </div>

      {view === 'dashboard' ? (
        <Dashboard authToken={authToken} />
      ) : (
        <>
          <TaskForm onAddTask={handleAddTask} />
          <SearchFilter 
            onSearch={setSearchQuery} 
            onFilterChange={setFilters}
            categories={categories}
          />

          {view === 'kanban' && (
            <KanbanBoard tasks={filteredTasks} onUpdateTask={handleUpdateTask} />
          )}
          {view === 'calendar' && <CalendarView tasks={filteredTasks} />}
          {view === 'list' && (
            <>
              <div className="stats">
                <span>Total: {filteredTasks.length}</span>
                <span>Completed: {tasks.filter(t => t.status === 'completed').length}</span>
                <span>In Progress: {tasks.filter(t => t.status === 'in-progress').length}</span>
              </div>

              {loading ? (
                <p>Loading tasks...</p>
              ) : filteredTasks.length === 0 ? (
                <p className="no-tasks">No tasks found. Create one to get started!</p>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
