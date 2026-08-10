import React from 'react';
import { BookOpen, Home, BarChart2, Clock } from 'lucide-react';
import './navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <a href="#" className="navbar-brand">
        <div className="brand-icon-wrapper">
          <BookOpen size={20} strokeWidth={2.2}/>
        </div>
        <div className="brand-texts">
          <span className="brand-name">EchoLearn</span>
          <span className="brand-tagline">Learn. Explain. Remember.</span>
        </div>
      </a>
      <nav className="navbar-nav">
        <a href="#" className="nav-link active">
          <Home size={17}/>
          <span className="nav-text">Home</span>
        </a>
        <a href="#" className="nav-link">
          <BarChart2 size={17}/>
          <span className="nav-text">Progress</span>
        </a>
        <a href="#" className="nav-link">
          <Clock size={17}/>
          <span className="nav-text">History</span>
        </a>
        <div className="nav-avatar" title="User Profile">K</div>
      </nav>
    </header>
  );
}