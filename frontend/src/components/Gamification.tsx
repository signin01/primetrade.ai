import React, { useEffect, useState } from 'react';

interface GamificationProps {
  tasks?: any[];
  userName?: string;
}

const Gamification: React.FC<GamificationProps> = ({ tasks = [], userName = 'User' }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  
  useEffect(() => {
    const completed = tasks.filter((t: any) => t.status === 'completed').length;
    const newXp = completed * 10;
    setXp(newXp);
    setLevel(Math.floor(newXp / 100) + 1);
  }, [tasks]);
  
  const progressPercent = (xp % 100);
  
  return (
    <div className="gamification-container">
      <div className="gamification-header">
        <h3>🏆 Gamification</h3>
        <div className="user-rank">Level {level}</div>
      </div>
      
      <div className="xp-section">
        <div className="xp-info">
          <span>✨ {xp} XP</span>
          <span>{100 - (xp % 100)} XP to next level</span>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      <div className="achievements-section">
        <h4>🏅 Achievements</h4>
        <div className="achievements-grid">
          <div className="achievement-card achieved">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-name">Task Master</div>
          </div>
          <div className="achievement-card locked">
            <div className="achievement-icon">⭐</div>
            <div className="achievement-name">Productivity Pro</div>
          </div>
          <div className="achievement-card locked">
            <div className="achievement-icon">📚</div>
            <div className="achievement-name">Category Collector</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;