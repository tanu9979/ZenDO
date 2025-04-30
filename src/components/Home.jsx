import React from 'react';
import '../styles/Home.css';

const Home = () => {
  const deepWorkFacts = [
    {
      icon: "🧠",
      title: "What is Deep Work?",
      description: "Deep Work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time."
    },
    {
      icon: "⚡",
      title: "The Power of Focus",
      description: "Just 2-3 hours of deep, focused work can produce more valuable output than an entire day of shallow, distracted work. It's about quality over quantity."
    },
    {
      icon: "📱",
      title: "Digital Minimalism",
      description: "Eliminate distractions like social media, emails, and notifications during deep work sessions. Your brain needs uninterrupted time to reach maximum cognitive performance."
    },
    {
      icon: "🎯",
      title: "The 90-Minute Rule",
      description: "Our brains naturally operate in 90-minute focus cycles. Structure your deep work sessions around these natural rhythms for optimal performance."
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Master Deep Work</h1>
        <p className="subtitle">Unlock your full potential through focused, deliberate practice</p>
      </div>
      <div className="facts-grid">
        {deepWorkFacts.map((fact, index) => (
          <div key={index} className="fact-card">
            <div className="fact-icon">{fact.icon}</div>
            <h3>{fact.title}</h3>
            <p>{fact.description}</p>
          </div>
        ))}
      </div>
      <div className="attribution">
        Based on Cal Newport's groundbreaking book "Deep Work"
      </div>
    </div>
  );
};

export default Home; 