import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserPasswords, getUserDisplayName, saveUserPasswords } from '../constants';

interface UserContextType {
  currentUser: string | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (username: string, oldPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (username: string, password: string): { success: boolean; error?: string } => {
    const passwords = getUserPasswords();
    const usernameLower = username.toLowerCase();
    
    if (passwords[usernameLower] === password) {
      const displayName = getUserDisplayName(username);
      setCurrentUser(displayName);
      localStorage.setItem('currentUser', displayName);
      localStorage.setItem('currentUsername', usernameLower);
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Invalid username or password. Please try again.' 
      };
    }
  };

  const changePassword = (username: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    const passwords = getUserPasswords();
    const usernameLower = username.toLowerCase();
    
    if (passwords[usernameLower] !== oldPassword) {
      return { 
        success: false, 
        error: 'Current password is incorrect.' 
      };
    }
    
    if (newPassword.length < 3) {
      return { 
        success: false, 
        error: 'New password must be at least 3 characters long.' 
      };
    }
    
    const updatedPasswords = { ...passwords, [usernameLower]: newPassword };
    saveUserPasswords(updatedPasswords);
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUsername');
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, changePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
