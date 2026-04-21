import React, { useState } from 'react';

interface Attachment {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface FileAttachmentProps {
  taskId: number;
  onAttachmentsChange?: (attachments: Attachment[]) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ taskId, onAttachmentsChange }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newAttachment: Attachment = {
          id: Date.now() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          url: event.target?.result as string,
          uploadedAt: new Date()
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        onAttachmentsChange?.([...attachments, newAttachment]);
      };
      
      reader.readAsDataURL(file);
    }
    
    setUploading(false);
  };

  const removeAttachment = (id: number) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    onAttachmentsChange?.(attachments.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    return '📎';
  };

  return (
    <div className="file-attachment">
      <div className="attachment-upload">
        <label className="upload-btn">
          📎 Attach Files
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        {uploading && <span className="uploading">Uploading...</span>}
      </div>

      {attachments.length > 0 && (
        <div className="attachments-list">
          {attachments.map(att => (
            <div key={att.id} className="attachment-item">
              <div className="attachment-info">
                <span className="attachment-icon">{getFileIcon(att.type)}</span>
                <div className="attachment-details">
                  <div className="attachment-name">{att.name}</div>
                  <div className="attachment-meta">
                    {formatFileSize(att.size)} • {att.uploadedAt.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="attachment-actions">
                <a href={att.url} download={att.name} className="download-btn">⬇️</a>
                <button onClick={() => removeAttachment(att.id)} className="remove-btn">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;