import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import useTreeProgress from '../../hooks/useTreeProgress';
import { useTasks } from '../../hooks/useTasks';
import TreeVisualization from './components/TreeVisualization';
import ProgressStats from './components/ProgressStats';
import WateringHistory from './components/WateringHistory';
import GamificationRules from './components/GamificationRules';
import AchievementBadges from './components/AchievementBadges';

const TreeProgressPage = () => {
  // Get real data from useTreeProgress hook
  const {
    waterDrops,
    streak,
    bestStreak,
    daysActive,
    treeStage,
    treeHealth,
    isDead,
    revivalTasksCount,
    missedDeadlines
  } = useTreeProgress();

  // Get tasks data to calculate completed tasks
  const { tasks } = useTasks();
  const tasksCompleted = tasks.filter(task => task.completed).length;

    console.log('Tree Progress Data:', {
    waterDrops,
    streak,
    bestStreak,
    daysActive,
    treeStage,
    treeHealth,
    isDead,
    revivalTasksCount
  });

  const [isWatering, setIsWatering] = useState(false);
  const [showGrowthAnimation, setShowGrowthAnimation] = useState(false);

  // Use real hook data for progress stats
  const progressStatsData = {
    tasksCompleted: tasksCompleted,
    currentStreak: streak,
    bestStreak: bestStreak,
    daysActive: daysActive
  };

  // Mock data for achievements
  const achievements = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Complete your first task',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      progress: 1,
      target: 1
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      progress: 7,
      target: 7
    },
    {
      id: 'tree-mature',
      title: 'Tree Guardian',
      description: 'Grow your tree to mature stage',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      progress: 1,
      target: 1
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete 100% of daily tasks for a week',
      unlocked: false,
      progress: 5,
      target: 7
    },
    {
      id: 'streak-30',
      title: 'Month Master',
      description: 'Maintain a 30-day streak',
      unlocked: false,
      progress: 8,
      target: 30
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete 50 tasks before 9 AM',
      unlocked: false,
      progress: 23,
      target: 50
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Complete 25 tasks after 10 PM',
      unlocked: false,
      progress: 12,
      target: 25
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 500 total tasks',
      unlocked: false,
      progress: 142,
      target: 500
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tree Progress - TreeTask</title>
        <meta name="description" content="Track your academic progress through gamified tree growth and achievement system" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Tree Progress</h1>
              <p className="text-muted-foreground">
                Watch your academic achievements grow into a beautiful tree through consistent task completion
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Tree Visualization - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <TreeVisualization
                  treeHealth={treeHealth}
                  waterDrops={waterDrops}
                  treeStage={treeStage}
                  isWatering={isWatering}
                  showGrowthAnimation={showGrowthAnimation}
                  isDead={isDead}
                  revivalTasksCount={revivalTasksCount}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                <GamificationRules />
                <WateringHistory history={[]} />
              </div>
            </div>

            {/* Progress Statistics */}
            <div className="mb-8">
              <ProgressStats stats={progressStatsData} />
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <AchievementBadges achievements={achievements} />
            </div>

            {/* Motivational Section */}
            <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-6 border border-primary/20">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Keep Growing! 🌱
                </h2>
                <p className="text-muted-foreground mb-4">
                  You're doing great! Your tree is {treeHealth >= 75 ? 'thriving' : treeHealth >= 50 ? 'growing strong' : 'getting stronger'} with your consistent efforts.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">
                      {Math.max(0, 10 - waterDrops)} more tasks to water your tree
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-muted-foreground">
                      {streak} day streak active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default TreeProgressPage;
