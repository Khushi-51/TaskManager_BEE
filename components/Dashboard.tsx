'use client';

import React, { useEffect, useState } from 'react';
import './dashboard.css';

interface Analytics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  highPriority: number;
  overdue: number;
  completionRate: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}

export default function Dashboard({ authToken }: { authToken: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading analytics...</div>;
  if (!analytics) return <div>No data</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-value">{analytics.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{analytics.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{analytics.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card info">
          <div className="stat-value">{analytics.todo}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-value">{analytics.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card secondary">
          <div className="stat-value">{analytics.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="chart-container">
          <h3>By Priority</h3>
          <div className="priority-breakdown">
            <div className="priority-item">
              <span className="priority-name">High</span>
              <div className="progress-bar">
                <div className="progress-fill high" style={{ width: `${analytics.highPriority}%` }}></div>
              </div>
              <span className="priority-count">{analytics.highPriority}</span>
            </div>
            <div className="priority-item">
              <span className="priority-name">Medium</span>
              <div className="progress-bar">
                <div className="progress-fill medium" style={{ width: `${analytics.mediumPriority}%` }}></div>
              </div>
              <span className="priority-count">{analytics.mediumPriority}</span>
            </div>
            <div className="priority-item">
              <span className="priority-name">Low</span>
              <div className="progress-bar">
                <div className="progress-fill low" style={{ width: `${analytics.lowPriority}%` }}></div>
              </div>
              <span className="priority-count">{analytics.lowPriority}</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>By Category</h3>
          <div className="category-breakdown">
            {Object.entries(analytics.byCategory).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
