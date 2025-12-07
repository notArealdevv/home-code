import { useMemo } from 'react';
import { getWeekNumber } from '../utils';
import { DAY_SCHEDULE, ROTATING_ROLES, getRoleDetails } from '../constants';

export interface RoleAssignment {
  dayIndex: number;
  dayName: string;
  user: string;
  role: {
    name: string;
    icon: any;
    description: string;
  };
}

/**
 * Hook to get role assignments based on current week number
 * Uses circular rotation: CurrentRoleIndex = (UserDayIndex + WeekNumber) % TotalRoles
 */
export const useRoleRotation = () => {
  const weekNumber = getWeekNumber();

  const roleAssignments = useMemo(() => {
    const assignments: RoleAssignment[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const user = DAY_SCHEDULE[dayIndex];
      // Circular rotation: CurrentRoleIndex = (UserDayIndex + WeekNumber) % TotalRoles
      const roleIndex = (dayIndex + weekNumber) % ROTATING_ROLES.length;
      const roleName = ROTATING_ROLES[roleIndex];
      const roleDetails = getRoleDetails(roleName);

      assignments.push({
        dayIndex,
        dayName: dayNames[dayIndex],
        user,
        role: {
          name: roleName,
          icon: roleDetails.icon,
          description: roleDetails.description,
        },
      });
    }

    return assignments;
  }, [weekNumber]);

  // Create a map of role name to assigned user for easy lookup
  const roleToUserMap = useMemo(() => {
    const map: Record<string, string> = {};
    roleAssignments.forEach(assignment => {
      map[assignment.role.name] = assignment.user;
    });
    return map;
  }, [roleAssignments]);

  return {
    roleAssignments,
    roleToUserMap,
    weekNumber,
  };
};
