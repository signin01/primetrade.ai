import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  tasks: any[];
}

const Notifications: React.FC<NotificationsProps> = ({ tasks }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && browserNotifications) {
      Notification.requestPermission();
    }
  }, [browserNotifications]);

  // Check for due tasks
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const hoursLeft = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursLeft <= 24 && hoursLeft > 0 && task.status !== 'completed') {
          const newNotification: Notification = {
            id: Date.now(),
            title: 'Task Due Soon!',
            message: `"${task.title}" is due in ${Math.ceil(hoursLeft)} hours`,
            type: 'warning',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev].slice(0, 20));
          
          // Play sound
          if (soundEnabled) {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed'));
          }
          
          // Browser notification
          if (browserNotifications && Notification.permission === 'granted') {
            new Notification(task.title, { body: `Due in ${Math.ceil(hoursLeft)} hours` });
          }
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [tasks, soundEnabled, browserNotifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="notifications-container">
      <button 
        className="notifications-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <div className="notification-actions">
              <button onClick={markAllAsRead} className="notif-action-btn">Mark all read</button>
              <button onClick={clearAll} className="notif-action-btn">Clear all</button>
            </div>
          </div>
          
          <div className="notification-settings">
            <label>
              <input 
                type="checkbox" 
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              🔔 Sound Alerts
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={browserNotifications}
                onChange={(e) => setBrowserNotifications(e.target.checked)}
              />
              🌐 Browser Notifications
            </label>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notification-icon">{getNotificationIcon(notif.type)}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notif.title}</div>
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">
                      {notif.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;