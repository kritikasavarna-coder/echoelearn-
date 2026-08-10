import React, { useState } from 'react';
import { Bot, Edit3 } from 'lucide-react';
import './QuizCard.css';

export default function QuizCard({ quiz, onAnswerSelect }) {
  const [selectedId, setSelectedId] = useState(quiz.correctOptionId);

  const handleSelect = (optionId) => {
    setSelectedId(optionId);
    if (onAnswerSelect) {
      onAnswerSelect(optionId);
    }
  };

  return (
    <div className="quiz-card-row fade-in">
      <div className="bot-avatar">
        <Bot size={18}/>
      </div>
      <div className="quiz-card">
        <div className="quiz-header">
          <Edit3 size={16}/>
          <span>Quiz ({quiz.questionNumber})</span>
        </div>
        <h4 className="quiz-question">{quiz.question}</h4>
        <div className="quiz-options">
          {quiz.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.id)}
              >
                <span className="option-badge">{opt.id}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div className="quiz-footer">
          <span className="message-timestamp">{quiz.timestamp}</span>
        </div>
      </div>
    </div>
  );
}