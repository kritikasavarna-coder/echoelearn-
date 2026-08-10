import React from 'react';
import { Bot, Trophy } from 'lucide-react';
import './CompletionCard.css';

export default function CompletionCard({ completion }) {
  return (
    <div className="completion-card-row fade-in">
      <div className="bot-avatar">
        <Bot size={18}/>
      </div>
      <div className="completion-card">
        <div className="completion-content">
          <p className="completion-text">{completion.message}</p>
          <span className="message-timestamp">{completion.timestamp}</span>
        </div>
        <div className="trophy-container">
          <Trophy color="#D97706" size={48} strokeWidth={1.75}/>
        </div>
      </div>
    </div>
  );
}