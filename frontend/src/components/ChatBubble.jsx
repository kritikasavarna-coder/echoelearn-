import React from 'react';
import { Bot, CheckCheck } from 'lucide-react';
import './ChatBubble.css';

export default function ChatBubble({ message }) {
  const { sender, type, content, text, timestamp } = message;
  const isUser = sender === 'user';

  return (
    <div className={`chat-bubble-row ${sender} fade-in`}>
      {!isUser && (
        <div className="chat-avatar">
          <Bot size={18}/>
        </div>
      )}
      <div className={`chat-bubble ${sender}`}>
        <div className="bubble-content">
          {type === 'explanation' ? (
            <div className="explanation-section">
              <p>{content.intro}</p>
              <p className="explanation-subheading">{content.subheading}</p>
              <ul className="explanation-bullets">
                {content.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              {content.formula && (
                <div className="formula-box">
                  {content.formula}
                </div>
              )}
            </div>
          ) : (
            <p>{text}</p>
          )}
        </div>
        <div className="bubble-footer">
          <span className="message-timestamp">{timestamp}</span>
          {isUser && (
            <span className="check-icon">
              <CheckCheck size={14} strokeWidth={2.5}/>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}