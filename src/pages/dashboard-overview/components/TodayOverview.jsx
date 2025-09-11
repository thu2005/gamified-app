import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TodayOverview = () => {
  const [todayStats, setTodayStats] = useState({
    totalTasks: 7,
    completedTasks: 3,
    percentage: 43
  });

  // Calculate progress percentage
  useEffect(() => {
    const percentage = todayStats?.totalTasks > 0 
      ? Math.round((todayStats?.completedTasks / todayStats?.totalTasks) * 100)
      : 0;
    setTodayStats(prev => ({ ...prev, percentage }));
  }, [todayStats?.completedTasks, todayStats?.totalTasks]);

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-primary';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressBg = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-primary';
    if (percentage >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  // Circular progress calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (todayStats?.percentage / 100) * circumference;

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Today's Overview</h2>
        <Icon name="Calendar" size={20} className="text-muted-foreground" />
      </div>

      <div className="flex items-center justify-center space-x-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={getProgressColor(todayStats?.percentage)}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out',
              }}
            />
          </svg>
          {/* Progress text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getProgressColor(todayStats?.percentage)}`}>
              {todayStats?.percentage}%
            </span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getProgressBg(todayStats?.percentage)}`} />
            <div>
              <p className="text-sm text-muted-foreground">Tasks Due Today</p>
              <p className="text-lg font-semibold text-foreground">{todayStats?.totalTasks}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-success" />
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold text-foreground">{todayStats?.completedTasks}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-foreground">
                {todayStats?.totalTasks - todayStats?.completedTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress message */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">
          {todayStats?.percentage >= 80 
            ? "🎉 Excellent progress! You're crushing today's goals!"
            : todayStats?.percentage >= 60
            ? "💪 Great work! Keep up the momentum!"
            : todayStats?.percentage >= 40
            ? "📈 Good progress! You're on the right track!" :"⚡ Let's get started! Every task completed matters!"
          }
        </p>
      </div>
    </div>
  );
};

export default TodayOverview;