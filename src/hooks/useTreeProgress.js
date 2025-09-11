import { useState, useEffect, useCallback } from 'react';

const useTreeProgress = () => {
  // Tree stages configuration
  const STAGES = [
    { name: 'Seed', icon: 'Sprout', minHealth: 0, maxHealth: 99 },
    { name: 'Sprout', icon: 'Leaf', minHealth: 100, maxHealth: 149 },
    { name: 'Sapling', icon: 'Trees', minHealth: 150, maxHealth: 249 },
    { name: 'Young Tree', icon: 'TreeDeciduous', minHealth: 250, maxHealth: 399 },
    { name: 'Ancient Tree', icon: 'TreePine', minHealth: 400, maxHealth: Infinity }
  ];

  // Constants
  const DROPS_PER_WATERING = 10;
  const HEALTH_PER_WATERING = 10;
  const HEALTH_PER_MISSED_DEADLINE = -20;
  const DROPS_PER_SUBTASK = 0.5;
  const DROPS_PER_SIMPLE_TASK = 1;
  const REVIVAL_TASKS_REQUIRED = 10;
  const DEATH_THRESHOLD_DAYS = 5;
  const DEATH_THRESHOLD_MISSES = 5;

  // Core state
  const [absoluteHealth, setAbsoluteHealth] = useState(() => {
    const saved = localStorage.getItem('treeProgress_absoluteHealth');
    return saved ? parseInt(saved) : 0;
  });

  const [waterDrops, setWaterDrops] = useState(() => {
    const saved = localStorage.getItem('treeProgress_waterDrops');
    return saved ? parseFloat(saved) : 0;
  });

  const [subtaskProgress, setSubtaskProgress] = useState(() => {
    const saved = localStorage.getItem('treeProgress_subtaskProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('treeProgress_streak');
    return saved ? parseInt(saved) : 0;
  });

  const [lastActiveDate, setLastActiveDate] = useState(() => {
    const saved = localStorage.getItem('treeProgress_lastActiveDate');
    return saved ? new Date(saved) : new Date();
  });

  const [missedDeadlines, setMissedDeadlines] = useState(() => {
    const saved = localStorage.getItem('treeProgress_missedDeadlines');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDead, setIsDead] = useState(() => {
    const saved = localStorage.getItem('treeProgress_isDead');
    return saved ? JSON.parse(saved) : false;
  });

  const [revivalTasksCount, setRevivalTasksCount] = useState(() => {
    const saved = localStorage.getItem('treeProgress_revivalTasksCount');
    return saved ? parseInt(saved) : 0;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('treeProgress_absoluteHealth', absoluteHealth.toString());
  }, [absoluteHealth]);

  useEffect(() => {
    localStorage.setItem('treeProgress_waterDrops', waterDrops.toString());
  }, [waterDrops]);

  useEffect(() => {
    localStorage.setItem('treeProgress_subtaskProgress', JSON.stringify(subtaskProgress));
  }, [subtaskProgress]);

  useEffect(() => {
    localStorage.setItem('treeProgress_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('treeProgress_lastActiveDate', lastActiveDate.toISOString());
  }, [lastActiveDate]);

  useEffect(() => {
    localStorage.setItem('treeProgress_missedDeadlines', JSON.stringify(missedDeadlines));
  }, [missedDeadlines]);

  useEffect(() => {
    localStorage.setItem('treeProgress_isDead', JSON.stringify(isDead));
  }, [isDead]);

  useEffect(() => {
    localStorage.setItem('treeProgress_revivalTasksCount', revivalTasksCount.toString());
  }, [revivalTasksCount]);

  // Calculate current stage and health within stage
  const getCurrentStageInfo = useCallback(() => {
    if (isDead) {
      return {
        stageIndex: 0,
        stageName: 'Seed',
        icon: 'Sprout',
        healthInStage: 0,
        maxHealthInStage: 99
      };
    }

    let stageIndex = 0;
    let healthInStage = absoluteHealth;

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      const stageSize = stage.maxHealth === Infinity ? Infinity : (stage.maxHealth - stage.minHealth + 1);
      
      if (stage.maxHealth === Infinity) {
        // Ancient Tree stage - cap health
        const cappedHealth = Math.min(healthInStage, 400);
        return {
          stageIndex: i,
          stageName: stage.name,
          icon: stage.icon,
          healthInStage: cappedHealth,
          maxHealthInStage: 400
        };
      }
      
      if (healthInStage < stageSize) {
        return {
          stageIndex: i,
          stageName: stage.name,
          icon: stage.icon,
          healthInStage: healthInStage,
          maxHealthInStage: stage.maxHealth - stage.minHealth
        };
      }
      
      healthInStage -= stageSize;
      stageIndex = i + 1;
    }

    // Fallback to Ancient Tree
    return {
      stageIndex: STAGES.length - 1,
      stageName: 'Ancient Tree',
      icon: 'TreePine',
      healthInStage: 400,
      maxHealthInStage: 400
    };
  }, [absoluteHealth, isDead]);

  // Update streak based on daily activity
  const updateStreak = useCallback(() => {
    const today = new Date();
    const lastActive = new Date(lastActiveDate);
    
    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day - no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      setStreak(prev => prev + 1);
    } else {
      // Streak broken
      setStreak(1);
    }
    
    setLastActiveDate(today);
  }, [lastActiveDate]);

  // Clean old missed deadlines (only keep last 5 days)
  const cleanOldMissedDeadlines = useCallback(() => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - DEATH_THRESHOLD_DAYS);
    
    setMissedDeadlines(prev => 
      prev.filter(deadline => new Date(deadline.date) > fiveDaysAgo)
    );
  }, []);

  // Check if tree should die
  const checkTreeDeath = useCallback(() => {
    cleanOldMissedDeadlines();
    
    const recentMisses = missedDeadlines.length;
    if (recentMisses >= DEATH_THRESHOLD_MISSES && !isDead) {
      setIsDead(true);
      setAbsoluteHealth(0);
      setRevivalTasksCount(0);
    }
  }, [missedDeadlines, isDead, cleanOldMissedDeadlines]);

  // Add water drops with simple decimal logic
  const addWaterDrops = useCallback((taskId, subtaskCount = 0, isDirectTaskCompletion = false) => {
    if (isDead) return;

    let dropsToAdd = 0;

    if (isDirectTaskCompletion && subtaskCount > 0) {
      // Direct task completion - add drops for uncompleted subtasks only
      const completedSubtasks = subtaskProgress[taskId] || 0;
      const uncompletedSubtasks = subtaskCount - completedSubtasks;
      
      if (uncompletedSubtasks > 0) {
        dropsToAdd = uncompletedSubtasks * DROPS_PER_SUBTASK;
        
        // Update progress to total subtasks
        setSubtaskProgress(prev => ({
          ...prev,
          [taskId]: subtaskCount
        }));
      }
    } else if (subtaskCount === 0) {
      // Simple task without subtasks
      dropsToAdd = DROPS_PER_SIMPLE_TASK;
    } else {
      // Single subtask completion
      dropsToAdd = DROPS_PER_SUBTASK;
      
      // Update subtask progress
      setSubtaskProgress(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || 0) + 1
      }));
    }

    if (dropsToAdd > 0) {
      setWaterDrops(prev => prev + dropsToAdd);
    }
  }, [isDead, subtaskProgress]);

  // Remove water drops with simple decimal logic
  const removeWaterDrops = useCallback((taskId, subtaskCount = 0, isDirectTaskUncompletion = false) => {
    if (isDead) return;

    let dropsToRemove = 0;

    if (isDirectTaskUncompletion && subtaskCount > 0) {
      // Direct task uncompletion - remove drops for all completed subtasks
      const completedSubtasks = subtaskProgress[taskId] || 0;
      dropsToRemove = completedSubtasks * DROPS_PER_SUBTASK;
      
      // Reset subtask progress to 0
      setSubtaskProgress(prev => ({
        ...prev,
        [taskId]: 0
      }));
    } else if (subtaskCount === 0) {
      // Simple task without subtasks
      dropsToRemove = DROPS_PER_SIMPLE_TASK;
    } else {
      // Single subtask uncompletion
      const completedSubtasks = subtaskProgress[taskId] || 0;
      
      if (completedSubtasks > 0) {
        dropsToRemove = DROPS_PER_SUBTASK;
        
        // Decrease subtask progress
        setSubtaskProgress(prev => ({
          ...prev,
          [taskId]: Math.max(0, completedSubtasks - 1)
        }));
      }
    }

    if (dropsToRemove > 0) {
      setWaterDrops(prev => Math.max(0, prev - dropsToRemove));
    }
  }, [isDead, subtaskProgress]);

  // Public API functions
  const completeTask = useCallback((taskId, hasSubtasks = false, subtaskCount = 0) => {
    if (isDead && revivalTasksCount < REVIVAL_TASKS_REQUIRED) {
      const newCount = revivalTasksCount + 1;
      setRevivalTasksCount(newCount);
      
      if (newCount >= REVIVAL_TASKS_REQUIRED) {
        // Auto-revive when reaching 10 tasks
        setIsDead(false);
        setAbsoluteHealth(0);
        setRevivalTasksCount(0);
        setMissedDeadlines([]);
        setStreak(1);
        setLastActiveDate(new Date());
      }
      return;
    }

    updateStreak();
    addWaterDrops(taskId, subtaskCount, hasSubtasks);
  }, [isDead, revivalTasksCount, updateStreak, addWaterDrops]);

  const uncompleteTask = useCallback((taskId, hasSubtasks = false, subtaskCount = 0) => {
    if (isDead) return;
    
    removeWaterDrops(taskId, subtaskCount, hasSubtasks);
  }, [isDead, removeWaterDrops]);

  const completeSubtask = useCallback((taskId, subtaskId) => {
    if (isDead) return;
    
    addWaterDrops(taskId, 1, false);
  }, [isDead, addWaterDrops]);

  const uncompleteSubtask = useCallback((taskId, subtaskId) => {
    if (isDead) return;
    
    removeWaterDrops(taskId, 1, false);
  }, [isDead, removeWaterDrops]);

  const waterTree = useCallback(() => {
    if (waterDrops < DROPS_PER_WATERING || isDead) return false;

    const baseHealth = HEALTH_PER_WATERING;
    const streakBonus = Math.floor(streak * 0.1);
    const totalHealth = baseHealth + streakBonus;

    setWaterDrops(prev => prev - DROPS_PER_WATERING);
    setAbsoluteHealth(prev => prev + totalHealth);

    return true;
  }, [waterDrops, isDead, streak]);

  const missDeadline = useCallback((taskId) => {
    if (isDead) return;

    const now = new Date();
    setMissedDeadlines(prev => [...prev, { taskId, date: now.toISOString() }]);
    setAbsoluteHealth(prev => Math.max(0, prev + HEALTH_PER_MISSED_DEADLINE));
    
    // Check for tree death after adding missed deadline
    setTimeout(checkTreeDeath, 0);
  }, [isDead, checkTreeDeath]);

  const reviveTree = useCallback(() => {
    if (!isDead || revivalTasksCount < REVIVAL_TASKS_REQUIRED) return false;

    setIsDead(false);
    setAbsoluteHealth(0);
    setRevivalTasksCount(0);
    setMissedDeadlines([]);
    setStreak(1);
    setLastActiveDate(new Date());

    return true;
  }, [isDead, revivalTasksCount]);

  const getStageInfo = useCallback(() => {
    const stageInfo = getCurrentStageInfo();
    return {
      stageName: stageInfo.stageName,
      icon: stageInfo.icon,
      maxHealth: stageInfo.maxHealthInStage
    };
  }, [getCurrentStageInfo]);

  // Auto-trigger watering when enough drops
  useEffect(() => {
    if (waterDrops >= DROPS_PER_WATERING && !isDead) {
      const timer = setTimeout(() => {
        waterTree();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [waterDrops, isDead, waterTree]);

  // Clean old missed deadlines on mount and periodically
  useEffect(() => {
    cleanOldMissedDeadlines();
    checkTreeDeath();
  }, [cleanOldMissedDeadlines, checkTreeDeath]);

  const currentStage = getCurrentStageInfo();

  return {
    // State
    treeStage: currentStage.stageName,
    treeHealth: currentStage.healthInStage,
    waterDrops,
    streak,
    missedDeadlines: missedDeadlines.length,
    isDead,
    revivalTasksCount,
    
    // Actions
    completeTask,
    uncompleteTask,
    completeSubtask,
    uncompleteSubtask,
    waterTree,
    missDeadline,
    reviveTree,
    getStageInfo,
    
    // Utilities
    canWater: waterDrops >= DROPS_PER_WATERING && !isDead,
    needsRevival: isDead,
    tasksUntilRevival: isDead ? Math.max(0, REVIVAL_TASKS_REQUIRED - revivalTasksCount) : 0
  };
};

export default useTreeProgress;
