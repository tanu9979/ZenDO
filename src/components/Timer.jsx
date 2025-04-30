import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

const Timer = ({ onNavigate, theme }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [distractionCount, setDistractionCount] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            const nextMode = mode === 'work' ? 'break' : 'work';
            setMode(nextMode);
            setMinutes(nextMode === 'work' ? 25 : 5);
            setSeconds(0);
            setDistractionCount(0); // Reset distractions on mode change
            playAlarm();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
    setDistractionCount(0); // Reset distractions on reset
  };

  const playAlarm = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Distraction handler
  const handleDistraction = () => {
    if (isActive && mode === 'work') {
      setDistractionCount(count => count + 1);
    }
  };

  return (
    <div className={`timer-container ${theme?.key || ''}`}>
      <button onClick={() => onNavigate('home')} className="back-button">
        ← Back to Home
      </button>
      <h1 className="timer-title">Pomodoro Timer</h1>
      <div className="mode-indicator">
        {mode === 'work' ? '📊 Focus Session' : '🔄 Break Time'}
      </div>
      <div className="timer-display">
        {formatTime(minutes, seconds)}
      </div>

      {/* Distraction Zone - only during work mode and when timer is running */}
      {mode === 'work' && isActive && (
        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={handleDistraction}
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.2)',
              border: `3px solid ${theme?.accent || '#4CAF50'}`,
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
          >
            Hit me<br />When you are distracted
          </button>
          <div style={{ color: theme?.accent || '#4CAF50', fontWeight: 500, fontSize: '1.1rem' }}>
            Distractions: {distractionCount}
          </div>
        </div>
      )}

      <div className="timer-controls">
        <button onClick={toggleTimer} className="control-button">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="control-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;