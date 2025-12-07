import { useState, useEffect } from 'react';
import { Task, WeeklyHistoryEntry, TaskStatus, DailyTask, DayStatus, ConsensusVote } from '../types';
import { HOUSEMATES } from '../constants';
import { getWeekIdentifier, getWeekNumber, getCurrentAssignedUser, getDayAssignedUser, getDayAssignedRole, formatDate, getDaysInMonth, getWeekNumberForDate } from '../utils';

// Initialize default tasks for each housemate
const initializeTasks = (): Task[] => {
  const weekNumber = getWeekNumber();
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(23, 59, 59, 999);

  return HOUSEMATES.map((person, index) => ({
    id: `task-${person}-${index}`,
    title: `Sunday Reset - ${person}`,
    baseAssignedTo: person,
    currentAssignedTo: getCurrentAssignedUser(person, weekNumber),
    status: 'todo' as TaskStatus,
    approvals: [],
    dueDate: nextSunday.toISOString(),
  }));
};

// Initialize daily tasks for current month
const initializeDailyTasks = (): DailyTask[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = getDaysInMonth(year, month);
  
  return days.map(day => {
    const dayOfWeek = day.getDay();
    const weekNumberForDate = getWeekNumberForDate(day);
    return {
      date: formatDate(day),
      assignedUser: getDayAssignedUser(dayOfWeek),
      role: getDayAssignedRole(dayOfWeek, weekNumberForDate),
      status: 'none' as DayStatus,
      approvals: [],
    };
  });
};

export const useHouseRules = () => {
  const [violations, setViolations] = useState<Record<string, string[]>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [totalFines, setTotalFines] = useState<number>(0);
  const [weeklyHistory, setWeeklyHistory] = useState<WeeklyHistoryEntry[]>([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(getWeekNumber());
  const [consensusVotes, setConsensusVotes] = useState<ConsensusVote[]>([]);

  useEffect(() => {
    const week = getWeekIdentifier();
    const weekNum = getWeekNumber();
    setCurrentWeekNumber(weekNum);
    
    const storedWeek = localStorage.getItem('currentWeek');
    
    if (storedWeek !== week) {
      // New week - save old data to history and reset
      const oldViolations = JSON.parse(localStorage.getItem('violations') || '{}') as Record<string, string[]>;
      const oldTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
      const oldFines = parseInt(localStorage.getItem('totalFines') || '0', 10);
      
      if (storedWeek) {
        const history = JSON.parse(localStorage.getItem('weeklyHistory') || '[]') as WeeklyHistoryEntry[];
        history.unshift({
          week: storedWeek,
          dishes: oldViolations, // Keep for backward compatibility
          tasks: oldTasks,
          fines: oldFines,
          date: new Date().toISOString()
        });
        localStorage.setItem('weeklyHistory', JSON.stringify(history.slice(0, 12)));
      }
      
      // Reset for new week
      const resetViolations: Record<string, string[]> = {};
      HOUSEMATES.forEach(person => {
        resetViolations[person] = [];
      });
      
      const newTasks = initializeTasks();
      const newDailyTasks = initializeDailyTasks();
      
      setViolations(resetViolations);
      setTasks(newTasks);
      setDailyTasks(newDailyTasks);
      setTotalFines(oldFines); // Keep fines accumulated
      
      localStorage.setItem('violations', JSON.stringify(resetViolations));
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      localStorage.setItem('dailyTasks', JSON.stringify(newDailyTasks));
      localStorage.setItem('currentWeek', week);
    } else {
      // Same week - load data
      const loadedViolations = JSON.parse(localStorage.getItem('violations') || localStorage.getItem('dishes') || '{}') as Record<string, string[]>;
      const loadedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
      const loadedDailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]') as DailyTask[];
      const loadedFines = parseInt(localStorage.getItem('totalFines') || '0', 10);
      
      const initViolations: Record<string, string[]> = {};
      HOUSEMATES.forEach(person => {
        initViolations[person] = loadedViolations[person] || [];
      });
      
      // Update task assignments based on current week
      const updatedTasks = loadedTasks.length > 0 
        ? loadedTasks.map(task => ({
            ...task,
            currentAssignedTo: getCurrentAssignedUser(task.baseAssignedTo, weekNum),
          }))
        : initializeTasks();
      
      // Update daily tasks if needed
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const updatedDailyTasks = loadedDailyTasks.length > 0 
        ? loadedDailyTasks.map(dt => {
            const day = new Date(dt.date);
            const dayOfWeek = day.getDay();
            const weekNumberForDate = getWeekNumberForDate(day);
            return {
              ...dt,
              assignedUser: getDayAssignedUser(dayOfWeek),
              role: getDayAssignedRole(dayOfWeek, weekNumberForDate),
              approvals: dt.approvals || [], // Ensure approvals array exists
            };
          })
        : initializeDailyTasks();
      
      setViolations(initViolations);
      setTasks(updatedTasks);
      setDailyTasks(updatedDailyTasks);
      setTotalFines(loadedFines);
    }
    
    setWeeklyHistory(JSON.parse(localStorage.getItem('weeklyHistory') || '[]') as WeeklyHistoryEntry[]);
    setConsensusVotes(JSON.parse(localStorage.getItem('consensusVotes') || '[]') as ConsensusVote[]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 0 && now.getMinutes() === 0) {
        window.location.reload();
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const addViolation = (person: string): void => {
    const newViolations = { ...violations };
    const today = new Date().toLocaleDateString();
    newViolations[person] = [...(newViolations[person] || []), today];
    setViolations(newViolations);
    localStorage.setItem('violations', JSON.stringify(newViolations));
    
    const newTotal = totalFines + 5;
    setTotalFines(newTotal);
    localStorage.setItem('totalFines', newTotal.toString());
  };

  const removeViolation = (person: string, index: number): void => {
    const newViolations = { ...violations };
    if (newViolations[person] && Array.isArray(newViolations[person])) {
      newViolations[person].splice(index, 1);
      setViolations(newViolations);
      localStorage.setItem('violations', JSON.stringify(newViolations));
      
      const newTotal = Math.max(0, totalFines - 5);
      setTotalFines(newTotal);
      localStorage.setItem('totalFines', newTotal.toString());
    }
  };

  const updateDailyTaskStatus = (date: string, status: DayStatus, userId: string): void => {
    // Check if task exists
    const existingTaskIndex = dailyTasks.findIndex(dt => dt.date === date);
    
    if (existingTaskIndex !== -1) {
      // Task exists - update it
      const existingTask = dailyTasks[existingTaskIndex];
      
      // Verify user permission
      if (existingTask.assignedUser !== userId) {
        console.warn(`User ${userId} cannot update task assigned to ${existingTask.assignedUser}`);
        return;
      }
      
      const updated = dailyTasks.map((dt, index) => {
        if (index === existingTaskIndex) {
          // Only allow setting to pending_approval from none state
          if (status === 'pending_approval' && dt.status === 'none') {
            return {
              ...dt,
              status: 'pending_approval' as DayStatus,
              approvals: [],
            };
          }
          return { ...dt, status };
        }
        return dt;
      });
      setDailyTasks(updated);
      localStorage.setItem('dailyTasks', JSON.stringify(updated));
    } else {
      // Task doesn't exist - create it
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error(`Invalid date format: ${date}`);
        return;
      }
      
      const dayOfWeek = dateObj.getDay();
      const weekNumberForDate = getWeekNumberForDate(dateObj);
      const assignedUser = getDayAssignedUser(dayOfWeek);
      const role = getDayAssignedRole(dayOfWeek, weekNumberForDate);
      
      // Only create if the user matches and status is pending_approval
      if (assignedUser === userId && status === 'pending_approval') {
        const newTask: DailyTask = {
          date,
          assignedUser,
          role,
          status: 'pending_approval' as DayStatus,
          approvals: [],
        };
        
        const updated = [...dailyTasks, newTask];
        setDailyTasks(updated);
        localStorage.setItem('dailyTasks', JSON.stringify(updated));
      } else {
        console.warn(`Cannot create task: assignedUser (${assignedUser}) !== userId (${userId}) or status !== pending_approval`);
      }
    }
  };

  const approveDailyTask = (date: string, userId: string): void => {
    const updated = dailyTasks.map(dt => {
      if (dt.date === date && dt.status === 'pending_approval') {
        // Don't add duplicate approvals
        if (dt.approvals.includes(userId)) {
          return dt;
        }
        
        const newApprovals = [...dt.approvals, userId];
        const otherUsers = HOUSEMATES.filter(u => u !== dt.assignedUser);
        const allApproved = otherUsers.every(user => newApprovals.includes(user));
        
        return {
          ...dt,
          approvals: newApprovals,
          status: allApproved ? 'completed' as DayStatus : 'pending_approval' as DayStatus,
        };
      }
      return dt;
    });
    
    setDailyTasks(updated);
    localStorage.setItem('dailyTasks', JSON.stringify(updated));
  };

  const retractDailyTask = (date: string, userId: string): void => {
    const updated = dailyTasks.map(dt => {
      // Allow retraction from both pending_approval and completed states
      if (dt.date === date && dt.assignedUser === userId && (dt.status === 'pending_approval' || dt.status === 'completed')) {
        return {
          ...dt,
          status: 'none' as DayStatus,
          approvals: [],
        };
      }
      return dt;
    });
    
    setDailyTasks(updated);
    localStorage.setItem('dailyTasks', JSON.stringify(updated));
  };

  const markTaskPending = (taskId: string, userId: string): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.status === 'todo' && task.currentAssignedTo === userId) {
        return {
          ...task,
          status: 'pending_approval' as TaskStatus,
          approvals: [],
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const approveTask = (taskId: string, userId: string): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && (task.status === 'pending_approval' || task.status === 'completed')) {
        // Don't add duplicate approvals
        if (task.approvals.includes(userId)) {
          return task;
        }
        
        const newApprovals = [...task.approvals, userId];
        
        // Check if all other users have approved
        const otherUsers = HOUSEMATES.filter(u => u !== task.currentAssignedTo);
        const allApproved = otherUsers.every(user => newApprovals.includes(user));
        
        return {
          ...task,
          approvals: newApprovals,
          status: allApproved ? 'completed' as TaskStatus : 'pending_approval' as TaskStatus,
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const undoTaskSubmission = (taskId: string, userId: string): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.status === 'pending_approval' && task.currentAssignedTo === userId) {
        return {
          ...task,
          status: 'todo' as TaskStatus,
          approvals: [],
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const revokeApproval = (taskId: string, userId: string): void => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.approvals.includes(userId)) {
        const newApprovals = task.approvals.filter(id => id !== userId);
        
        // Check if all other users have approved
        const otherUsers = HOUSEMATES.filter(u => u !== task.currentAssignedTo);
        const allApproved = otherUsers.every(user => newApprovals.includes(user));
        
        // Critical: If task was completed and approval is revoked, MUST demote to pending_approval
        const newStatus = allApproved ? 'completed' as TaskStatus : 'pending_approval' as TaskStatus;
        
        return {
          ...task,
          approvals: newApprovals,
          status: newStatus,
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getPendingApprovals = (userId: string): Task[] => {
    return tasks.filter(
      task => 
        task.currentAssignedTo !== userId &&
        (task.status === 'pending_approval' || 
         (task.status === 'completed' && task.approvals.includes(userId)))
    );
  };

  const getTaskViolations = (userId: string): number => {
    const userTasks = tasks.filter(task => task.currentAssignedTo === userId);
    const incompleteTasks = userTasks.filter(
      task => task.status !== 'completed' && new Date(task.dueDate) < new Date()
    );
    return incompleteTasks.length;
  };

  const initiateConsensusVote = (type: 'system_reset' | 'role_rotation', userId: string): void => {
    const newVote: ConsensusVote = {
      type,
      approvals: [userId],
      initiatedBy: userId,
      initiatedAt: new Date().toISOString(),
    };
    
    const updated = [...consensusVotes.filter(v => v.type !== type), newVote];
    setConsensusVotes(updated);
    localStorage.setItem('consensusVotes', JSON.stringify(updated));
  };

  const approveConsensusVote = (type: 'system_reset' | 'role_rotation', userId: string): boolean => {
    const updated = consensusVotes.map(vote => {
      if (vote.type === type && !vote.approvals.includes(userId)) {
        const newApprovals = [...vote.approvals, userId];
        const allApproved = newApprovals.length === HOUSEMATES.length;
        
        return {
          ...vote,
          approvals: newApprovals,
        };
      }
      return vote;
    });
    
    setConsensusVotes(updated);
    localStorage.setItem('consensusVotes', JSON.stringify(updated));
    
    const vote = updated.find(v => v.type === type);
    if (vote && vote.approvals.length === HOUSEMATES.length) {
      // Execute the action
      if (type === 'system_reset') {
        // Clear all data except credentials
        localStorage.removeItem('violations');
        localStorage.removeItem('dishes');
        localStorage.removeItem('tasks');
        localStorage.removeItem('dailyTasks');
        localStorage.removeItem('totalFines');
        localStorage.removeItem('weeklyHistory');
        localStorage.removeItem('consensusVotes');
        localStorage.removeItem('currentWeek');
        window.location.reload();
      } else if (type === 'role_rotation') {
        // Force role rotation by incrementing week
        const currentWeek = localStorage.getItem('currentWeek') || getWeekIdentifier();
        const weekNum = getWeekNumber() + 1;
        localStorage.setItem('forceWeekNumber', weekNum.toString());
        window.location.reload();
      }
      return true;
    }
    return false;
  };

  const getConsensusVote = (type: 'system_reset' | 'role_rotation'): ConsensusVote | undefined => {
    return consensusVotes.find(v => v.type === type);
  };

  return {
    violations,
    tasks,
    dailyTasks,
    totalFines,
    weeklyHistory,
    currentWeekNumber,
    consensusVotes,
    addViolation,
    removeViolation,
    updateDailyTaskStatus,
    approveDailyTask,
    retractDailyTask,
    markTaskPending,
    approveTask,
    undoTaskSubmission,
    revokeApproval,
    getPendingApprovals,
    getTaskViolations,
    initiateConsensusVote,
    approveConsensusVote,
    getConsensusVote,
  };
};
