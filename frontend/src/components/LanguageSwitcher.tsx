import React, { useState, useEffect } from 'react';

// Complete translations
const translations: Record<string, any> = {
  en: {
    analytics: '📊 Analytics',
    calendar: '📅 Calendar',
    gamification: '🏆 Gamification',
    logout: 'Logout',
    totalTasks: 'Total Tasks',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    successRate: 'Success Rate',
    createNewTask: '✨ Create New Task',
    taskTitle: 'Task title...',
    description: 'Description',
    createTask: '+ Create Task',
    lowPriority: '🟢 Low Priority',
    mediumPriority: '🟡 Medium Priority',
    highPriority: '🟠 High Priority',
    criticalPriority: '🔴 Critical Priority',
    work: '💼 Work',
    personal: '🏠 Personal',
    trading: '📈 Trading',
    learning: '📚 Learning',
    yourTasks: '📋 Your Tasks',
    searchTasks: '🔍 Search tasks...',
    status: 'Status:',
    all: 'All',
    inProgressFilter: 'In Progress',
    complete: 'Complete',
    start: 'Start',
    delete: 'Delete',
    noTasksFound: 'No tasks found. Create your first task!',
    recentActivity: '📝 Recent Activity',
    noActivity: 'No activity yet',
    currentSession: '🔐 Current Session:',
    profile: 'Profile',
    contactInfo: '📞 Contact Information',
    phoneNumber: 'Phone Number',
    location: 'Location',
    memberSince: 'Member Since',
    security: '🔐 Security',
    twoFactorAuth: 'Two-Factor Authentication',
    enable2FA: 'Enable 2FA',
    changePassword: 'Change Password',
    accountActions: '📊 Account Actions',
    exportData: '📥 Export All Data',
    deleteAccount: '🗑️ Delete Account',
    shareProgress: '🔗 Share Your Progress',
    copyLink: '🔗 Copy Link',
    exportDataBtn: '📥 Export Data',
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    demoHint: 'Demo: admin@example.com / admin123'
  },
  es: {
    analytics: '📊 Analítica',
    calendar: '📅 Calendario',
    gamification: '🏆 Gamificación',
    logout: 'Cerrar Sesión',
    totalTasks: 'Tareas Totales',
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    completed: 'Completado',
    successRate: 'Tasa de Éxito',
    createNewTask: '✨ Crear Nueva Tarea',
    taskTitle: 'Título de la tarea...',
    description: 'Descripción',
    createTask: '+ Crear Tarea',
    lowPriority: '🟢 Prioridad Baja',
    mediumPriority: '🟡 Prioridad Media',
    highPriority: '🟠 Prioridad Alta',
    criticalPriority: '🔴 Prioridad Crítica',
    work: '💼 Trabajo',
    personal: '🏠 Personal',
    trading: '📈 Comercio',
    learning: '📚 Aprendizaje',
    yourTasks: '📋 Tus Tareas',
    searchTasks: '🔍 Buscar tareas...',
    status: 'Estado:',
    all: 'Todos',
    inProgressFilter: 'En Progreso',
    complete: 'Completar',
    start: 'Comenzar',
    delete: 'Eliminar',
    noTasksFound: 'No se encontraron tareas. ¡Crea tu primera tarea!',
    recentActivity: '📝 Actividad Reciente',
    noActivity: 'Sin actividad aún',
    currentSession: '🔐 Sesión Actual:',
    profile: 'Perfil',
    contactInfo: '📞 Información de Contacto',
    phoneNumber: 'Número de Teléfono',
    location: 'Ubicación',
    memberSince: 'Miembro Desde',
    security: '🔐 Seguridad',
    twoFactorAuth: 'Autenticación de Dos Factores',
    enable2FA: 'Activar 2FA',
    changePassword: 'Cambiar Contraseña',
    accountActions: '📊 Acciones de Cuenta',
    exportData: '📥 Exportar Datos',
    deleteAccount: '🗑️ Eliminar Cuenta',
    shareProgress: '🔗 Comparte tu Progreso',
    copyLink: '🔗 Copiar Enlace',
    exportDataBtn: '📥 Exportar Datos',
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    signUp: 'Registrarse',
    signIn: 'Iniciar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    fullName: 'Nombre Completo',
    demoHint: 'Demo: admin@example.com / admin123'
  },
  hi: {
    analytics: '📊 एनालिटिक्स',
    calendar: '📅 कैलेंडर',
    gamification: '🏆 गेमिफिकेशन',
    logout: 'लॉगआउट',
    totalTasks: 'कुल कार्य',
    pending: 'लंबित',
    inProgress: 'प्रगति में',
    completed: 'पूरा हुआ',
    successRate: 'सफलता दर',
    createNewTask: '✨ नया कार्य बनाएं',
    taskTitle: 'कार्य शीर्षक...',
    description: 'विवरण',
    createTask: '+ कार्य बनाएं',
    lowPriority: '🟢 निम्न प्राथमिकता',
    mediumPriority: '🟡 मध्यम प्राथमिकता',
    highPriority: '🟠 उच्च प्राथमिकता',
    criticalPriority: '🔴 गंभीर प्राथमिकता',
    work: '💼 काम',
    personal: '🏠 व्यक्तिगत',
    trading: '📈 ट्रेडिंग',
    learning: '📚 सीखना',
    yourTasks: '📋 आपके कार्य',
    searchTasks: '🔍 कार्य खोजें...',
    status: 'स्थिति:',
    all: 'सभी',
    inProgressFilter: 'प्रगति में',
    complete: 'पूरा करें',
    start: 'शुरू करें',
    delete: 'हटाएं',
    noTasksFound: 'कोई कार्य नहीं मिला। अपना पहला कार्य बनाएं!',
    recentActivity: '📝 हाल की गतिविधि',
    noActivity: 'अभी तक कोई गतिविधि नहीं',
    currentSession: '🔐 वर्तमान सत्र:',
    profile: 'प्रोफ़ाइल',
    contactInfo: '📞 संपर्क जानकारी',
    phoneNumber: 'फोन नंबर',
    location: 'स्थान',
    memberSince: 'सदस्यता तिथि',
    security: '🔐 सुरक्षा',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    enable2FA: '2FA सक्षम करें',
    changePassword: 'पासवर्ड बदलें',
    accountActions: '📊 खाता क्रियाएँ',
    exportData: '📥 डेटा निर्यात करें',
    deleteAccount: '🗑️ खाता हटाएं',
    shareProgress: '🔗 अपनी प्रगति साझा करें',
    copyLink: '🔗 लिंक कॉपी करें',
    exportDataBtn: '📥 डेटा निर्यात करें',
    welcome: 'स्वागत है',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    signUp: 'साइन अप',
    signIn: 'साइन इन',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    demoHint: 'डेमो: admin@example.com / admin123'
  },
  zh: {
    analytics: '📊 分析',
    calendar: '📅 日历',
    gamification: '🏆 游戏化',
    logout: '退出',
    totalTasks: '总任务',
    pending: '待处理',
    inProgress: '进行中',
    completed: '已完成',
    successRate: '成功率',
    createNewTask: '✨ 创建新任务',
    taskTitle: '任务标题...',
    description: '描述',
    createTask: '+ 创建任务',
    lowPriority: '🟢 低优先级',
    mediumPriority: '🟡 中优先级',
    highPriority: '🟠 高优先级',
    criticalPriority: '🔴 紧急优先级',
    work: '💼 工作',
    personal: '🏠 个人',
    trading: '📈 交易',
    learning: '📚 学习',
    yourTasks: '📋 您的任务',
    searchTasks: '🔍 搜索任务...',
    status: '状态:',
    all: '全部',
    inProgressFilter: '进行中',
    complete: '完成',
    start: '开始',
    delete: '删除',
    noTasksFound: '未找到任务。创建您的第一个任务！',
    recentActivity: '📝 最近活动',
    noActivity: '暂无活动',
    currentSession: '🔐 当前会话:',
    profile: '个人资料',
    contactInfo: '📞 联系信息',
    phoneNumber: '电话号码',
    location: '位置',
    memberSince: '注册时间',
    security: '🔐 安全',
    twoFactorAuth: '双重认证',
    enable2FA: '启用2FA',
    changePassword: '修改密码',
    accountActions: '📊 账户操作',
    exportData: '📥 导出数据',
    deleteAccount: '🗑️ 删除账户',
    shareProgress: '🔗 分享您的进度',
    copyLink: '🔗 复制链接',
    exportDataBtn: '📥 导出数据',
    welcome: '欢迎',
    login: '登录',
    register: '注册',
    signUp: '注册',
    signIn: '登录',
    email: '电子邮件',
    password: '密码',
    fullName: '全名',
    demoHint: '演示: admin@example.com / admin123'
  }
};

// Global state for language
let currentLanguage = localStorage.getItem('appLanguage') || 'en';
let listeners: ((lang: string) => void)[] = [];

// Function to change language
export const setAppLanguage = (lang: string) => {
  currentLanguage = lang;
  localStorage.setItem('appLanguage', lang);
  // Notify all listeners
  listeners.forEach(listener => listener(lang));
};

// Function to get current language
export const getAppLanguage = () => currentLanguage;

// Function to translate
export const t = (key: string): string => {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
};

// Hook to subscribe to language changes
export const useTranslation = () => {
  const [language, setLanguage] = useState(currentLanguage);

  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
    };
    listeners.push(handleLanguageChange);
    return () => {
      listeners = listeners.filter(l => l !== handleLanguageChange);
    };
  }, []);

  return { t, language, setLanguage: setAppLanguage };
};

// Language Switcher Component
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
    { code: 'zh', flag: '🇨🇳', name: '中文' }
  ];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`lang-btn ${language === lang.code ? 'active' : ''}`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;