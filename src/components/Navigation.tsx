import { motion } from 'framer-motion';
import { Calendar, Home, AlertCircle, Users, BarChart3, Settings } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const Navigation = ({ currentPage, setCurrentPage }: NavigationProps): JSX.Element => {
  const tabs = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'violations' as Page, label: 'Violation Tracker', icon: AlertCircle },
    { id: 'thisweek' as Page, label: 'This Week', icon: Calendar },
    { id: 'roles' as Page, label: 'Roles', icon: Users },
    { id: 'summary' as Page, label: 'History', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card border-b border-ash/30 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap ${
                currentPage === tab.id
                  ? 'text-teal'
                  : 'text-cream/70 hover:text-teal'
              }`}
            >
              {currentPage === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal to-mutedTeal"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
