import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher, { useTranslation, t as globalT } from './components/LanguageSwitcher';
import './App.css';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  twoFactorEnabled?: boolean;
  createdAt?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  dueDate: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  completionRate: number;
}

function App() {
  const { t, language } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('New York, USA');

  const API_URL = 'http://localhost:5000/api';

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = 'Desktop';
    let browser = 'Chrome';
    let os = 'Windows';
    if (/(Mobile|Android|iP(hone|od))/i.test(ua)) device = 'Mobile';
    if (ua.includes('Firefox')) browser = 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    if (ua.includes('Mac')) os = 'macOS';
    if (ua.includes('Linux')) os = 'Linux';
    return { device, browser, os };
  };

  const addActivity = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setActivityLog(prev => [`${time} - ${message}`, ...prev].slice(0, 15));
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchTasks();
      fetchStats();
      addActivity(`Logged in from ${getDeviceInfo().device}`);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser({
          ...data,
          phone: phoneNumber,
          location: location,
          twoFactorEnabled: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/stats/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';
    const body = isLogin ? { email, password } : { email, password, name };
    
    try {
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        addActivity(isLogin ? 'Login successful! 🎉' : 'Account created! 🎊');
        fetchTasks();
        fetchStats();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTask,
          dueDate: new Date(newTask.dueDate).toISOString()
        })
      });
      if (res.ok) {
        setNewTask({
          title: '',
          description: '',
          priority: 'medium',
          category: 'work',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        fetchTasks();
        fetchStats();
        addActivity(`✨ Created task: "${newTask.title}"`);
        alert('Task created successfully!');
      }
    } catch (error) {
      alert('Error creating task');
    }
  };

  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchTasks();
      fetchStats();
      addActivity(`📝 Task marked as ${status}`);
    } catch (error) {
      alert('Error updating task');
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTasks();
      fetchStats();
      addActivity(`🗑️ Deleted task`);
    } catch (error) {
      alert('Error deleting task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTasks([]);
    addActivity('Logged out');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter !== 'all' && task.status !== selectedFilter) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (!token) {
    return (
      <div className="auth-container">
        <div className="animated-bg"></div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="auth-card"
        >
          <div className="logo-icon">📊</div>
          <h1 className="auth-title">Primetrade.ai</h1>
          <p className="auth-subtitle">Trading Intelligence Platform</p>
          
          <form onSubmit={handleAuth}>
            <AnimatePresence>
              {!isLogin && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  type="text"
                  placeholder={t('fullName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                />
              )}
            </AnimatePresence>
            
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? <div className="spinner"></div> : (isLogin ? t('login') : t('register'))}
            </button>
          </form>
          
          <p className="auth-switch">
            {isLogin ? "New to Primetrade? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="switch-button">
              {isLogin ? t('signUp') : t('signIn')}
            </button>
          </p>
          
          {isLogin && (
            <p className="demo-hint">
              {t('demoHint')}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="animated-bg"></div>

      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-small">
            <div className="logo-small-icon">📊</div>
            <span>Primetrade.ai</span>
          </div>
          
          <div className="nav-controls">
            <button onClick={() => { setShowAnalytics(!showAnalytics); setShowCalendar(false); setShowGamification(false); }} className={`nav-btn ${showAnalytics ? 'active' : ''}`}>
              {t('analytics')}
            </button>
            <button onClick={() => { setShowCalendar(!showCalendar); setShowAnalytics(false); setShowGamification(false); }} className={`nav-btn ${showCalendar ? 'active' : ''}`}>
              {t('calendar')}
            </button>
            <button onClick={() => { setShowGamification(!showGamification); setShowAnalytics(false); setShowCalendar(false); }} className={`nav-btn ${showGamification ? 'active' : ''}`}>
              {t('gamification')}
            </button>
            <LanguageSwitcher />
          </div>
          
          <div className="nav-right">
            <div className="user-info" onClick={() => setShowProfile(!showProfile)}>
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-device">{getDeviceInfo().device} • {getDeviceInfo().browser}</span>
              </div>
            </div>
            <button onClick={logout} className="logout-btn">{t('logout')}</button>
          </div>
        </div>
      </nav>

      <div className="session-bar">
        <div className="session-bar-content">
          <span>{t('currentSession')}</span>
          <span>{getDeviceInfo().device} • {getDeviceInfo().browser} on {getDeviceInfo().os}</span>
          <span>📍 {location}</span>
          <span>🕐 {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="dashboard-content">
        {stats && (
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-value">{stats.total}</div><div className="stat-label">{t('totalTasks')}</div></div>
            <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-value">{stats.pending}</div><div className="stat-label">{t('pending')}</div></div>
            <div className="stat-card"><div className="stat-icon">🔄</div><div className="stat-value">{stats.inProgress}</div><div className="stat-label">{t('inProgress')}</div></div>
            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{stats.completed}</div><div className="stat-label">{t('completed')}</div></div>
            <div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-value">{stats.completionRate}%</div><div className="stat-label">{t('successRate')}</div></div>
          </div>
        )}

        {!showAnalytics && !showCalendar && !showGamification && (
          <div className="main-grid">
            <div className="create-task-card">
              <h2 className="section-title">{t('createNewTask')}</h2>
              <form onSubmit={createTask}>
                <input type="text" placeholder={t('taskTitle')} value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="task-input" required />
                <textarea placeholder={t('description')} value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="task-textarea" rows={3} />
                <div className="form-row">
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="priority-select">
                    <option value="low">{t('lowPriority')}</option>
                    <option value="medium">{t('mediumPriority')}</option>
                    <option value="high">{t('highPriority')}</option>
                    <option value="critical">{t('criticalPriority')}</option>
                  </select>
                  <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="category-select">
                    <option value="work">{t('work')}</option>
                    <option value="personal">{t('personal')}</option>
                    <option value="trading">{t('trading')}</option>
                    <option value="learning">{t('learning')}</option>
                  </select>
                </div>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="date-input" />
                <button type="submit" className="create-btn">{t('createTask')}</button>
              </form>
            </div>

            <div className="tasks-card">
              <div className="tasks-header">
                <h2 className="section-title">{t('yourTasks')}</h2>
                <input type="text" placeholder={t('searchTasks')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
              </div>
              
              <div className="filter-section">
                <div className="filter-group">
                  <label>{t('status')}</label>
                  <div className="filter-buttons">
                    {['all', 'pending', 'in-progress', 'completed'].map(filter => (
                      <button key={filter} onClick={() => setSelectedFilter(filter)} className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}>
                        {filter === 'all' ? t('all') : filter === 'in-progress' ? t('inProgressFilter') : filter === 'pending' ? t('pending') : t('completed')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <label>{t('category')}</label>
                  <div className="category-buttons">
                    {['all', 'work', 'personal', 'trading', 'learning'].map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}>
                        {cat === 'all' ? t('all') : cat === 'work' ? t('work') : cat === 'personal' ? t('personal') : cat === 'trading' ? t('trading') : t('learning')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tasks-list">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state"><div className="empty-emoji">🎯</div><p>{t('noTasksFound')}</p></div>
                ) : (
                  filteredTasks.map((task) => {
                    const daysUntilDue = getDaysUntilDue(task.dueDate);
                    const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
                    return (
                      <div key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                        <div className="task-content">
                          <div className="task-header">
                            <h3 className="task-title">{task.title}</h3>
                            <div className="task-badges">
                              <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                              <span className={`status-badge ${task.status}`}>{task.status}</span>
                              <span className="category-badge">{task.category}</span>
                            </div>
                          </div>
                          {task.description && <p className="task-description">{task.description}</p>}
                          <div className="task-meta"><span className="task-date">📅 Due: {new Date(task.dueDate).toLocaleDateString()}{isOverdue && <span className="overdue-badge"> {t('overdue')}</span>}</span></div>
                        </div>
                        <div className="task-actions">
                          {task.status !== 'completed' && <button onClick={() => updateTaskStatus(task.id, 'completed')} className="action-btn complete">{t('complete')}</button>}
                          {task.status === 'pending' && <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="action-btn progress">{t('start')}</button>}
                          <button onClick={() => deleteTask(task.id)} className="action-btn delete">{t('delete')}</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        <div className="social-share">
          <h4>{t('shareProgress')}</h4>
          <div className="share-buttons">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} className="share-btn link">{t('copyLink')}</button>
            <button onClick={() => { alert('Exporting data...'); }} className="share-btn export">{t('exportDataBtn')}</button>
          </div>
        </div>

        <div className="activity-timeline">
          <h3 className="section-title">{t('recentActivity')}</h3>
          <div className="activity-list">
            {activityLog.length === 0 ? <p className="no-activity">{t('noActivity')}</p> : activityLog.map((activity, i) => (<div key={i} className="activity-item"><span className="activity-time">{activity.split(' - ')[0]}</span><span className="activity-text">{activity.split(' - ')[1]}</span></div>))}
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="profile-sidebar">
          <div className="profile-header"><button className="close-profile" onClick={() => setShowProfile(false)}>✕</button><div className="profile-avatar-large">{user?.name?.charAt(0).toUpperCase()}</div><h2>{user?.name}</h2><p className="profile-role">{user?.role}</p><p className="profile-email">{user?.email}</p></div>
          <div className="profile-section"><h3>{t('contactInfo')}</h3><div className="profile-field"><label>{t('phoneNumber')}</label><input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div><div className="profile-field"><label>{t('location')}</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /></div></div>
          <div className="profile-section"><h3>{t('security')}</h3><div className="profile-field"><label>{t('twoFactorAuth')}</label><button className="secondary-btn" onClick={() => alert('2FA coming soon!')}>{t('enable2FA')}</button></div></div>
          <div className="profile-section"><h3>{t('accountActions')}</h3><button className="danger-btn" onClick={() => alert('Exporting...')}>{t('exportData')}</button><button className="danger-btn delete-account" onClick={() => alert('Delete account')}>{t('deleteAccount')}</button></div>
        </div>
      )}
    </div>
  );
}

export default App;