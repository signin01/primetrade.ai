import React, { useState, useEffect } from 'react';

interface GamificationProps {
  tasks: any[];
  userName: string;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  achieved: boolean;
  achievedAt?: Date;
}

const Gamification: React.FC<GamificationProps> = ({ tasks, userName }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, name: 'Task Master', description: 'Complete 10 tasks', icon: '🏆', requirement: 10, achieved: false },
    { id: 2, name: 'Productivity Pro', description: 'Complete 50 tasks', icon: '⭐', requirement: 50, achieved: false },
    { id: 3, name: 'Streak Champion', description: '7 day streak', icon: '🔥', requirement: 7, achieved: false },
    { id: 4, name: 'Category Collector', description: 'Create tasks in all categories', icon: '📚', requirement: 4, achieved: false },
    { id: 5, name: 'Priority Master', description: 'Complete 5 critical tasks', icon: '⚡', requirement: 5, achieved: false },
  ]);

  useEffect(() => {
    // Calculate XP from completed tasks
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const newXp = completedTasks * 10;
    setXp(newXp);
    setLevel(Math.floor(newXp / 100) + 1);

    // Check achievements
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.achieved) {
        let achieved = false;
        if (achievement.id === 1 && completedTasks >= 10) achieved = true;
        if (achievement.id === 2 && completedTasks >= 50) achieved = true;
        if (achievement.id === 3 && streak >= 7) achieved = true;
        if (achievement.id === 4 && new Set(tasks.map(t => t.category)).size >= 4) achieved = true;
        if (achievement.id === 5 && tasks.filter(t => t.priority === 'critical' && t.status === 'completed').length >= 5) achieved = true;
        
        if (achieved) {
          return { ...achievement, achieved: true, achievedAt: new Date() };
        }
      }
      return achievement;
    });
    setAchievements(updatedAchievements);
  }, [tasks, streak]);

  const xpToNextLevel = 100 - (xp % 100);
  const nextLevelXp = 100 - xpToNextLevel;
  const progressPercent = (nextLevelXp / 100) * 100;

  return (
    <div className="gamification-container">
      <div className="gamification-header">
        <h3>🏆 Gamification</h3>
        <div className="user-rank">
          <span className="rank-icon">👑</span>
          <span>Level {level}</span>
        </div>
      </div>

      {/* XP Progress */}
      <div className="xp-section">
        <div className="xp-info">
          <span>✨ {xp} XP</span>
          <span>{xpToNextLevel} XP to next level</span>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Streak Counter */}
      <div className="streak-section">
        <div className="streak-card">
          <span className="streak-icon">🔥</span>
          <div>
            <div className="streak-value">{streak}</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>
        <div className="streak-card">
          <span className="streak-icon">⭐</span>
          <div>
            <div className="streak-value">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="streak-label">Tasks Done</div>
          </div>
        </div>
        <div className="streak-card">
          <span className="streak-icon">🎯</span>
          <div>
            <div className="streak-value">{level}</div>
            <div className="streak-label">Level</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h4>🏅 Achievements</h4>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`achievement-card ${achievement.achieved ? 'achieved' : 'locked'}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-desc">{achievement.description}</div>
              {achievement.achieved && (
                <div className="achievement-date">
                  {achievement.achievedAt?.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard (Mock) */}
      <div className="leaderboard-section">
        <h4>📊 Leaderboard</h4>
        <div className="leaderboard-list">
          <div className="leaderboard-item gold">
            <span className="rank">1</span>
            <span className="name">{userName}</span>
            <span className="points">{xp} XP</span>
          </div>
          <div className="leaderboard-item silver">
            <span className="rank">2</span>
            <span className="name">TraderPro</span>
            <span className="points">450 XP</span>
          </div>
          <div className="leaderboard-item bronze">
            <span className="rank">3</span>
            <span className="name">CryptoKing</span>
            <span className="points">320 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;