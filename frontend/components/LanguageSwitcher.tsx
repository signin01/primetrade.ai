import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;