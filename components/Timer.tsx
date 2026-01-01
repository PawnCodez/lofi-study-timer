import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { TimerMode, TimerSettings } from '../types';

interface TimerProps {
  settings: TimerSettings;
  onSettingsClick: () => void;
  onTimerComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ settings, onSettingsClick, onTimerComplete }) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(settings.focusDuration * 60);

  // Audio for completion (simple beep logic or reference to an asset)
  const notificationAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset timer when settings change
    if (mode === TimerMode.FOCUS) {
      setInitialTime(settings.focusDuration * 60);
      setTimeLeft(prev => isActive ? prev : settings.focusDuration * 60);
    } else {
      setInitialTime(settings.breakDuration * 60);
      setTimeLeft(prev => isActive ? prev : settings.breakDuration * 60);
    }
  }, [settings, mode, isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    onTimerComplete();
    
    // Play notification sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.error("Audio play failed", e));

    if (Notification.permission === 'granted') {
      new Notification("Timer Complete", {
        body: `${mode === TimerMode.FOCUS ? "Focus session" : "Break"} finished!`,
      });
    }

    // Auto-switch mode
    if (mode === TimerMode.FOCUS) {
      setMode(TimerMode.BREAK);
      const newTime = settings.breakDuration * 60;
      setInitialTime(newTime);
      setTimeLeft(newTime);
    } else {
      setMode(TimerMode.FOCUS);
      const newTime = settings.focusDuration * 60;
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress for circular SVG
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / initialTime;
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className={`absolute w-64 h-64 rounded-full blur-[60px] opacity-20 transition-colors duration-1000 ${isActive ? (mode === TimerMode.FOCUS ? 'bg-primary' : 'bg-secondary') : 'bg-transparent'}`}></div>

      <div className="relative mb-8">
        {/* SVG Ring */}
        <svg className="transform -rotate-90 w-72 h-72">
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-800"
          />
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${mode === TimerMode.FOCUS ? 'text-primary' : 'text-secondary'}`}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-6xl font-bold text-white tabular-nums tracking-tighter font-sans">
            {formatTime(timeLeft)}
          </p>
          <p className={`mt-2 text-sm font-medium tracking-widest uppercase ${mode === TimerMode.FOCUS ? 'text-primary' : 'text-secondary'}`}>
            {mode === TimerMode.FOCUS ? 'Focus Time' : 'Break Time'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={onSettingsClick}
          className="p-4 rounded-full bg-surface text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={toggleTimer}
          className={`p-6 rounded-full text-gray-900 transition-all transform active:scale-95 shadow-lg ${mode === TimerMode.FOCUS ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-surface text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default Timer;