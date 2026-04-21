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
      completed: 'Completed'
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
      completed: 'Completado'
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
      completed: 'पूरा हुआ'
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
      completed: '已完成'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;