import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TreeVisualization = ({ treeHealth, waterDrops, streak }) => {
  const [showWaterAnimation, setShowWaterAnimation] = useState(false);
  const [showGrowthAnimation, setShowGrowthAnimation] = useState(false);

  useEffect(() => {
    const handleTaskComplete = () => {
      setShowWaterAnimation(true);
      setTimeout(() => setShowWaterAnimation(false), 1000);
      
      if (waterDrops % 10 === 0 && waterDrops > 0) {
        setShowGrowthAnimation(true);
        setTimeout(() => setShowGrowthAnimation(false), 2000);
      }
    };

    window.addEventListener('taskCompleted', handleTaskComplete);
    return () => window.removeEventListener('taskCompleted', handleTaskComplete);
  }, [waterDrops]);

  const getTreeStage = () => {
    if (treeHealth >= 90) return { icon: 'TreePine', color: 'var(--color-success)', stage: 'Mature Tree' };
    if (treeHealth >= 70) return { icon: 'Trees', color: 'var(--color-primary)', stage: 'Growing Tree' };
    if (treeHealth >= 50) return { icon: 'Leaf', color: 'var(--color-warning)', stage: 'Young Plant' };
    if (treeHealth >= 20) return { icon: 'Sprout', color: 'var(--color-warning)', stage: 'Seedling' };
    return { icon: 'Seed', color: 'var(--color-error)', stage: 'Seed' };
  };

  const tree = getTreeStage();

  return (
    <div className="bg-surface rounded-lg p-6 text-center space-y-6">
      {/* Tree visualization */}
      <div className="relative">
        <div className={`inline-block transition-all duration-500 ${
          showGrowthAnimation ? 'animate-bounce scale-110' : ''
        }`}>
          <Icon 
            name={tree?.icon} 
            size={80} 
            color={tree?.color}
            className="drop-shadow-lg"
          />
        </div>
        
        {/* Water animation */}
        {showWaterAnimation && (
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Icon name="Droplets" size={24} color="var(--color-primary)" />
          </div>
        )}
        
        {/* Growth sparkles */}
        {showGrowthAnimation && (
          <>
            <div className="absolute -top-2 -left-2 animate-ping">
              <Icon name="Sparkles" size={16} color="var(--color-success)" />
            </div>
            <div className="absolute -bottom-2 -right-2 animate-ping delay-200">
              <Icon name="Sparkles" size={16} color="var(--color-success)" />
            </div>
          </>
        )}
      </div>
      {/* Tree info */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{tree?.stage}</h3>
        <p className="text-sm text-muted-foreground">Health: {treeHealth}</p>
      </div>
      {/* Health bar */}
      <div className="space-y-2">
        <div className="w-full bg-border rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              treeHealth >= 70 ? 'bg-success' : 
              treeHealth >= 40 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${treeHealth}%` }}
          />
        </div>
      </div>
      {/* Water drops counter */}
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Droplets" size={20} color="var(--color-primary)" />
          <span className="text-lg font-semibold text-foreground">{waterDrops}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {10 - (waterDrops % 10)} drops until watering
        </p>
      </div>
      {/* Streak counter */}
      <div className="bg-background rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Flame" size={20} color="var(--color-warning)" />
          <span className="text-lg font-semibold text-warning">{streak}</span>
        </div>
        <p className="text-xs text-muted-foreground">Day streak</p>
      </div>
      {/* Tree care tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        {treeHealth < 50 && (
          <p className="text-warning">⚠️ Complete tasks to improve tree health</p>
        )}
        {waterDrops % 10 === 9 && (
          <p className="text-primary">💧 One more task to water your tree!</p>
        )}
        {streak >= 7 && (
          <p className="text-success">🔥 Amazing streak! Keep it up!</p>
        )}
      </div>
    </div>
  );
};

export default TreeVisualization;