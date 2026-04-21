const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory storage (no database needed!)
const users = [];
const tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

// Initialize admin user
(async () => {
  const adminExists = users.find(u => u.email === 'admin@example.com');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    users.push({
      id: userIdCounter++,
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Admin user created: admin@example.com / admin123');
  }
})();

// ============ AUTH MIDDLEWARE ============
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: userIdCounter++,
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  });
});

// ============ TASK ROUTES ============
app.post('/api/tasks', authMiddleware, (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const newTask = {
      id: taskIdCounter++,
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: req.user.id,
      assignedTo: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tasks', authMiddleware, (req, res) => {
  let userTasks = tasks.filter(t => 
    req.user.role === 'admin' || t.createdBy === req.user.id || t.assignedTo === req.user.id
  );
  
  // Apply filters
  if (req.query.status) {
    userTasks = userTasks.filter(t => t.status === req.query.status);
  }
  if (req.query.priority) {
    userTasks = userTasks.filter(t => t.priority === req.query.priority);
  }
  
  res.json({
    tasks: userTasks,
    total: userTasks.length
  });
});

app.get('/api/tasks/:id', authMiddleware, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (req.user.role !== 'admin' && task.createdBy !== req.user.id && task.assignedTo !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(task);
});

app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  tasks[taskIndex] = {
    ...task,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

app.get('/api/tasks/stats/summary', authMiddleware, (req, res) => {
  const userTasks = tasks.filter(t => 
    req.user.role === 'admin' || t.createdBy === req.user.id || t.assignedTo === req.user.id
  );
  
  const stats = {
    total: userTasks.length,
    pending: userTasks.filter(t => t.status === 'pending').length,
    inProgress: userTasks.filter(t => t.status === 'in-progress').length,
    completed: userTasks.filter(t => t.status === 'completed').length,
    highPriority: userTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length,
    completionRate: userTasks.length > 0 
      ? ((userTasks.filter(t => t.status === 'completed').length / userTasks.length) * 100).toFixed(1)
      : 0
  };
  
  res.json(stats);
});

// Admin route
app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const allUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(allUsers);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server running with in-memory storage',
    users: users.length,
    tasks: tasks.length,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Storage: In-Memory (no database needed)`);
  console.log(`\n📝 Test Accounts:`);
  console.log(`   Admin: admin@example.com / admin123`);
  console.log(`   User: Register via API\n`);
});