import { motion } from 'framer-motion';
import { WeeklyHistoryEntry } from '../types';

interface WeeklySummaryPageProps {
  weeklyHistory: WeeklyHistoryEntry[];
}

export const WeeklySummaryPage = ({ weeklyHistory }: WeeklySummaryPageProps): JSX.Element => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent mb-6"
        >
          Weekly History
        </motion.h2>
        {weeklyHistory.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cream/70 text-center py-8"
          >
            No previous weeks recorded yet.
          </motion.p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {weeklyHistory.map((week: WeeklyHistoryEntry, idx: number) => {
              const totalViolations = Object.values(week.dishes).reduce((sum: number, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
              const completedTasks = week.tasks ? week.tasks.filter(t => t.status === 'completed').length : 0;
              const totalTasks = week.tasks ? week.tasks.length : 0;
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-card-hover rounded-xl p-6 border border-ash/30 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-cream">Week {week.week}</h3>
                      <p className="text-sm text-cream/70">{new Date(week.date).toLocaleDateString()}</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: idx * 0.1 }}
                      className="text-right bg-mutedTeal rounded-xl p-4"
                    >
                      <div className="text-2xl font-bold text-ink">${week.fines}</div>
                      <div className="text-sm text-ink/80">Total Fines</div>
                    </motion.div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-semibold text-cream mb-2">Dish Violations ({totalViolations})</div>
                      <div className="space-y-1">
                        {Object.entries(week.dishes).map(([person, violations]) => {
                          const violationsArray = Array.isArray(violations) ? violations : [];
                          return violationsArray.length > 0 ? (
                            <motion.div
                              key={person}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm text-cream/80"
                            >
                              {person}: {violationsArray.length} violation{violationsArray.length > 1 ? 's' : ''}
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-cream mb-2">Sunday Reset Tasks ({completedTasks}/{totalTasks})</div>
                      <div className="space-y-1">
                        {week.tasks && week.tasks.length > 0 ? (
                          week.tasks.map((task) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm"
                            >
                              <span className="text-cream/80">{task.currentAssignedTo}: </span>
                              {task.status === 'completed' ? (
                                <span className="text-mutedTeal font-medium">✓ Completed</span>
                              ) : (
                                <span className="text-teal font-medium">✗ {task.status === 'pending_approval' ? 'Pending Approval' : 'Incomplete'}</span>
                              )}
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-sm text-cream/60">No task data available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
