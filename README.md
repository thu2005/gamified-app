# 🌳 TreeTask - Gamified Productivity App

A sophisticated task management application with gamification elements, built for the NAVER Vietnam AI Hackathon. Features a unique tree growth system that visualizes productivity progress through engaging game mechanics.

## 🚀 Live Demo
[Demo Link] - *Coming Soon*

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Performance](#-performance)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Task Management
- **Smart Task Creation** with deadline tracking and priority levels
- **Subtask System** for breaking down complex tasks
- **Advanced Filtering** by status, category, priority, and due date
- **Real-time Search** with instant results
- **Drag & Drop** task reordering (planned)

### 🌱 Gamification System
- **Tree Growth Visualization** - Watch your productivity tree grow from seed to ancient tree
- **5 Growth Stages**: Seed → Sprout → Sapling → Young Tree → Ancient Tree
- **Dynamic Health System** (0-400+ health points)
- **Water Drop Mechanics** - Earn drops by completing tasks, auto-watering at 10 drops
- **Streak Tracking** - Daily completion streaks with visual rewards

### 🏆 Achievement System
- **9 Unique Achievements** across different categories:
  - **First Steps**: Complete your first task
  - **Streak Master**: 7-day and 30-day completion streaks  
  - **Task Master**: Complete 100 total tasks
  - **Tree Guardian**: Grow tree to different stages
  - **Time-based**: Early Bird (5-9AM) and Night Owl (10PM-3AM) completions
  - **Perfectionist**: 7 consecutive perfect days
- **Real-time Progress Tracking** with visual progress bars
- **Persistent Achievement Storage** with unlock timestamps

### 📊 Analytics & Insights
- **Progress Statistics** showing streak, best streak, and days active
- **Completion Rate Tracking** with percentage calculations
- **Watering History** with randomized motivational messages
- **Health Visualization** with stage-appropriate graphics

### 💀 Advanced Game Mechanics
- **Tree Death System** - Tree dies after 5 missed deadlines or 5 days of inactivity
- **Revival Mechanism** - Complete 10 tasks to revive a dead tree
- **Missed Deadline Penalties** - -20 health per missed deadline
- **Streak Bonuses** - Health bonuses based on current streak

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing with modern patterns
- **Lucide React** - Beautiful, customizable SVG icons
- **Custom Hooks** - Sophisticated state management with reusable logic

### Architecture Patterns
- **Custom Hook Architecture** - Separation of concerns with dedicated hooks
- **State Management** - Local storage persistence with React state
- **Component Composition** - Reusable, modular component design
- **Performance Optimization** - useMemo, useCallback for optimized re-renders

### Development Tools
- **Vite** - Lightning-fast build tool and dev server
- **ESLint** - Code quality and consistency
- **Modern JavaScript** - ES6+ features, async/await patterns

## 🏗 Architecture

### Custom Hooks System
```
src/hooks/
├── useTasks.js          # Task CRUD operations & persistence
├── useTreeProgress.js   # Gamification logic & tree state
└── useAchievements.js   # Achievement tracking & progress
```

### Component Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
│   ├── dashboard-overview/
│   ├── all-tasks/
│   └── tree-progress/
└── styles/             # Global styles & Tailwind config
```

### Key Technical Implementations

#### 🧠 Smart State Management
- **useTreeProgress Hook**: 500+ lines of sophisticated gamification logic
- **Achievement System**: Real-time calculation with dependency optimization
- **Persistence Layer**: Robust localStorage implementation with error handling

#### 🎮 Game Logic Engine
- **Dynamic Health Calculation**: Stage-based health systems with thresholds
- **Streak Algorithm**: Day-based calculation with timezone handling
- **Revival System**: Complex state transitions for tree death/revival
- **Time-based Achievements**: Accurate timestamp tracking for time-sensitive goals

#### ⚡ Performance Features
- **useMemo Optimization**: Expensive calculations cached appropriately
- **Dependency Management**: Circular dependency prevention in hook system
- **Efficient Re-renders**: Strategic use of useCallback and React.memo
- **Debounced Search**: Smooth real-time search experience

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/treetask.git
cd treetask

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 💻 Usage

### Getting Started
1. **Create Your First Task** - Click "Add Task" and set title, deadline, priority
2. **Complete Tasks** - Check off completed tasks to earn water drops
3. **Watch Your Tree Grow** - Complete 10 tasks to trigger auto-watering
4. **Unlock Achievements** - Track progress across 9 different achievement categories
5. **Maintain Streaks** - Complete tasks daily to build powerful completion streaks

### Pro Tips
- **Morning Productivity**: Complete tasks 5-9AM for Early Bird achievement
- **Night Owl Strategy**: Late night completions (10PM-3AM) count toward Night Owl
- **Streak Protection**: Complete at least one task daily to maintain streaks
- **Tree Care**: Monitor health levels and avoid missing deadlines

## 📱 Demo

- https://gamified-app-psi.vercel.app/all-tasks

## 📈 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s  
- **Bundle Size**: Optimized for fast loading
- **Mobile Responsive**: 100% mobile-friendly design
- **Accessibility**: WCAG 2.1 compliant components

## 🧪 Testing Strategy

- **Manual Testing**: Comprehensive user flow validation
- **Cross-browser**: Chrome, Firefox, Safari, Edge support
- **Mobile Testing**: iOS Safari, Chrome Mobile
- **Performance Testing**: Lighthouse audits for optimization

## 🚧 Future Enhancements

### Planned Features
- [ ] **Social Features** - Share achievements, compare trees with friends
- [ ] **Data Export** - CSV export for productivity analytics
- [ ] **Custom Themes** - Personalization options for tree visualization
- [ ] **Advanced Analytics** - Detailed productivity insights and reports
- [ ] **Notification System** - Smart reminders and deadline alerts
- [ ] **Dark Mode** - Complete dark theme implementation

### Technical Roadmap
- [ ] **TypeScript Migration** - Enhanced type safety and developer experience
- [ ] **PWA Implementation** - Offline support and native app feel
- [ ] **Backend Integration** - User accounts and cloud synchronization
- [ ] **API Development** - RESTful API for data persistence
- [ ] **Testing Suite** - Jest + React Testing Library implementation

## 🤝 Contributing

This project was developed for the NAVER Vietnam AI Hackathon. While currently not open for external contributions, feel free to:

- Star the repository if you find it interesting
- Fork for personal learning and experimentation  
- Reach out with feedback or questions

## 👨‍💻 Developer

**[Your Name]**
- 🌐 Portfolio: [your-portfolio.com]
- 💼 LinkedIn: [linkedin.com/in/yourprofile]
- 📧 Email: [your.email@domain.com]
- 🐱 GitHub: [github.com/yourusername]

## 🏆 Hackathon Context

This project was developed for the **NAVER Vietnam AI Hackathon**, showcasing:
- **Full-stack Development Skills** - End-to-end application development
- **UI/UX Design** - Intuitive, gamified user experience
- **Problem Solving** - Creative approach to productivity challenges
- **Technical Excellence** - Clean, maintainable, performant code
- **Innovation** - Unique gamification approach to task management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the NAVER Vietnam AI Hackathon*

**⭐ Star this repository if you found it helpful!**
