import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/main-dashboard', label: 'Dashboard', icon: 'Home' },
    { path: '/all-tasks', label: 'Tasks', icon: 'List' },
    { path: '/tree-progress', label: 'Progress', icon: 'TreePine' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-20 px-4">
        {navItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg nav-transition ${
              isActivePath(item?.path)
                ? 'text-primary' :'text-muted-foreground'
            }`}
          >
            <Icon 
              name={item?.icon} 
              size={20} 
              color={isActivePath(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} 
            />
            <span className="text-xs font-medium">{item?.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;