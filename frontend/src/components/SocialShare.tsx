import React from 'react';

interface SocialShareProps {
  stats?: any;
}

const SocialShare: React.FC<SocialShareProps> = ({ stats }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  
  const exportData = () => {
    const data = JSON.stringify({ stats, timestamp: new Date() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };
  
  return (
    <div className="social-share">
      <h4>🔗 Share Your Progress</h4>
      <div className="share-buttons">
        <button onClick={copyLink} className="share-btn link">🔗 Copy Link</button>
        <button onClick={exportData} className="share-btn export">📥 Export Data</button>
      </div>
    </div>
  );
};

export default SocialShare;