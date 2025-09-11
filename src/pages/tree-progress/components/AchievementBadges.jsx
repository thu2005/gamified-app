import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements }) => {
  const badgeTypes = {
    'first-task': { icon: 'Zap', color: 'var(--color-warning)', bg: 'bg-yellow-50' },
    'streak-7': { icon: 'Flame', color: 'var(--color-error)', bg: 'bg-red-50' },
    'streak-30': { icon: 'Fire', color: 'var(--color-destructive)', bg: 'bg-red-100' },
    'tree-mature': { icon: 'TreePine', color: 'var(--color-success)', bg: 'bg-green-50' },
    'perfectionist': { icon: 'Target', color: 'var(--color-primary)', bg: 'bg-green-50' },
    'early-bird': { icon: 'Sun', color: 'var(--color-warning)', bg: 'bg-yellow-50' },
    'night-owl': { icon: 'Moon', color: 'var(--color-secondary)', bg: 'bg-blue-50' },
    'task-master': { icon: 'Crown', color: 'var(--color-warning)', bg: 'bg-yellow-100' }
  };

  const unlockedAchievements = achievements?.filter(a => a?.unlocked);
  const lockedAchievements = achievements?.filter(a => !a?.unlocked);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Award" size={20} color="var(--color-foreground)" />
        <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
        <span className="text-sm text-muted-foreground">
          ({unlockedAchievements?.length}/{achievements?.length})
        </span>
      </div>
      {/* Unlocked Achievements */}
      {unlockedAchievements?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Unlocked</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlockedAchievements?.map((achievement) => {
              const badge = badgeTypes?.[achievement?.id] || badgeTypes?.['first-task'];
              return (
                <div 
                  key={achievement?.id} 
                  className={`${badge?.bg} rounded-lg p-3 border border-border hover-scale cursor-pointer`}
                  title={achievement?.description}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon name={badge?.icon} size={24} color={badge?.color} />
                    <h5 className="text-xs font-medium text-foreground mt-2 leading-tight">
                      {achievement?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.unlockedAt)?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Locked Achievements */}
      {lockedAchievements?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Locked</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {lockedAchievements?.map((achievement) => {
              const badge = badgeTypes?.[achievement?.id] || badgeTypes?.['first-task'];
              return (
                <div 
                  key={achievement?.id} 
                  className="bg-muted/50 rounded-lg p-3 border border-border opacity-60"
                  title={achievement?.description}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon name="Lock" size={24} color="var(--color-muted-foreground)" />
                    <h5 className="text-xs font-medium text-muted-foreground mt-2 leading-tight">
                      {achievement?.title}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement?.progress}/{achievement?.target}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {achievements?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Award" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No achievements yet</p>
          <p className="text-xs text-muted-foreground mt-1">Complete tasks to unlock badges!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;