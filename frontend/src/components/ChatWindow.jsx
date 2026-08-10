import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import LoadingBubble from './loadingBubbles';
import QuizCard from './QuizCard';
import CompletionCard from './CompletionCard';
import InputBox from './InputBox';
import './ChatWindow.css';

export default function ChatWindow({
  messages = [],
  explanation,
  activeRecallPrompt,
  userRecall,
  quizPrompt,
  quiz,
  completion,
  loading,
  errorMessage,
  onSendMessage,
  onAnswerSelect
}) {
  const chatScrollRef = useRef(null);

  const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, explanation, userRecall, quiz, completion, loading, errorMessage]);

  return (
    <div className="chat-window">
      <div className="chat-messages-container" ref={chatScrollRef}>
        {messages.map((msg) => {
          if (msg.sender === 'loading') {
            return <LoadingBubble key={msg.id} text={msg.text} timestamp={msg.timestamp}/>;
          }
          return <ChatBubble key={msg.id} message={msg}/>;
        })}

        {errorMessage && (
          <div className="error-bubble">
            <p>{`Error: ${errorMessage}`}</p>
            <span className="message-timestamp">{formatTimestamp()}</span>
          </div>
        )}

        {explanation && <ChatBubble message={explanation}/>}
        {activeRecallPrompt && <ChatBubble message={activeRecallPrompt}/>}
        {userRecall && <ChatBubble message={userRecall}/>}
        {quizPrompt && <ChatBubble message={quizPrompt}/>}
        {Array.isArray(quiz) && quiz.length > 0 &&
          quiz.map((item) => (
            <QuizCard key={item.id} quiz={item} onAnswerSelect={() => onAnswerSelect(item.id)} />
          ))}
        {completion && <CompletionCard completion={completion}/>}
        {loading && (
          <LoadingBubble
            key="loading-status"
            text="Loading AI responses..."
            timestamp={formatTimestamp()}
          />
        )}
      </div>
      <InputBox onSendMessage={onSendMessage}/>
    </div>
  );
}