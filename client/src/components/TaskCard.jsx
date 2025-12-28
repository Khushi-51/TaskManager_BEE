import React, { useState } from 'react';

function TaskCard({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task);

  const handleStatusChange = (newStatus) => {
    onUpdateTask(task._id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdateTask(task._id, { priority: newPriority });
  };

  const handleSaveEdit = () => {
    onUpdateTask(task._id, {
      title: editData.title,
      description: editData.description,
      category: editData.category,
      tags: editData.tags
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    return {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#F44336'
    }[priority];
  };

  const getStatusIcon = (status) => {
    return {
      todo: '○',
      'in-progress': '◐',
      completed: '●'
    }[status];
  };

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      {!isEditing ? (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <span className="task-status">{getStatusIcon(task.status)} {task.status}</span>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            {task.dueDate && (
              <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.category && <span className="category">{task.category}</span>}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="tags">
              {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          )}
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-select"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-btn" onClick={() => onDeleteTask(task._id)}>Delete</button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="edit-input"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="edit-textarea"
          ></textarea>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveEdit}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;
