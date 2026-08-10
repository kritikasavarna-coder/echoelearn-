import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './InputBox.css';

export default function InputBox({ onSendMessage }) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSendMessage(inputVal);
    setInputVal('');
  };

  return (
    <form className="input-box-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="topic-input"
        placeholder="Write your topic..."
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button type="submit" className="ask-button">
        <span>Ask</span>
        <Send size={16}/>
      </button>
    </form>
  );
} 