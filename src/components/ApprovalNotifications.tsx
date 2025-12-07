import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import { Task } from '../types';

interface ApprovalNotificationsProps {
  pendingTasks: Task[];
  currentUser: string;
  onApprove: (taskId: string) => void;
  onRevoke?: (taskId: string) => void;
  onDismiss?: (taskId: string) => void;
}

export const ApprovalNotifications = ({ 
  pendingTasks, 
  currentUser, 
  onApprove,
  onRevoke,
  onDismiss 
}: ApprovalNotificationsProps): JSX.Element => {
  if (pendingTasks.length === 0) return <></>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-teal/20 border-2 border-teal rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Bell className="w-6 h-6 text-teal" />
          </motion.div>
          <h3 className="text-xl font-bold text-cream">
            Pending Approvals ({pendingTasks.length})
          </h3>
        </div>
        
        <AnimatePresence>
          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const hasApproved = task.approvals.includes(currentUser);
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-lg p-4 border border-ash/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-cream">{task.title}</div>
                      <div className="text-sm text-cream/70">
                        Assigned to: <span className="font-medium">{task.currentAssignedTo}</span>
                      </div>
                      <div className="text-xs text-cream/60 mt-1">
                        Approvals: {task.approvals.length}/{task.approvals.length + 1} needed
                      </div>
                      {hasApproved && (
                        <div className="text-xs text-mutedTeal mt-1 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          You have approved this task
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!hasApproved ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onApprove(task.id)}
                          className="bg-mutedTeal hover:bg-mutedTeal/80 text-ink px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRevoke && onRevoke(task.id)}
                          className="bg-ash/50 hover:bg-ash/70 text-cream px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Revoke
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
