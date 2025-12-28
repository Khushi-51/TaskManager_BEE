'use client';

import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (task: any) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    tags: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map((t) => t.trim()) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onAddTask({
      ...formData,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(formData.tags) ? formData.tags : [],
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    });

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      category: '',
      tags: '',
    });
    setIsExpanded(false);
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h3 className="form-title">📝 Create New Task</h3>
        <button 
          type="button"
          className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-main">
          <div className="form-field">
            <label htmlFor="title" className="form-label">Task Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add more details about your task..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={2}
            ></textarea>
          </div>

          {isExpanded && (
            <div className="advanced-options">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select 
                    id="priority"
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input
                    id="category"
                    type="text"
                    name="category"
                    placeholder="e.g., Work, Personal"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="tags" className="form-label">Tags</label>
                  <input
                    id="tags"
                    type="text"
                    name="tags"
                    placeholder="e.g., urgent, important"
                    value={formData.tags}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          <span>✨ Add Task</span>
        </button>
      </form>
    </div>
  );
}
