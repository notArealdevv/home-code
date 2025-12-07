import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { getDaysUntilSunday } from '../utils';
import { useUser } from '../context/UserContext';

export const Header = (): JSX.Element => {
  const { currentUser, logout } = useUser();
  const daysUntilReset = getDaysUntilSunday();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-b border-ash/30 shadow-lg ml-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 ml-0">
        <div className="flex items-center justify-between">
          {/* Left side - Empty space (Menu button is in Sidebar component) */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent">
              House Manager
            </h1>
          </div>
          
          {/* Right side - User info and logout */}
          <div className="flex items-center gap-6">
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 bg-card-hover px-4 py-2 rounded-lg border border-ash/30"
              >
                <User className="w-4 h-4 text-teal" />
                <span className="text-sm font-medium text-cream">{currentUser}</span>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-right"
            >
              <div className="text-xs text-cream/70">Resets in</div>
              <motion.div
                key={daysUntilReset}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-teal"
              >
                {daysUntilReset} days
              </motion.div>
            </motion.div>
            {currentUser && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cream hover:text-mutedTeal transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
