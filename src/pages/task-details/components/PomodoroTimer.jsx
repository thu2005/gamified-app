import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PomodoroTimer = ({ taskTitle }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [backgroundMusic, setBackgroundMusic] = useState('none');
  const intervalRef = useRef(null);

  const sessionOptions = [
    { value: 'work', label: 'Work Session (25 min)' },
    { value: 'short-break', label: 'Short Break (5 min)' },
    { value: 'long-break', label: 'Long Break (15 min)' }
  ];

  const musicOptions = [
    { value: 'none', label: 'No Music' },
    { value: 'nature', label: 'Nature Sounds' },
    { value: 'white-noise', label: 'White Noise' },
    { value: 'lo-fi', label: 'Lo-fi Beats' },
    { value: 'classical', label: 'Classical Music' }
  ];

  const getSessionDuration = (type) => {
    switch (type) {
      case 'work': return 25 * 60;
      case 'short-break': return 5 * 60;
      case 'long-break': return 15 * 60;
      default: return 25 * 60;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(getSessionDuration(sessionType));
  };

  const handleSessionChange = (newSessionType) => {
    setSessionType(newSessionType);
    setTimeLeft(getSessionDuration(newSessionType));
    setIsActive(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsPaused(false);
      
      if (sessionType === 'work') {
        setCompletedSessions(prev => prev + 1);
        // Trigger water drop reward
        window.dispatchEvent(new CustomEvent('taskCompleted'));
      }
      
      // Auto-switch to break after work session
      if (sessionType === 'work') {
        const nextSession = completedSessions > 0 && (completedSessions + 1) % 4 === 0 
          ? 'long-break' :'short-break';
        handleSessionChange(nextSession);
      }
    } else {
      clearInterval(intervalRef?.current);
    }

    return () => clearInterval(intervalRef?.current);
  }, [isActive, timeLeft, sessionType, completedSessions]);

  const progress = ((getSessionDuration(sessionType) - timeLeft) / getSessionDuration(sessionType)) * 100;

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Pomodoro Timer</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Trophy" size={16} />
          <span>{completedSessions} sessions completed</span>
        </div>
      </div>
      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="var(--color-border)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="var(--color-primary)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              className="progress-transition"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{formatTime(timeLeft)}</div>
              <div className="text-xs text-muted-foreground capitalize">{sessionType?.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        {!isActive && !isPaused ? (
          <Button
            variant="default"
            onClick={startTimer}
            iconName="Play"
            iconPosition="left"
            size="lg"
          >
            Start
          </Button>
        ) : isActive ? (
          <Button
            variant="outline"
            onClick={pauseTimer}
            iconName="Pause"
            iconPosition="left"
            size="lg"
          >
            Pause
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={startTimer}
            iconName="Play"
            iconPosition="left"
            size="lg"
          >
            Resume
          </Button>
        )}

        <Button
          variant="outline"
          onClick={resetTimer}
          iconName="RotateCcw"
          size="lg"
        >
          Reset
        </Button>
      </div>
      {/* Session Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          label="Session Type"
          options={sessionOptions}
          value={sessionType}
          onChange={handleSessionChange}
          disabled={isActive}
        />

        <Select
          label="Background Music"
          options={musicOptions}
          value={backgroundMusic}
          onChange={setBackgroundMusic}
        />
      </div>
      {/* Current Task Info */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Target" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-foreground">Working on:</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{taskTitle}</p>
      </div>
      {/* Session Stats */}
      {completedSessions > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{completedSessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-success">
                {Math.floor(completedSessions * 25 / 60)}h {(completedSessions * 25) % 60}m
              </div>
              <div className="text-xs text-muted-foreground">Focus Time</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">
                {Math.floor(completedSessions / 4)}
              </div>
              <div className="text-xs text-muted-foreground">Long Breaks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;