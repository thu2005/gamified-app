import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TreeVisualization = ({ treeHealth, waterDrops, treeStage, isWatering, showGrowthAnimation, isDead, revivalTasksCount }) => {
  const [animationClass, setAnimationClass] = useState('');

  console.log('TreeVisualization props:', { treeHealth, waterDrops, treeStage, isWatering, showGrowthAnimation });

  useEffect(() => {
    if (showGrowthAnimation) {
      setAnimationClass('scale-105 transition-transform duration-1000');
      setTimeout(() => setAnimationClass(''), 1000);
    }
  }, [showGrowthAnimation]);

  const getTreeStage = () => {
    // If tree is dead, show dead state
    if (isDead) {
      return { 
        icon: 'Skull', 
        size: 40, 
        color: '#7F1D1D', 
        stage: `Dead (${revivalTasksCount || 0}/10 tasks to revive)` 
      };
    }
    
    // Use treeStage from hook with proper icons and colors matching the new stage config
    const stageConfig = {
      'Seed': { icon: 'Sprout', size: 30, color: '#8B5A00' },
      'Sprout': { icon: 'Leaf', size: 50, color: '#65A30D' },
      'Sapling': { icon: 'Trees', size: 70, color: '#16A34A' },
      'Young Tree': { icon: 'TreeDeciduous', size: 90, color: '#059669' },
      'Ancient Tree': { icon: 'TreePine', size: 120, color: '#047857' }
    };
    
    const config = stageConfig[treeStage] || stageConfig['Seed'];
    return { ...config, stage: treeStage };
  };

  const tree = getTreeStage();

  return (
    <div className="flex flex-col items-center justify-center bg-surface rounded-2xl p-8 min-h-96">
      {/* Tree Container */}
      <div className="relative flex flex-col items-center">
        {/* Water Drops Animation */}
        {isWatering && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex space-x-2 animate-bounce">
            {[...Array(3)]?.map((_, i) => (
              <Icon 
                key={i} 
                name="Droplets" 
                size={20} 
                color="var(--color-primary)" 
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}

        {/* Main Tree */}
        <div className={`relative ${animationClass}`}>
          <Icon 
            name={tree?.icon} 
            size={tree?.size} 
            color={tree?.color}
            className="drop-shadow-lg"
          />
          
          {/* Growth Sparkles */}
          {showGrowthAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)]?.map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                >
                  <Icon name="Sparkles" size={12} color="#F59E0B" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tree Stage Label */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-foreground">{tree?.stage}</h3>
          {!isDead && <p className="text-sm text-muted-foreground mt-1">Health: {treeHealth}</p>}
          {isDead && (
            <div className="mt-2">
              <p className="text-sm text-red-600 font-medium">Complete {10 - (revivalTasksCount || 0)} more tasks to revive</p>
              <div className="w-32 bg-red-100 rounded-full h-2 mt-2 mx-auto">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${((revivalTasksCount || 0) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Health Bar - only show if not dead */}
        {!isDead && (
          <div className="w-32 bg-border rounded-full h-3 mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full progress-transition"
              style={{ 
                width: `${treeHealth}%`,
                backgroundColor: tree?.color
              }}
            />
          </div>
        )}

        {/* Water Drops Counter */}
        <div className="flex items-center space-x-2 mt-4 bg-background rounded-lg px-4 py-2">
          <Icon name="Droplets" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-foreground">
            {isDead ? `Revival: ${revivalTasksCount || 0}/10` : `${waterDrops}/10 drops`}
          </span>
        </div>
      </div>
      {/* Tree Care Tips */}
      <div className="mt-6 text-center max-w-md">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete tasks to collect water drops. Every 10 drops waters your tree and helps it grow. 
          Missing deadlines will affect your tree's health.
        </p>
      </div>
    </div>
  );
};

export default TreeVisualization;