import React, { useState } from 'react';

interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: Date;
  mentions?: string[];
}

interface TaskCommentsProps {
  taskId: number;
  currentUser: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Detect mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = [...newComment.matchAll(mentionRegex)].map(m => m[1]);
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      author: currentUser,
      createdAt: new Date(),
      mentions
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    
    // Notify mentioned users (mock)
    mentions.forEach(mention => {
      console.log(`Notifying @${mention}`);
    });
  };

  return (
    <div className="task-comments">
      <h4>💬 Comments ({comments.length})</h4>
      
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment... Use @username to mention someone"
          rows={3}
        />
        <button onClick={handleAddComment} className="post-comment-btn">Post Comment</button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">{comment.author.charAt(0)}</div>
              <div className="comment-content">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">
                  {comment.text.split(/(@\w+)/g).map((part, i) => 
                    part.startsWith('@') ? <span key={i} className="mention">{part}</span> : part
                  )}
                </div>
                <div className="comment-time">{comment.createdAt.toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskComments;