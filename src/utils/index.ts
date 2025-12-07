import { HOUSEMATES, DAY_SCHEDULE, ROTATING_ROLES, getRoleDetails } from '../constants';

export const getWeekIdentifier = (): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
};

export const getWeekNumber = (): number => {
  // Check for forced week number (from manual rotation)
  const forcedWeek = localStorage.getItem('forceWeekNumber');
  if (forcedWeek) {
    localStorage.removeItem('forceWeekNumber');
    return parseInt(forcedWeek, 10);
  }
  
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

/**
 * Get the week number for a specific date
 * @param date - The date to calculate week number for
 * @returns The week number for that date
 */
export const getWeekNumberForDate = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

export const getDaysUntilSunday = (): number => {
  const now = new Date();
  const day = now.getDay();
  return day === 0 ? 7 : 7 - day;
};

/**
 * Calculate which user should be assigned to a task based on round-robin rotation
 * @param taskIndex - The index of the task (0-based)
 * @param weekNumber - The current week number
 * @param totalUsers - Total number of users
 * @returns The index of the assigned user
 */
export const calculateAssignedUser = (taskIndex: number, weekNumber: number, totalUsers: number): number => {
  return (taskIndex + weekNumber) % totalUsers;
};

/**
 * Get the assigned user name for a task based on round-robin
 * @param baseAssignedTo - The base assigned user name
 * @param weekNumber - The current week number
 * @returns The current assigned user name
 */
export const getCurrentAssignedUser = (baseAssignedTo: string, weekNumber: number): string => {
  const baseIndex = HOUSEMATES.findIndex(name => name === baseAssignedTo);
  if (baseIndex === -1) return baseAssignedTo;
  
  const assignedIndex = calculateAssignedUser(baseIndex, weekNumber, HOUSEMATES.length);
  return HOUSEMATES[assignedIndex] || baseAssignedTo;
};

/**
 * Get the user assigned to a specific day of the week
 * @param dayOfWeek - 0 (Sunday) to 6 (Saturday)
 * @returns The assigned user name
 */
export const getDayAssignedUser = (dayOfWeek: number): string => {
  return DAY_SCHEDULE[dayOfWeek] || HOUSEMATES[0];
};

/**
 * Get the role assigned for a specific day based on week rotation
 * Uses circular rotation: TaskIndex = (DayIndex + WeekOffset) % TotalTasks
 * @param dayOfWeek - 0 (Sunday) to 6 (Saturday)
 * @param weekNumber - Week number for the specific date
 * @returns The assigned role name
 */
export const getDayAssignedRole = (dayOfWeek: number, weekNumber: number): string => {
  // Circular rotation: TaskIndex = (DayIndex + WeekOffset) % TotalTasks
  const taskIndex = (dayOfWeek + weekNumber) % ROTATING_ROLES.length;
  return ROTATING_ROLES[taskIndex];
};

/**
 * Format date as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get all days in the current month
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  
  // Add padding days
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add actual month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add end padding
  const endPadding = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};
