import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import './loadingBubbles.css';

export default function LoadingBubble({ text, timestamp }) {
  return (
    <div className="loading-bubble-container fade-in">
      <div className="bot-avatar">
        <Bot size={18}/>
      </div>
      <div className="loading-bubble">
        <div className="loading-spinner">
          <Sparkles size={18}/>
        </div>
        <span className="loading-text">{text}</span>
        {timestamp && <span className="message-timestamp">{timestamp}</span>}
      </div>
    </div>
  );
}