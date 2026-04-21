import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      tasks: 'Tasks',
      create: 'Create',
      delete: 'Delete',
      complete: 'Complete',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      totalTasks: 'Total Tasks',
      successRate: 'Success Rate',
      createNewTask: 'Create New Task',
      taskTitle: 'Task title',
      description: 'Description',
      dueDate: 'Due Date',
      priority: 'Priority',
      category: 'Category',
      searchTasks: 'Search tasks...',
      recentActivity: 'Recent Activity',
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      tasks: 'Tareas',
      create: 'Crear',
      delete: 'Eliminar',
      complete: 'Completar',
      pending: 'Pendiente',
      inProgress: 'En Progreso',
      completed: 'Completado',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      dashboard: 'Tablero',
      totalTasks: 'Tareas Totales',
      successRate: 'Tasa de Éxito',
      createNewTask: 'Crear Nueva Tarea',
      taskTitle: 'Título de la tarea',
      description: 'Descripción',
      dueDate: 'Fecha de Vencimiento',
      priority: 'Prioridad',
      category: 'Categoría',
      searchTasks: 'Buscar tareas...',
      recentActivity: 'Actividad Reciente',
    }
  },
  hi: {
    translation: {
      welcome: 'स्वागत है',
      tasks: 'कार्य',
      create: 'बनाएं',
      delete: 'हटाएं',
      complete: 'पूरा करें',
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      completed: 'पूरा हुआ',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      dashboard: 'डैशबोर्ड',
      totalTasks: 'कुल कार्य',
      successRate: 'सफलता दर',
      createNewTask: 'नया कार्य बनाएं',
      taskTitle: 'कार्य शीर्षक',
      description: 'विवरण',
      dueDate: 'नियत तिथि',
      priority: 'प्राथमिकता',
      category: 'श्रेणी',
      searchTasks: 'कार्य खोजें...',
      recentActivity: 'हाल की गतिविधि',
    }
  },
  zh: {
    translation: {
      welcome: '欢迎',
      tasks: '任务',
      create: '创建',
      delete: '删除',
      complete: '完成',
      pending: '待处理',
      inProgress: '进行中',
      completed: '已完成',
      logout: '退出',
      login: '登录',
      register: '注册',
      dashboard: '仪表板',
      totalTasks: '总任务',
      successRate: '成功率',
      createNewTask: '创建新任务',
      taskTitle: '任务标题',
      description: '描述',
      dueDate: '截止日期',
      priority: '优先级',
      category: '分类',
      searchTasks: '搜索任务...',
      recentActivity: '最近活动',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
