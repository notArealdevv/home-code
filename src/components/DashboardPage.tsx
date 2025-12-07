import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { HOUSEMATES } from '../constants';
import { getDaysUntilSunday } from '../utils';
import { Task } from '../types';

interface DashboardPageProps {
  violations: Record<string, string[]>;
  tasks: Task[];
  totalFines: number;
  currentWeekNumber: number;
  getTaskViolations: (userId: string) => number;
}

export const DashboardPage = ({ violations, tasks, totalFines, currentWeekNumber, getTaskViolations }: DashboardPageProps): JSX.Element => {
  const daysUntilReset = getDaysUntilSunday();
  const totalViolations = Object.values(violations).reduce((sum: number, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  
  const stats = [
    {
      icon: DollarSign,
      value: `$${totalFines}`,
      label: 'Holiday Fund',
      bgColor: 'bg-mutedTeal',
      textColor: 'text-ink',
    },
    {
      icon: AlertCircle,
      value: totalViolations,
      label: 'Dish Violations',
      bgColor: 'bg-teal',
      textColor: 'text-ink',
    },
    {
      icon: CheckCircle,
      value: `${completedTasks}/${tasks.length}`,
      label: 'Completed Tasks',
      bgColor: 'bg-teal',
      textColor: 'text-ink',
    },
    {
      icon: Clock,
      value: daysUntilReset,
      label: 'Days Until Reset',
      bgColor: 'bg-mutedTeal',
      textColor: 'text-ink',
    },
  ];

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
      {/* Current Week Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-teal" />
            <div>
              <h3 className="text-lg font-bold text-cream">Current Week</h3>
              <p className="text-cream/70">Tasks rotate based on week number</p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="bg-teal rounded-xl px-6 py-3"
          >
            <div className="text-4xl font-bold text-ink">Week {currentWeekNumber}</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5, backgroundColor: '#77ACA2' }}
            className={`${stat.bgColor} ${stat.textColor} rounded-2xl p-6 shadow-xl cursor-pointer`}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <stat.icon className="w-8 h-8 mb-2 opacity-90" />
            </motion.div>
            <motion.div
              key={stat.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold mb-1"
            >
              {stat.value}
            </motion.div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <h3 className="text-xl font-bold text-cream mb-4">This Week's Status</h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-4"
        >
          {HOUSEMATES.map((person, index) => {
            const violationCount = (violations[person] || []).length;
            const taskViolations = getTaskViolations(person);
            const userTasks = tasks.filter(t => t.currentAssignedTo === person);
            const completed = userTasks.filter(t => t.status === 'completed').length;
            const total = userTasks.length;
            
            return (
              <motion.div
                key={person}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center justify-between bg-card-hover p-4 rounded-xl border border-ash/30"
              >
                <div>
                  <div className="font-semibold text-cream">{person}</div>
                  <div className="text-sm text-cream/70 space-y-1">
                    {violationCount > 0 && (
                      <div>
                        <span className="text-teal font-medium">
                          {violationCount} violation{violationCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {taskViolations > 0 && (
                      <div>
                        <span className="text-teal font-medium">
                          {taskViolations} task violation{taskViolations > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {violationCount === 0 && taskViolations === 0 && (
                      <span className="text-mutedTeal font-medium">Clean status</span>
                    )}
                    <div className="text-xs text-cream/60">
                      Tasks: {completed}/{total} completed
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={completed === total && total > 0 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {completed === total && total > 0 ? (
                    <CheckCircle className="w-6 h-6 text-mutedTeal" />
                  ) : (
                    <XCircle className="w-6 h-6 text-ash" />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Rules Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <h3 className="text-xl font-bold text-cream mb-4">House Rules</h3>
        <div className="space-y-3">
          <motion.div
            whileHover={{ x: 5, scale: 1.02 }}
            className="bg-ink/20 border-l-4 border-teal p-4 rounded-lg"
          >
            <div className="font-semibold text-cream">Rule A: Wash Your Own Dishes</div>
            <div className="text-sm text-cream/80 mt-1">$5 fine per missed wash</div>
          </motion.div>
          <motion.div
            whileHover={{ x: 5, scale: 1.02 }}
            className="bg-ink/20 border-l-4 border-teal p-4 rounded-lg"
          >
            <div className="font-semibold text-cream">Rule B: Same Day Food Storage</div>
            <div className="text-sm text-cream/80 mt-1">Portion and store food the same day it's cooked</div>
          </motion.div>
          <motion.div
            whileHover={{ x: 5, scale: 1.02 }}
            className="bg-ink/20 border-l-4 border-mutedTeal p-4 rounded-lg"
          >
            <div className="font-semibold text-cream">Sunday Reset</div>
            <div className="text-sm text-cream/80 mt-1">Mandatory weekly cleaning for everyone. Tasks rotate weekly.</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
