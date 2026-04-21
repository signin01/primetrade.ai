import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'year'>('month');

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="calendar-task-dots">
            {dayTasks.slice(0, 3).map(task => (
              <div key={task.id} className={`calendar-dot priority-${task.priority}`} />
            ))}
            {dayTasks.length > 3 && <span className="calendar-more">+{dayTasks.length - 3}</span>}
          </div>
        );
      }
    }
    return null;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <h3 className="section-title">📅 Calendar View</h3>
        <div className="calendar-view-switcher">
          <button onClick={() => setView('month')} className={`view-btn ${view === 'month' ? 'active' : ''}`}>Month</button>
          <button onClick={() => setView('week')} className={`view-btn ${view === 'week' ? 'active' : ''}`}>Week</button>
          <button onClick={() => setView('year')} className={`view-btn ${view === 'year' ? 'active' : ''}`}>Year</button>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-wrapper">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileContent={tileContent}
            className="custom-calendar"
          />
        </div>

        <div className="selected-date-tasks">
          <h4>Tasks for {selectedDate.toLocaleDateString()}</h4>
          {selectedDateTasks.length === 0 ? (
            <div className="no-tasks">No tasks scheduled for this day</div>
          ) : (
            <div className="date-tasks-list">
              {selectedDateTasks.map(task => (
                <div key={task.id} className={`date-task-item priority-${task.priority}`}>
                  <div className="date-task-title">{task.title}</div>
                  <div className="date-task-status">{task.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;