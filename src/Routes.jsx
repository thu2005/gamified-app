import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import TreeProgressPage from './pages/tree-progress';
import TaskDetails from './pages/task-details';
import AllTasks from './pages/all-tasks';
import DashboardOverview from './pages/dashboard-overview';
import TaskTester from './components/TaskTester';
import TreeProgressTest from './pages/TreeProgressTest';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AllTasks />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/tree-progress" element={<TreeProgressPage />} />
        <Route path="/task-details" element={<TaskDetails />} />
        <Route path="/all-tasks" element={<AllTasks />} />
        <Route path="/test-tasks" element={<TaskTester />} />
        <Route path="/test-tree" element={<TreeProgressTest />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;