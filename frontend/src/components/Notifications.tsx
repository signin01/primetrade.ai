import React, { useState } from 'react';

interface NotificationsProps {
  tasks?: any[];
}

const Notifications: React.FC<NotificationsProps> = ({ tasks = [] }) => {
  const [show, setShow] = useState(false);
  const unreadCount = 0;
  
  return (
    <div className="notifications-container">
      <button className="notifications-bell" onClick={() => setShow(!show)}>
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {show && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h4>Notifications</h4>
          </div>
          <div className="notifications-list">
            <div className="no-notifications">No new notifications</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;