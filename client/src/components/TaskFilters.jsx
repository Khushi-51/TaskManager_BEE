import React from 'react';

function TaskFilters({ filters, setFilters }) {
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="filters">
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="filter-select"
      >
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="filter-select"
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="text"
        placeholder="Filter by category"
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="filter-input"
      />
    </div>
  );
}

export default TaskFilters;
