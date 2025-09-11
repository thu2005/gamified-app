import React from 'react';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import TodayOverview from './components/TodayOverview';
import TodayTasks from './components/TodayTasks';
import QuickAddTask from './components/QuickAddTask';
import MotivationalBlock from './components/MotivationalBlock';
import MiniWidgets from './components/MiniWidgets';

const DashboardOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">
              Your daily productivity hub - stay focused and motivated
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Today's Overview */}
            <div className="lg:col-span-1 space-y-6">
              <TodayOverview />
              <QuickAddTask />
            </div>

            {/* Middle Column - Today's Tasks */}
            <div className="lg:col-span-1 space-y-6">
              <TodayTasks />
              <MotivationalBlock />
            </div>

            {/* Right Column - Mini Widgets */}
            <div className="lg:col-span-1 space-y-6">
              <MiniWidgets />
              
              {/* Additional quick stats */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <h3 className="text-sm font-medium text-foreground mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Week Streak</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-success">89%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-warning">5</div>
                    <div className="text-xs text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-destructive">2</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout Adjustments */}
          <div className="lg:hidden mt-8">
            {/* Mobile-specific bottom content */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Today's Highlights</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Most productive time:</span>
                <span className="font-medium text-foreground">9:00 AM - 11:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default DashboardOverview;