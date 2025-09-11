import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ activeTab, hasFilters, onClearFilters, onAddTask }) => {
  const getEmptyStateContent = () => {
    if (hasFilters) {
      return {
        icon: 'Search',
        title: 'No tasks match your filters',
        description: 'Try adjusting your search criteria or clearing filters to see more tasks.',
        action: (
          <Button
            variant="outline"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )
      };
    }

    switch (activeTab) {
      case 'pending':
        return {
          icon: 'Clock',
          title: 'No pending tasks',
          description: 'Great job! You\'ve completed all your pending tasks. Time to add some new ones or take a well-deserved break.',
          action: (
            <Button
              variant="default"
              onClick={onAddTask}
              iconName="Plus"
              iconPosition="left"
            >
              Add New Task
            </Button>
          )
        };
      
      case 'completed':
        return {
          icon: 'CheckCircle',
          title: 'No completed tasks yet',
          description: 'Start completing your tasks to see them here. Every completed task helps your tree grow!',
          action: (
            <Link to="/main-dashboard">
              <Button
                variant="default"
                iconName="Home"
                iconPosition="left"
              >
                Go to Dashboard
              </Button>
            </Link>
          )
        };
      
      default:
        return {
          icon: 'TreePine',
          title: 'No tasks created yet',
          description: 'Start your productivity journey by creating your first task. Watch your tree grow as you complete them!',
          action: (
            <Button
              variant="default"
              onClick={onAddTask}
              iconName="Plus"
              iconPosition="left"
            >
              Create Your First Task
            </Button>
          )
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={48} color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        {content?.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {content?.description}
      </p>
      {content?.action}
    </div>
  );
};

export default EmptyState;