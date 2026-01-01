import React, { useState, useEffect } from 'react';
import { TimerSettings, TimerMode } from './types';
import * as Storage from './services/storageService';
import Timer from './components/Timer';
import MusicPlayer from './components/MusicPlayer';
import TaskList from './components/TaskList';
import QuoteCard from './components/QuoteCard';
import Onboarding from './components/Onboarding';
import { X } from 'lucide-react';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({ focusDuration: 25, breakDuration: 5 });

  useEffect(() => {
    // Check notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Load onboarding state
    if (!Storage.isOnboardingCompleted()) {
      setShowOnboarding(true);
    }

    // Load timer settings
    setTimerSettings(Storage.getTimerSettings());
  }, []);

  const handleOnboardingComplete = () => {
    Storage.completeOnboarding();
    setShowOnboarding(false);
  };

  const handleSettingsSave = (focus: number, breakTime: number) => {
    const newSettings = { focusDuration: focus, breakDuration: breakTime };
    setTimerSettings(newSettings);
    Storage.saveTimerSettings(newSettings);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-background text-gray-200 p-4 md:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Header (Mobile only mainly, or top bar) */}
        <header className="lg:col-span-12 flex justify-between items-center mb-4 lg:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-900" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lo-Fi Study
            </h1>
          </div>
        </header>

        {/* Left Column: Timer & Music */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Timer Card */}
          <div className="bg-surface rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-[400px] flex items-center justify-center relative">
            <Timer 
              settings={timerSettings} 
              onSettingsClick={() => setShowSettings(true)}
              onTimerComplete={() => console.log("Session complete")}
            />
          </div>

          {/* Music Player */}
          <MusicPlayer />
          
          {/* Quote Card (Visible on Desktop here, or stack on mobile) */}
          <QuoteCard />
        </div>

        {/* Right Column: Tasks */}
        <div className="lg:col-span-5 h-[500px] lg:h-auto">
          <TaskList />
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          initialSettings={timerSettings} 
          onClose={() => setShowSettings(false)} 
          onSave={handleSettingsSave} 
        />
      )}

      {/* Onboarding Overlay */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
    </div>
  );
}

const SettingsModal: React.FC<{
  initialSettings: TimerSettings;
  onClose: () => void;
  onSave: (focus: number, breakTime: number) => void;
}> = ({ initialSettings, onClose, onSave }) => {
  const [focus, setFocus] = useState(initialSettings.focusDuration);
  const [breakTime, setBreakTime] = useState(initialSettings.breakDuration);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Timer Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Focus Duration (minutes)</label>
            <input 
              type="range" min="1" max="60" 
              value={focus} onChange={(e) => setFocus(parseInt(e.target.value))}
              className="w-full accent-primary h-1 bg-gray-700 rounded-lg cursor-pointer"
            />
            <div className="text-right text-primary font-bold mt-1">{focus} min</div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Break Duration (minutes)</label>
            <input 
              type="range" min="1" max="30" 
              value={breakTime} onChange={(e) => setBreakTime(parseInt(e.target.value))}
              className="w-full accent-secondary h-1 bg-gray-700 rounded-lg cursor-pointer"
            />
            <div className="text-right text-secondary font-bold mt-1">{breakTime} min</div>
          </div>

          <button 
            onClick={() => onSave(focus, breakTime)}
            className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;