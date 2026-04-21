import React, { useState } from 'react';

interface CalendarViewProps {
  tasks?: any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };
  
  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <h3 className="section-title">📅 Calendar View</h3>
        <div className="calendar-nav">
          <button onClick={() => changeMonth(-1)}>←</button>
          <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}>→</button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
          
          return (
            <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
              <div className="calendar-day-number">{day}</div>
              <div className="calendar-task-dots"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;