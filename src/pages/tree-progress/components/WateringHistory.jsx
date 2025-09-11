import React from 'react';
import Icon from '../../../components/AppIcon';

const WateringHistory = ({ history }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getWateringIcon = (type) => {
    switch (type) {
      case 'watering': return 'Droplets';
      case 'growth': return 'TrendingUp';
      case 'milestone': return 'Award';
      default: return 'Circle';
    }
  };

  const getWateringColor = (type) => {
    switch (type) {
      case 'watering': return 'var(--color-primary)';
      case 'growth': return 'var(--color-success)';
      case 'milestone': return 'var(--color-warning)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="History" size={20} color="var(--color-foreground)" />
        <h3 className="text-lg font-semibold text-foreground">Watering History</h3>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {history?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Droplets" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No watering history yet</p>
            <p className="text-xs text-muted-foreground mt-1">Complete tasks to start growing your tree!</p>
          </div>
        ) : (
          history?.map((event, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <Icon 
                  name={getWateringIcon(event?.type)} 
                  size={16} 
                  color={getWateringColor(event?.type)} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {event?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event?.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(event?.timestamp)}
                </p>
              </div>
              {event?.drops && (
                <div className="flex items-center space-x-1 text-xs text-primary font-medium">
                  <Icon name="Droplets" size={12} />
                  <span>+{event?.drops}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WateringHistory;