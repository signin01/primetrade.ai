import React, { useState } from 'react';

interface Template {
  id: number;
  name: string;
  description: string;
  priority: string;
  category: string;
  estimatedTime: number;
  tags: string[];
}

interface TaskTemplatesProps {
  onUseTemplate: (template: Template) => void;
}

const TaskTemplates: React.FC<TaskTemplatesProps> = ({ onUseTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, name: 'Daily Standup', description: 'Team meeting and progress update', priority: 'medium', category: 'work', estimatedTime: 15, tags: ['meeting', 'team'] },
    { id: 2, name: 'Market Analysis', description: 'Analyze crypto market trends', priority: 'high', category: 'trading', estimatedTime: 60, tags: ['analysis', 'crypto'] },
    { id: 3, name: 'Learn React', description: 'Study React documentation', priority: 'medium', category: 'learning', estimatedTime: 120, tags: ['coding', 'react'] },
    { id: 4, name: 'Buy Groceries', description: 'Weekly grocery shopping', priority: 'low', category: 'personal', estimatedTime: 45, tags: ['shopping', 'home'] },
  ]);
  
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    priority: 'medium',
    category: 'work',
    estimatedTime: 30,
    tags: ''
  });

  const saveCurrentAsTemplate = () => {
    if (!newTemplate.name) return;
    
    const template: Template = {
      id: Date.now(),
      name: newTemplate.name,
      description: newTemplate.description,
      priority: newTemplate.priority,
      category: newTemplate.category,
      estimatedTime: newTemplate.estimatedTime,
      tags: newTemplate.tags.split(',').map(t => t.trim())
    };
    
    setTemplates([...templates, template]);
    setShowSaveTemplate(false);
    setNewTemplate({ name: '', description: '', priority: 'medium', category: 'work', estimatedTime: 30, tags: '' });
  };

  const cloneTask = (template: Template) => {
    onUseTemplate(template);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h3 className="section-title">🔄 Task Templates</h3>
        <button onClick={() => setShowSaveTemplate(true)} className="save-template-btn">
          💾 Save Current as Template
        </button>
      </div>

      {showSaveTemplate && (
        <div className="save-template-modal">
          <div className="modal-content">
            <h4>Save as Template</h4>
            <input
              type="text"
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            />
            <select
              value={newTemplate.priority}
              onChange={(e) => setNewTemplate({ ...newTemplate, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical Priority</option>
            </select>
            <select
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="trading">Trading</option>
              <option value="learning">Learning</option>
            </select>
            <input
              type="number"
              placeholder="Estimated Time (minutes)"
              value={newTemplate.estimatedTime}
              onChange={(e) => setNewTemplate({ ...newTemplate, estimatedTime: parseInt(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTemplate.tags}
              onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={saveCurrentAsTemplate} className="save-btn">Save</button>
              <button onClick={() => setShowSaveTemplate(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <span className="template-icon">📋</span>
              <span className="template-name">{template.name}</span>
            </div>
            <div className="template-description">{template.description}</div>
            <div className="template-meta">
              <span className={`priority-badge ${template.priority}`}>{template.priority}</span>
              <span className="category-badge">{template.category}</span>
              <span className="time-badge">⏱️ {template.estimatedTime}min</span>
            </div>
            <div className="template-tags">
              {template.tags.map(tag => (
                <span key={tag} className="template-tag">#{tag}</span>
              ))}
            </div>
            <button onClick={() => cloneTask(template)} className="use-template-btn">
              📋 Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTemplates;