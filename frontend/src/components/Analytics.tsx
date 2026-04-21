import React from 'react';

interface AnalyticsProps {
  stats?: { total: number; pending: number; inProgress: number; completed: number; completionRate: number };
}

const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <div className="analytics-container">
      <h3 className="section-title">📊 Analytics Dashboard</h3>
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="ring-value">{stats.completionRate}%</div>
          <div>Completion Rate</div>
        </div>
        <div className="analytics-card">
          <div className="quick-value">{stats.total}</div>
          <div>Total Tasks</div>
        </div>
        <div className="analytics-card">
          <div className="quick-value">{stats.completed}</div>
          <div>Completed</div>
        </div>
        <div className="analytics-card">
          <div className="quick-value">{stats.pending}</div>
          <div>Pending</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;