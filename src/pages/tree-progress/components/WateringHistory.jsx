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

  // Fun messages for watering events
  const getWateringMessage = (event) => {
    const baseMessages = [
      "You're such a dedicated gardener! 🌱",
      "Your tree is thriving thanks to your care! 🌿",
      "Another step closer to a mighty tree! 🌳",
      "Your consistency is paying off beautifully! ✨",
      "Look at you, nurturing growth like a pro! 🌟",
      "Your tree feels the love and care! 💚",
      "You're building something amazing, drop by drop! 💧"
    ];

    const streakMessages = [
      "Streak bonus unlocked! You're on fire! 🔥",
      "Your dedication streak is paying off big time! ⚡",
      "Consistency champion! Bonus health earned! 🏆",
      "Your streak game is strong! Extra growth! 💪",
      "Streak power activated! Your tree loves it! ⭐",
      "Bonus health from your amazing streak! 🚀"
    ];

    // Use event ID to generate consistent random index (no more changing messages!)
    const baseIndex = event.id % baseMessages.length;
    const baseMessage = baseMessages[baseIndex];
    
    if (event.streakBonus > 0) {
      const streakIndex = event.id % streakMessages.length;
      const streakMessage = streakMessages[streakIndex];
      return `${baseMessage} ${streakMessage}`;
    }
    
    return baseMessage;
  };

  const getHealthDescription = (event) => {
    if (event.streakBonus > 0) {
      return `+${event.baseHealth} base health + ${event.streakBonus} streak bonus (${event.currentStreak} day streak!)`;
    }
    return `+${event.healthGained} health gained`;
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
            <div key={event.id || index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <Icon 
                  name="Droplets" 
                  size={16} 
                  color="var(--color-primary)" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {getWateringMessage(event)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getHealthDescription(event)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(event.date)}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs text-success font-medium">
                <Icon name="Heart" size={12} />
                <span>+{event.healthGained}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WateringHistory;