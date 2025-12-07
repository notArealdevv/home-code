import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Lock, Clock, Users, Undo2, X } from 'lucide-react';
import { Task } from '../types';
import { useUser } from '../context/UserContext';
import { ApprovalNotifications } from './ApprovalNotifications';
import { HOUSEMATES } from '../constants';

interface SundayResetPageProps {
  tasks: Task[];
  markTaskPending: (taskId: string, userId: string) => void;
  approveTask: (taskId: string, userId: string) => void;
  undoTaskSubmission: (taskId: string, userId: string) => void;
  revokeApproval: (taskId: string, userId: string) => void;
  getPendingApprovals: (userId: string) => Task[];
}

export const SundayResetPage = ({ 
  tasks, 
  markTaskPending, 
  approveTask,
  undoTaskSubmission,
  revokeApproval,
  getPendingApprovals 
}: SundayResetPageProps): JSX.Element => {
  const { currentUser } = useUser();

  if (!currentUser) return <></>;

  const handleTaskClick = (task: Task) => {
    if (task.currentAssignedTo === currentUser && task.status === 'todo') {
      markTaskPending(task.id, currentUser);
    }
  };

  const handleApprove = (taskId: string) => {
    if (currentUser) {
      approveTask(taskId, currentUser);
    }
  };

  const handleRevoke = (taskId: string) => {
    if (currentUser) {
      revokeApproval(taskId, currentUser);
    }
  };

  const handleUndoSubmission = (taskId: string) => {
    if (currentUser) {
      undoTaskSubmission(taskId, currentUser);
    }
  };

  const canEdit = (task: Task) => task.currentAssignedTo === currentUser;
  const pendingApprovals = getPendingApprovals(currentUser);

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

  const getStatusBadge = (task: Task) => {
    if (task.status === 'completed') {
      return (
        <div className="flex items-center gap-2 text-mutedTeal">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Completed</span>
        </div>
      );
    }
    if (task.status === 'pending_approval') {
      const otherUsers = HOUSEMATES.filter(u => u !== task.currentAssignedTo);
      const approvalCount = task.approvals.length;
      const totalNeeded = otherUsers.length;
      
      return (
        <div className="flex items-center gap-2 text-teal">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">
            Pending ({approvalCount}/{totalNeeded} approvals)
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-ash">
        <XCircle className="w-5 h-5" />
        <span className="text-sm font-medium">To Do</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Approval Notifications */}
      {pendingApprovals.length > 0 && (
        <ApprovalNotifications
          pendingTasks={pendingApprovals}
          currentUser={currentUser}
          onApprove={handleApprove}
          onRevoke={handleRevoke}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent"
          >
            Sunday Reset Checklist
          </motion.h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-right bg-teal rounded-xl p-4"
          >
            <div className="text-sm text-ink opacity-90">Completed</div>
            <div className="text-4xl font-bold text-ink">
              {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tasks.map((task) => {
            const isEditable = canEdit(task);
            const isOwner = task.currentAssignedTo === currentUser;
            const [isShaking, setIsShaking] = React.useState(false);

            return (
              <motion.div
                key={task.id}
                variants={itemVariants}
                animate={isShaking ? {
                  x: [0, -10, 10, -10, 10, 0],
                  transition: { duration: 0.5 }
                } : 'visible'}
              >
                <div
                  className={`relative w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                    task.status === 'completed'
                      ? 'bg-mutedTeal/30 border-mutedTeal'
                      : task.status === 'pending_approval'
                      ? 'bg-teal/20 border-teal'
                      : 'bg-card border-ash/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-ink ${
                          task.status === 'completed'
                            ? 'bg-mutedTeal'
                            : task.status === 'pending_approval'
                            ? 'bg-teal'
                            : 'bg-ash/50'
                        }`}
                        animate={task.status === 'completed' ? { rotate: 360 } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {task.currentAssignedTo.charAt(0)}
                      </motion.div>
                      <div>
                        <div className="font-bold text-lg text-cream">{task.currentAssignedTo}</div>
                        <div className="text-xs text-cream/60">Base: {task.baseAssignedTo}</div>
                      </div>
                    </div>
                    {!isEditable && task.status !== 'completed' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-ash"
                      >
                        <Lock className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-medium text-cream mb-2">{task.title}</div>
                    {getStatusBadge(task)}
                  </div>

                  {/* Undo Submission Button (for task owner) */}
                  {isOwner && task.status === 'pending_approval' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUndoSubmission(task.id)}
                      className="w-full mt-3 bg-ash/50 hover:bg-ash/70 text-cream px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <Undo2 className="w-4 h-4" />
                      Undo Submission
                    </motion.button>
                  )}

                  {/* Submit Button (for task owner when todo) */}
                  {isOwner && task.status === 'todo' && (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTaskClick(task)}
                      className="w-full mt-3 bg-teal hover:bg-mutedTeal text-ink px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </motion.button>
                  )}

                  {(task.status === 'pending_approval' || task.status === 'completed') && task.approvals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-ash/30">
                      <div className="text-xs text-cream/60 mb-2">Approved by:</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.approvals.map((userId) => (
                          <span
                            key={userId}
                            className="bg-mutedTeal/30 text-cream text-xs px-2 py-1 rounded flex items-center gap-1"
                          >
                            {userId}
                            {userId === currentUser && (
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRevoke(task.id)}
                                className="text-cream hover:text-teal transition-colors"
                                title="Revoke your approval"
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            )}
                          </span>
                        ))}
                      </div>
                      {task.status === 'completed' && task.approvals.includes(currentUser) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRevoke(task.id)}
                          className="w-full mt-2 bg-ash/50 hover:bg-ash/70 text-cream px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2"
                        >
                          <X className="w-3 h-3" />
                          Revoke My Approval
                        </motion.button>
                      )}
                    </div>
                  )}

                  {!isEditable && task.status === 'todo' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-cream/50 italic"
                    >
                      Only {task.currentAssignedTo} can mark this complete
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border-2 border-ash/30 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-cream mb-2">Weekly Cleaning Tasks</h3>
        <p className="text-cream/80 mb-3">Mandatory cleaning and organization for the entire house every Sunday.</p>
        <div className="flex items-center gap-2 text-cream/70 text-sm">
          <Users className="w-4 h-4" />
          <span>Tasks automatically rotate between users each week based on week number.</span>
        </div>
        {currentUser && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-teal font-medium"
          >
            Logged in as: <span className="font-bold">{currentUser}</span>
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};
