import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { path: '/dashboard-overview', label: 'Dashboard', icon: 'Home' },
    { path: '/all-tasks', label: 'All Tasks', icon: 'List' },
    { path: '/tree-progress', label: 'Progress', icon: 'TreePine' },
  ];

  const secondaryNavItems = [
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/help', label: 'Help', icon: 'HelpCircle' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const closeMoreMenu = () => {
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background border-b border-border">
      <div className="flex items-center justify-between h-[62px] px-6">
        {/* Logo */}
        <Link to="/dashboard-overview" className="flex items-center space-x-3 hover-scale">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="TreePine" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">TreeTask</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg nav-transition ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span className="font-medium">{item?.label}</span>
            </Link>
          ))}

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={toggleMoreMenu}
              className="flex items-center space-x-2"
            >
              <Icon name="MoreHorizontal" size={18} />
              <span className="font-medium">More</span>
            </Button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-150"
                  onClick={closeMoreMenu}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg elevated-shadow z-200">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={closeMoreMenu}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground hover:bg-muted nav-transition first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={toggleMoreMenu}
        >
          <Icon name="Menu" size={24} />
        </Button>

        {/* Mobile Menu */}
        {isMoreMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-150 md:hidden"
              onClick={closeMoreMenu}
            />
            <div className="absolute right-6 top-full mt-2 w-56 bg-popover border border-border rounded-lg elevated-shadow z-200 md:hidden">
              <div className="py-2">
                {primaryNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMoreMenu}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm nav-transition ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-popover-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span className="font-medium">{item?.label}</span>
                  </Link>
                ))}
                <div className="border-t border-border my-2" />
                {secondaryNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMoreMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground hover:bg-muted nav-transition"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;<div className="flex items-center justify-between h-15 px-6"></div>

// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import AppIcon from '../AppIcon';

// const Header = () => {
//   const location = useLocation();
  
//   const isActive = (path) => location.pathname === path;

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="flex items-center space-x-2">
//           <AppIcon name="TreePine" className="w-7 h-7 text-green-600" />
//           <h1 className="text-xl font-bold text-gray-900">TreeTask</h1>
//         </div>
//         <nav className="flex space-x-1">
//           <Link
//             to="/dashboard-overview"
//             className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               isActive('/dashboard-overview')
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//             }`}
//           >
//             <AppIcon name="Home" className="w-4 h-4 mr-2" />
//             Dashboard
//           </Link>
//           <Link
//             to="/all-tasks"
//             className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               isActive('/all-tasks') || location.pathname === '/'
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//             }`}
//           >
//             <AppIcon name="ClipboardList" className="w-4 h-4 mr-2" />
//             All Tasks
//           </Link>
//           <Link
//             to="/tree-progress"
//             className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//               isActive('/tree-progress')
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//             }`}
//           >
//             <AppIcon name="TreePine" className="w-4 h-4 mr-2" />
//             Progress
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;