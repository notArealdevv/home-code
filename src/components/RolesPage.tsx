import { motion } from 'framer-motion';
import { ROLES } from '../constants';
import { useRoleRotation } from '../hooks/useRoleRotation';

export const RolesPage = (): JSX.Element => {
  const { roleAssignments, weekNumber } = useRoleRotation();

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

  // Group role assignments by role name to handle multiple users per role
  const getUsersForRole = (roleName: string): string[] => {
    return roleAssignments
      .filter(assignment => assignment.role.name === roleName)
      .map(assignment => assignment.user);
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
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent"
          >
            Specialized Roles
          </motion.h2>
          <div className="text-right">
            <div className="text-xs text-cream/60">Week</div>
            <div className="text-lg font-bold text-teal">{weekNumber}</div>
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {ROLES.map((role, idx) => {
            // Get all users assigned to this role this week
            const assignedUsers = getUsersForRole(role.name);
            const displayUsers = assignedUsers.length > 0 
              ? assignedUsers.join(', ')
              : (role.person || (role.people ? role.people.join(', ') : 'Unassigned'));
            
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card-hover border-2 border-ash/30 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-teal to-mutedTeal p-3 rounded-lg shadow-lg"
                  >
                    <role.icon className="w-6 h-6 text-ink" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cream mb-1">{role.name}</h3>
                    <p className="text-teal font-semibold mb-3">
                      {displayUsers}
                    </p>
                    <p className="text-cream/80">{role.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
