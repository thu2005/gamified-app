import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TreeVisualization = ({ treeHealth, waterDrops, isWatering, showGrowthAnimation }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (showGrowthAnimation) {
      setAnimationClass('tree-animation');
      const timer = setTimeout(() => setAnimationClass(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [showGrowthAnimation]);

  const getTreeStage = () => {
    if (treeHealth >= 90) return { icon: 'TreePine', size: 120, color: '#10B981', stage: 'Flourishing' };
    if (treeHealth >= 75) return { icon: 'TreePine', size: 100, color: '#059669', stage: 'Mature' };
    if (treeHealth >= 60) return { icon: 'Trees', size: 80, color: '#67C090', stage: 'Growing' };
    if (treeHealth >= 40) return { icon: 'Leaf', size: 60, color: '#F59E0B', stage: 'Young' };
    if (treeHealth >= 20) return { icon: 'Sprout', size: 40, color: '#EF4444', stage: 'Struggling' };
    return { icon: 'Sprout', size: 30, color: '#991B1B', stage: 'Dying' };
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
          <h3 className="text-xl font-semibold text-foreground">{tree?.stage} Tree</h3>
          <p className="text-sm text-muted-foreground mt-1">Health: {treeHealth}%</p>
        </div>

        {/* Health Bar */}
        <div className="w-32 bg-border rounded-full h-3 mt-3 overflow-hidden">
          <div 
            className="h-full rounded-full progress-transition"
            style={{ 
              width: `${treeHealth}%`,
              backgroundColor: tree?.color
            }}
          />
        </div>

        {/* Water Drops Counter */}
        <div className="flex items-center space-x-2 mt-4 bg-background rounded-lg px-4 py-2">
          <Icon name="Droplets" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-foreground">
            {waterDrops}/10 drops
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