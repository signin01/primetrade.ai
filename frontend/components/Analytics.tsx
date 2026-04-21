import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  dueDate: string;
}

interface AnalyticsProps {
  tasks: Task[];
  stats: { total: number; pending: number; inProgress: number; completed: number; completionRate: number };
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks, stats }) => {
  // Weekly progress data
  const weeklyData = [
    { day: 'Mon', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 1).length },
    { day: 'Tue', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 2).length },
    { day: 'Wed', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 3).length },
    { day: 'Thu', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 4).length },
    { day: 'Fri', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 5).length },
    { day: 'Sat', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 6).length },
    { day: 'Sun', tasks: tasks.filter(t => new Date(t.createdAt).getDay() === 0).length },
  ];

  // Category data for pie chart
  const categoryData = [
    { name: 'Work', value: tasks.filter(t => t.category === 'work').length, color: '#8B5CF6' },
    { name: 'Personal', value: tasks.filter(t => t.category === 'personal').length, color: '#EC4899' },
    { name: 'Trading', value: tasks.filter(t => t.category === 'trading').length, color: '#F59E0B' },
    { name: 'Learning', value: tasks.filter(t => t.category === 'learning').length, color: '#10B981' },
  ];

  // Priority data
  const priorityData = [
    { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, color: '#EF4444' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F59E0B' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#8B5CF6' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10B981' },
  ];

  // Productivity trend (last 7 days)
  const productivityData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const completedCount = tasks.filter(t => 
      t.status === 'completed' && 
      new Date(t.createdAt).toDateString() === date.toDateString()
    ).length;
    return { date: date.toLocaleDateString(), completed: completedCount };
  }).reverse();

  return (
    <div className="analytics-container">
      <h3 className="section-title">📊 Advanced Analytics Dashboard</h3>
      
      <div className="analytics-grid">
        {/* Completion Rate Card */}
        <div className="analytics-card">
          <h4>Overall Completion Rate</h4>
          <div className="completion-ring">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="62" fill="none" stroke="#334155" strokeWidth="8"/>
              <circle 
                cx="70" cy="70" r="62" fill="none" 
                stroke="url(#gradient)" strokeWidth="8"
                strokeDasharray={`${stats.completionRate * 3.89} 389`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6"/>
                  <stop offset="100%" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="ring-value">{stats.completionRate}%</div>
          </div>
          <div className="ring-stats">
            <div>✅ Completed: {stats.completed}</div>
            <div>📋 Total: {stats.total}</div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="analytics-card">
          <h4>Weekly Task Creation</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="tasks" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="analytics-card">
          <h4>Tasks by Category</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Bar Chart */}
        <div className="analytics-card">
          <h4>Tasks by Priority</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155' }} />
              <Bar dataKey="value">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Trend */}
        <div className="analytics-card">
          <h4>Productivity Trend (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap Data */}
        <div className="analytics-card">
          <h4>Productivity Heatmap</h4>
          <div className="heatmap">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="heatmap-row">
                <span className="heatmap-day">{day}</span>
                <div className="heatmap-cells">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const intensity = Math.random() * 100;
                    return (
                      <div 
                        key={hour} 
                        className="heatmap-cell"
                        style={{ 
                          backgroundColor: intensity > 70 ? '#8B5CF6' : 
                                         intensity > 40 ? '#A78BFA' : 
                                         intensity > 20 ? '#C4B5FD' : '#E9D5FF',
                          opacity: intensity / 100
                        }}
                        title={`${day} ${hour}:00 - ${Math.floor(intensity)}% activity`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;