import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import useTreeProgress from '../../hooks/useTreeProgress';
import useAchievements from '../../hooks/useAchievements';
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
    missedDeadlines,
    wateringHistory
  } = useTreeProgress();

  // Get tasks data to calculate completed tasks
  const { tasks } = useTasks();
  const tasksCompleted = tasks.filter(task => task.completed).length;

  // Get achievements data - pass tasks to avoid circular dependency
  const { achievements } = useAchievements(tasks);

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
                <WateringHistory history={wateringHistory} />
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
