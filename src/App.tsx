import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Page } from './types';
import { UserProvider, useUser } from './context/UserContext';
import { useHouseRules } from './hooks/useHouseRules';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { ViolationTrackerPage } from './components/ViolationTrackerPage';
import { ThisWeekPage } from './components/ThisWeekPage';
import { RolesPage } from './components/RolesPage';
import { WeeklySummaryPage } from './components/WeeklySummaryPage';
import { SettingsPage } from './components/SettingsPage';

const AppContent = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentUser } = useUser();
  const {
    violations,
    tasks,
    dailyTasks,
    totalFines,
    weeklyHistory,
    currentWeekNumber,
    consensusVotes,
    addViolation,
    removeViolation,
    updateDailyTaskStatus,
    approveDailyTask,
    retractDailyTask,
    markTaskPending,
    approveTask,
    undoTaskSubmission,
    revokeApproval,
    getPendingApprovals,
    getTaskViolations,
    initiateConsensusVote,
    approveConsensusVote,
    getConsensusVote,
  } = useHouseRules();

  // Show login page if no user is logged in
  if (!currentUser) {
    return <LoginPage />;
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-main">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8 ml-0">
        <AnimatePresence mode="wait">
          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DashboardPage 
                violations={violations}
                tasks={tasks}
                totalFines={totalFines}
                currentWeekNumber={currentWeekNumber}
                getTaskViolations={getTaskViolations}
              />
            </motion.div>
          )}
          {currentPage === 'violations' && (
            <motion.div
              key="violations"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ViolationTrackerPage 
                violations={violations}
                addViolation={addViolation}
                removeViolation={removeViolation}
              />
            </motion.div>
          )}
          {currentPage === 'thisweek' && (
            <motion.div
              key="thisweek"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ThisWeekPage 
                dailyTasks={dailyTasks}
                updateDailyTaskStatus={updateDailyTaskStatus}
                approveDailyTask={approveDailyTask}
                retractDailyTask={retractDailyTask}
                currentWeekNumber={currentWeekNumber}
              />
            </motion.div>
          )}
          {currentPage === 'roles' && (
            <motion.div
              key="roles"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RolesPage />
            </motion.div>
          )}
          {currentPage === 'summary' && (
            <motion.div
              key="summary"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WeeklySummaryPage weeklyHistory={weeklyHistory} />
            </motion.div>
          )}
          {currentPage === 'settings' && (
            <motion.div
              key="settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SettingsPage 
                consensusVotes={consensusVotes}
                initiateConsensusVote={initiateConsensusVote}
                approveConsensusVote={approveConsensusVote}
                getConsensusVote={getConsensusVote}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = (): JSX.Element => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
