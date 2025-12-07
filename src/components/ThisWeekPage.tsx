import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Check, Lock } from 'lucide-react';
import { DailyTask, DayStatus } from '../types';
import { useUser } from '../context/UserContext';
import { formatDate } from '../utils';
import { useRoleRotation } from '../hooks/useRoleRotation';
import { HOUSEMATES } from '../constants';

interface ThisWeekPageProps {
  dailyTasks: DailyTask[];
  updateDailyTaskStatus: (date: string, status: DayStatus, userId: string) => void;
  approveDailyTask: (date: string, userId: string) => void;
  retractDailyTask: (date: string, userId: string) => void;
  currentWeekNumber: number;
}

export const ThisWeekPage = ({ 
  dailyTasks, 
  updateDailyTaskStatus, 
  approveDailyTask,
  retractDailyTask,
  currentWeekNumber 
}: ThisWeekPageProps): JSX.Element => {
  const { currentUser } = useUser();
  const { roleAssignments } = useRoleRotation();

  if (!currentUser) return <></>;

  const now = new Date();
  const today = formatDate(now);

  // Get the 7 days of the current week (Sunday to Saturday)
  const getCurrentWeekDays = (): Date[] => {
    const days: Date[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Go back to Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getCurrentWeekDays();

  const handleToggleTask = (date: string, assignedUser: string, currentStatus: DayStatus) => {
    if (currentUser === assignedUser) {
      // Toggle logic: if pending_approval or completed, reset to none (retract)
      if (currentStatus === 'pending_approval' || currentStatus === 'completed') {
        retractDailyTask(date, currentUser);
      } else {
        // Otherwise, mark as pending_approval
        updateDailyTaskStatus(date, 'pending_approval', currentUser);
      }
    }
  };

  const handleApprove = (date: string) => {
    if (currentUser) {
      approveDailyTask(date, currentUser);
    }
  };

  const getTaskForDate = (date: string): DailyTask | undefined => {
    return dailyTasks.find(dt => dt.date === date);
  };

  const canUserEdit = (assignedUser: string): boolean => {
    return currentUser === assignedUser;
  };

  const getPendingApprovals = (task: DailyTask | undefined): string[] => {
    return task?.approvals || [];
  };

  const getAllApprovals = (task: DailyTask | undefined): boolean => {
    if (!task || task.status !== 'pending_approval') return false;
    const otherUsers = HOUSEMATES.filter(u => u !== task.assignedUser);
    return task.approvals.length === otherUsers.length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent"
            >
              This Week
            </motion.h2>
            <p className="text-cream/70 mt-1">Weekly schedule and daily tasks</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-cream/60">Week</div>
            <div className="text-lg font-bold text-teal">{currentWeekNumber}</div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Schedule - Vertical Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <h3 className="text-xl font-bold text-cream mb-6">Weekly Schedule</h3>
        <div className="space-y-4 max-w-4xl mx-auto">
          {roleAssignments.map((assignment, index) => {
            const date = weekDays[index];
            const dateStr = formatDate(date);
            const task = getTaskForDate(dateStr);
            const status = task?.status || 'none';
            const isToday = dateStr === today;
            const canEdit = canUserEdit(assignment.user);
            const approvals = getPendingApprovals(task);
            const allApproved = getAllApprovals(task);
            const hasUserApproved = approvals.includes(currentUser || '');
            const otherUsers = HOUSEMATES.filter(u => u !== assignment.user);
            const needsApproval = status === 'pending_approval' && !allApproved;

            return (
              <motion.div
                key={assignment.dayIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className={`relative rounded-xl p-6 border-2 transition-all ${
                  isToday
                    ? 'border-teal bg-teal/20'
                    : status === 'completed'
                    ? 'border-mutedTeal bg-mutedTeal/20'
                    : status === 'pending_approval'
                    ? 'border-yellow-500 bg-yellow-500/20'
                    : 'border-ash/30 bg-card-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side: Day Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`text-2xl font-bold ${
                        isToday ? 'text-teal' : 'text-cream'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-cream">
                          {assignment.dayName}
                        </div>
                        <div className="text-sm text-cream/60">
                          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Fixed User */}
                      <div>
                        <div className="text-xs text-cream/60 mb-1">Assigned User</div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-teal/30 flex items-center justify-center">
                            <span className="text-sm font-bold text-teal">
                              {assignment.user.charAt(0)}
                            </span>
                          </div>
                          <div className="text-base font-semibold text-cream">
                            {assignment.user}
                          </div>
                        </div>
                      </div>

                      {/* Rotating Role */}
                      <div>
                        <div className="text-xs text-cream/60 mb-1">Role</div>
                        <div className="flex items-center gap-2">
                          <assignment.role.icon className="w-5 h-5 text-mutedTeal" />
                          <div className="text-base font-medium text-mutedTeal">
                            {assignment.role.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions & Status */}
                  <div className="flex items-center gap-4">
                    {/* Status Display */}
                    {status === 'none' && canEdit && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleTask(dateStr, assignment.user, status)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-mutedTeal text-ink font-medium rounded-lg transition"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark Done
                      </motion.button>
                    )}

                    {status === 'none' && !canEdit && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-ash/30 text-cream/50 rounded-lg cursor-not-allowed">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm">Only {assignment.user} can mark this</span>
                      </div>
                    )}

                    {(status === 'pending_approval' || status === 'completed') && canEdit && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleTask(dateStr, assignment.user, status)}
                        className="flex items-center gap-2 px-4 py-2 bg-ash/50 hover:bg-ash/70 text-cream font-medium rounded-lg transition"
                      >
                        <Clock className="w-5 h-5" />
                        Retract
                      </motion.button>
                    )}

                    {status === 'pending_approval' && !canEdit && !hasUserApproved && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(dateStr)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-ink font-medium rounded-lg transition"
                      >
                        <Check className="w-5 h-5" />
                        Approve
                      </motion.button>
                    )}

                    {status === 'pending_approval' && !canEdit && hasUserApproved && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-mutedTeal/30 text-mutedTeal rounded-lg">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Approved</span>
                      </div>
                    )}

                    {status === 'completed' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-mutedTeal/30 text-mutedTeal rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}

                    {/* Approval Counter */}
                    {needsApproval && (
                      <div className="text-sm text-cream/70">
                        {approvals.length}/{otherUsers.length} approvals
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval List */}
                {status === 'pending_approval' && approvals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-ash/30">
                    <div className="text-xs text-cream/60 mb-2">Approved by:</div>
                    <div className="flex flex-wrap gap-2">
                      {approvals.map((userId) => (
                        <span
                          key={userId}
                          className="bg-mutedTeal/30 text-cream text-xs px-2 py-1 rounded"
                        >
                          {userId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-mutedTeal" />
            <span className="text-cream/70">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-yellow-500 rounded"></div>
            <span className="text-cream/70">Pending Approval</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-teal rounded"></div>
            <span className="text-cream/70">Today</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
