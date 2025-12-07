import { LucideIcon } from 'lucide-react';

export type Page = 'dashboard' | 'violations' | 'thisweek' | 'roles' | 'summary' | 'settings';

export type TaskStatus = 'todo' | 'pending_approval' | 'completed';

export type DayStatus = 'none' | 'pending_approval' | 'completed';

export interface User {
  username: string;
  password: string;
  displayName: string;
}

export interface Task {
  id: string;
  title: string;
  baseAssignedTo: string; // The original owner index/name
  currentAssignedTo: string; // Calculated based on the week
  status: TaskStatus;
  approvals: string[]; // List of User IDs who have approved
  dueDate: string; // ISO date string
}

export interface DailyTask {
  date: string; // ISO date string (YYYY-MM-DD)
  assignedUser: string; // User assigned to this day
  role: string; // Role assigned for this day
  status: DayStatus;
  approvals: string[]; // List of User IDs who have approved this task
}

export interface WeeklyHistoryEntry {
  week: string;
  dishes: Record<string, string[]>;
  tasks: Task[];
  fines: number;
  date: string;
}

export interface Role {
  name: string;
  person?: string;
  people?: string[];
  icon: LucideIcon;
  description: string;
}

export interface ConsensusVote {
  type: 'system_reset' | 'role_rotation';
  approvals: string[]; // User IDs who have approved
  initiatedBy: string; // User who initiated the vote
  initiatedAt: string; // ISO date string
}
