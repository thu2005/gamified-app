import { useState, useEffect, useCallback, useMemo } from 'react';
import useTreeProgress from './useTreeProgress';

const useAchievements = (tasks = []) => {
  // Get data from other hooks
  const { streak, bestStreak, treeStage } = useTreeProgress();

  // Achievement definitions
  const ACHIEVEMENT_DEFINITIONS = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Complete your first task',
      target: 1
    },
    {
      id: 'streak-7',
      title: '7-Day Streak',
      description: 'Maintain a 7-day streak',
      target: 7
    },
    {
      id: 'streak-30',
      title: '30-Day Streak',
      description: 'Maintain a 30-day streak',
      target: 30
    },
    {
      id: 'tree-sapling',
      title: 'Tree Sapling',
      description: 'Grow your tree to Sapling stage',
      target: 1
    },
    {
      id: 'tree-ancient',
      title: 'Ancient Tree',
      description: 'Grow your tree to Ancient Tree stage',
      target: 1
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete 100% of daily tasks for 7 consecutive days',
      target: 7
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete 50 tasks between 5AM and 9AM',
      target: 50
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Complete 50 tasks between 11PM and 3AM',
      target: 50
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 500 total tasks',
      target: 500
    }
  ];

  // Load achievement progress from localStorage
  const [achievementProgress, setAchievementProgress] = useState(() => {
    const saved = localStorage.getItem('achievements_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements_unlocked');
    return saved ? JSON.parse(saved) : {};
  });

  const [perfectDayStreak, setPerfectDayStreak] = useState(() => {
    const saved = localStorage.getItem('achievements_perfectDayStreak');
    return saved ? parseInt(saved) : 0;
  });

  const [lastPerfectDay, setLastPerfectDay] = useState(() => {
    const saved = localStorage.getItem('achievements_lastPerfectDay');
    return saved ? new Date(saved) : null;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('achievements_progress', JSON.stringify(achievementProgress));
  }, [achievementProgress]);

  useEffect(() => {
    localStorage.setItem('achievements_unlocked', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem('achievements_perfectDayStreak', perfectDayStreak.toString());
  }, [perfectDayStreak]);

  useEffect(() => {
    if (lastPerfectDay) {
      localStorage.setItem('achievements_lastPerfectDay', lastPerfectDay.toISOString());
    }
  }, [lastPerfectDay]);

  // Helper function to check if task was completed in time range
  const isTaskCompletedInTimeRange = useCallback((task, startHour, endHour) => {
    if (!task.completed || !task.completedAt) {
      return false;
    }
    
    const completedTime = new Date(task.completedAt);
    const hour = completedTime.getHours();
    
    if (startHour <= endHour) {
      // Normal range (e.g., 5-9)
      return hour >= startHour && hour < endHour;
    } else {
      // Overnight range (e.g., 23-3)
      return hour >= startHour || hour < endHour;
    }
  }, []);

  // Helper function to check if a day was perfect (all tasks completed)
  const checkPerfectDay = useCallback((date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      return taskDate >= dayStart && taskDate <= dayEnd;
    });

    if (dayTasks.length === 0) return false;
    return dayTasks.every(task => task.completed);
  }, [tasks]);

  // Calculate achievements when dependencies change
  const calculatedAchievements = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const totalCompleted = completedTasks.length;

    // Count time-based completions
    const earlyBirdTasks = completedTasks.filter(task => 
      isTaskCompletedInTimeRange(task, 5, 9)
    ).length;

    const nightOwlTasks = completedTasks.filter(task => 
      isTaskCompletedInTimeRange(task, 22, 3) // 10PM to 3AM
    ).length;

    // Calculate progress for each achievement
    const progressData = {};
    
    ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
      let progress = 0;

      switch (achievement.id) {
        case 'first-task':
          progress = Math.min(totalCompleted, achievement.target);
          break;
        case 'streak-7':
          progress = Math.min(bestStreak, achievement.target);
          break;
        case 'streak-30':
          progress = Math.min(bestStreak, achievement.target);
          break;
        case 'task-master':
          progress = Math.min(totalCompleted, achievement.target);
          break;
        case 'tree-sapling':
          progress = treeStage >= 2 ? 1 : 0; // Sapling is stage 2
          break;
        case 'tree-ancient':
          progress = treeStage >= 5 ? 1 : 0; // Ancient is stage 5
          break;
        case 'perfectionist':
          progress = Math.min(perfectDayStreak, achievement.target);
          break;
        case 'early-bird':
          progress = Math.min(earlyBirdTasks, achievement.target);
          break;
        case 'night-owl':
          progress = Math.min(nightOwlTasks, achievement.target);
          break;
        default:
          progress = 0;
      }

      progressData[achievement.id] = progress;
    });

    return progressData;
  }, [tasks, bestStreak, treeStage, perfectDayStreak, isTaskCompletedInTimeRange]);

  // Update achievement progress when calculated achievements change
  useEffect(() => {
    setAchievementProgress(prev => {
      const hasChanges = Object.keys(calculatedAchievements).some(
        key => prev[key] !== calculatedAchievements[key]
      );
      return hasChanges ? calculatedAchievements : prev;
    });

    // Check for newly unlocked achievements
    setUnlockedAchievements(prev => {
      const newUnlocked = { ...prev };
      let hasChanges = false;

      ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
        const progress = calculatedAchievements[achievement.id] || 0;
        const currentUnlocked = prev[achievement.id];

        if (!currentUnlocked?.unlocked && progress >= achievement.target) {
          newUnlocked[achievement.id] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          hasChanges = true;
        }
      });

      return hasChanges ? newUnlocked : prev;
    });
  }, [calculatedAchievements]);

  // Reset all achievements
  const resetAchievements = useCallback(() => {
    setAchievementProgress({});
    setUnlockedAchievements({});
    setPerfectDayStreak(0);
    setLastPerfectDay(null);
    localStorage.removeItem('achievements_progress');
    localStorage.removeItem('achievements_unlocked');
    localStorage.removeItem('achievements_perfectDayStreak');
    localStorage.removeItem('achievements_lastPerfectDay');
  }, []);

  // Format achievements for component consumption
  const achievements = ACHIEVEMENT_DEFINITIONS.map(def => {
    const progress = calculatedAchievements[def.id] || 0;
    const unlockedData = unlockedAchievements[def.id];
    
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      unlocked: unlockedData?.unlocked || false,
      unlockedAt: unlockedData?.unlockedAt || null,
      progress: progress,
      target: def.target
    };
  });

  return {
    achievements,
    resetAchievements
  };
};

export default useAchievements;