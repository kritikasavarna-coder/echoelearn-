import React, { useState } from 'react';
import Navbar from './components/navbar';
import ChatWindow from './components/ChatWindow';
import { Sparkles } from 'lucide-react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [explanation, setExplanation] = useState(null);
  const [activeRecallPrompt, setActiveRecallPrompt] = useState(null);
  const [userRecall, setUserRecall] = useState(null);
  const [quizPrompt, setQuizPrompt] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const handleSendMessage = async (topicText) => {
    const timestamp = formatTimestamp();
    const newUserMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: topicText,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);
    setErrorMessage('');
    setExplanation(null);
    setActiveRecallPrompt(null);
    setUserRecall(null);
    setQuizPrompt(null);
    setQuiz([]);
    setCompletion(null);

    try {
      const [explainRes, quizRes, recallRes] = await Promise.all([
        fetch(`${API_BASE}/api/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicText }),
        }).then((res) => res.json()),
        fetch(`${API_BASE}/api/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicText }),
        }).then((res) => res.json()),
        fetch(`${API_BASE}/api/recall`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicText }),
        }).then((res) => res.json()),
      ]);

      if (explainRes.status === 'error') {
        throw new Error(explainRes.message || 'Explanation request failed.');
      }
      if (quizRes.status === 'error') {
        throw new Error(quizRes.message || 'Quiz request failed.');
      }
      if (recallRes.status === 'error') {
        throw new Error(recallRes.message || 'Recall request failed.');
      }

      setExplanation({
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        type: 'explanation',
        content: {
          intro: explainRes.summary || 'Here is an explanation of the topic.',
          subheading: explainRes.title || topicText,
          bullets: explainRes.keyPoints || [],
          formula: explainRes.realLifeExample
            ? `Real-life example: ${explainRes.realLifeExample}\nMemory tip: ${explainRes.memoryTip || ''}`
            : explainRes.memoryTip || '',
        },
        timestamp,
      });

      setActiveRecallPrompt({
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        type: 'text',
        text: 'Now try active recall with these questions:',
        timestamp,
      });

      setUserRecall({
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        type: 'text',
        text: (recallRes.questions || []).map((q, index) => `${index + 1}. ${q}`).join('\n'),
        timestamp,
      });

      setQuizPrompt({
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        type: 'text',
        text: 'Here is a quiz to test your understanding:',
        timestamp,
      });

      setQuiz((quizRes.questions || []).map((question, index) => ({
        ...question,
        questionNumber: `${index + 1}/5`,
      })));

      setCompletion({
        id: `completion-${Date.now()}`,
        message: `Great job! You received an explanation, recall questions, and a quiz for ${topicText}.`,
        timestamp,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    console.log('Selected option:', questionId, optionId);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <section className="hero-section fade-in">
          <h1 className="hero-title">
            What do you want to learn today?
            <span className="sparkle-icon">
              <Sparkles size={28} />
            </span>
          </h1>
          <p className="hero-subtitle">Ask anything. Learn deeply. Remember forever.</p>
        </section>

        <ChatWindow
          activeRecallPrompt={activeRecallPrompt}
          completion={completion}
          explanation={explanation}
          messages={messages}
          onAnswerSelect={handleAnswerSelect}
          onSendMessage={handleSendMessage}
          quiz={quiz}
          quizPrompt={quizPrompt}
          userRecall={userRecall}
          loading={loading}
          errorMessage={errorMessage}
        />
      </main>
    </div>
  );
}