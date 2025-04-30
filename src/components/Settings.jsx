import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

const Settings = ({ theme, themeKey, onThemeChange, themes }) => {
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      const { workDuration, shortBreakDuration, longBreakDuration } = JSON.parse(savedSettings);
      setSettings({
        workDuration: workDuration || 25,
        shortBreakDuration: shortBreakDuration || 5,
        longBreakDuration: longBreakDuration || 15
      });
    }
  }, []);

  const handleChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('timerSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Timer Settings</h1>
        <p>Customize your focus and break durations</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h2>Theme</h2>
          <div className="theme-grid">
            {themes.map((t) => (
              <button
                key={t.key}
                className={`theme-option${themeKey === t.key ? ' selected' : ''}`}
                style={{ background: t.accent, color: t.text, borderColor: themeKey === t.key ? '#fff' : 'transparent' }}
                onClick={() => onThemeChange(t.key)}
              >
                {themeKey === t.key && <span className="theme-check">✓</span>}
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-section">
          <h2>Timer Durations</h2>
          <div className="setting-item">
            <label htmlFor="workDuration">Work Duration (minutes)</label>
            <input
              type="number"
              id="workDuration"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="shortBreakDuration">Short Break Duration (minutes)</label>
            <input
              type="number"
              id="shortBreakDuration"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label htmlFor="longBreakDuration">Long Break Duration (minutes)</label>
            <input
              type="number"
              id="longBreakDuration"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 