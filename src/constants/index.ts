import { ShoppingCart, Trash2, Droplet } from 'lucide-react';
import { Role } from '../types';

export const HOUSEMATES = ['Shreyan', 'Biraj', 'Nhoojah', 'Sandarva', 'Prakash', 'Aaditya', 'Shreyak'] as const;

// Fixed day-to-user schedule
export const DAY_SCHEDULE: Record<number, string> = {
  0: 'Shreyan',   // Sunday
  1: 'Sandarva',  // Monday
  2: 'Aaditya',   // Tuesday
  3: 'Nhoojah',   // Wednesday
  4: 'Biraj',     // Thursday
  5: 'Prakash',   // Friday
  6: 'Shreyak',   // Saturday
};

// Variable roles that rotate weekly - 7 roles total (3 Trash Team + 4 individual)
// Interleaved pattern ensures Trash Team slots are never consecutive
export const ROTATING_ROLES = [
  'Trash Team',               // Index 0 (e.g., Sunday)
  'Fridge & Stock',           // Index 1 (Gap)
  'Trash Team',               // Index 2 (e.g., Tuesday)
  'Grocery Logistics',        // Index 3 (Gap)
  'Trash Team',               // Index 4 (e.g., Thursday)
  'Toilet Duty - 2nd Floor',  // Index 5 (Gap)
  'Toilet Duty - Bottom Floor'// Index 6 (Gap)
];

// User credentials stored as HashMap/Object
// Keys are usernames (lowercase), values are passwords
export const getUserPasswords = (): Record<string, string> => {
  const stored = localStorage.getItem('userPasswords');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default passwords
  return {
    'shreyan': 'shreyan123',
    'biraj': 'biraj123',
    'nhoojah': 'nhoojah123',
    'sandarva': 'sandarva123',
    'prakash': 'prakash123',
    'aaditya': 'aaditya123',
    'shreyak': 'shreyak123',
  };
};

export const saveUserPasswords = (passwords: Record<string, string>): void => {
  localStorage.setItem('userPasswords', JSON.stringify(passwords));
};

export const getUserDisplayName = (username: string): string => {
  const displayNames: Record<string, string> = {
    'shreyan': 'Shreyan',
    'biraj': 'Biraj',
    'nhoojah': 'Nhoojah',
    'sandarva': 'Sandarva',
    'prakash': 'Prakash',
    'aaditya': 'Aaditya',
    'shreyak': 'Shreyak',
  };
  return displayNames[username.toLowerCase()] || username;
};

// Role definitions with icons and descriptions
// Note: These are used for display purposes
export const ROLES: Role[] = [
  { 
    name: 'Fridge & Stock', 
    person: 'Shreyan', 
    icon: ShoppingCart, 
    description: 'Dish soap refills, fridge basics, and grocery essentials list' 
  },
  { 
    name: 'Grocery Logistics', 
    person: 'Biraj', 
    icon: ShoppingCart, 
    description: 'Handles weekly ordering and restocking' 
  },
  { 
    name: 'Trash Team', 
    people: ['Nhoojah', 'Sandarva', 'Prakash'], 
    icon: Trash2, 
    description: 'All house trash, including bathrooms' 
  },
  { 
    name: 'Toilet Duty - 2nd Floor', 
    person: 'Aaditya', 
    icon: Droplet, 
    description: '2nd Floor bathroom' 
  },
  { 
    name: 'Toilet Duty - Bottom Floor', 
    person: 'Shreyak', 
    icon: Droplet, 
    description: 'Bottom Floor bathroom' 
  }
];

// Helper function to get role icon and description from role name
export const getRoleDetails = (roleName: string): { icon: any; description: string } => {
  const role = ROLES.find(r => r.name === roleName);
  if (role) {
    return {
      icon: role.icon,
      description: role.description,
    };
  }
  // Default fallback
  return {
    icon: Trash2,
    description: 'Household task',
  };
};
