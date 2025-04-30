import React, { useState, useEffect } from 'react'
import Timer from './components/Timer'
import Home from './components/Home'
import Settings from './components/Settings'
import Todo from './components/Todo'
import Statistics from './components/Statistics'
import './App.css'
import { themes } from './themes'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [themeKey, setThemeKey] = useState('cyan');

  // Find the current theme object
  const currentTheme = themes.find(t => t.key === themeKey) || themes[0];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeKey');
    if (savedTheme) {
      setThemeKey(savedTheme);
    }
  }, []);

  // Save theme to localStorage, set data-theme attribute, and set CSS variables
  useEffect(() => {
    localStorage.setItem('themeKey', themeKey);
    document.body.setAttribute('data-theme', themeKey);
    // Set CSS variables for the theme
    const root = document.documentElement;
    root.style.setProperty('--theme-background', currentTheme.background);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-text', currentTheme.text);
  }, [themeKey, currentTheme]);

  const handleNavigation = (page, e) => {
    if (e) e.preventDefault();
    setCurrentPage(page);
  };

  const handleThemeChange = (newKey) => {
    setThemeKey(newKey);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home theme={currentTheme} />;
      case 'timer':
        return <Timer onNavigate={handleNavigation} theme={currentTheme} />;
      case 'todo':
        return <Todo theme={currentTheme} />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings theme={currentTheme} themeKey={themeKey} onThemeChange={handleThemeChange} themes={themes} />;
      default:
        return <Home theme={currentTheme} />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <a href="#" onClick={(e) => handleNavigation('home', e)} className="logo">⏱️ Zendo Timer</a>
        <nav className="nav-links">
          <a 
            href="#" 
            onClick={(e) => handleNavigation('timer', e)} 
            className={currentPage === 'timer' ? 'active' : ''}
          >
            Timer
          </a>
          <a 
            href="#" 
            onClick={(e) => handleNavigation('todo', e)} 
            className={currentPage === 'todo' ? 'active' : ''}
          >
            Todo List
          </a>
          <a 
            href="#" 
            onClick={(e) => handleNavigation('statistics', e)} 
            className={currentPage === 'statistics' ? 'active' : ''}
          >
            Statistics
          </a>
          <a 
            href="#" 
            onClick={(e) => handleNavigation('settings', e)} 
            className={currentPage === 'settings' ? 'active' : ''}
          >
            Settings
          </a>
        </nav>
      </header>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
