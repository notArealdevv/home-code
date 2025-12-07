import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, AlertCircle, Settings, Home, Users, BarChart3 } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'thisweek' as Page, label: 'This Week', icon: Calendar },
    { id: 'violations' as Page, label: 'Violation Tracker', icon: AlertCircle },
    { id: 'roles' as Page, label: 'Roles', icon: Users },
    { id: 'summary' as Page, label: 'History', icon: BarChart3 },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        hoverZoneRef.current &&
        !hoverZoneRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-hamburger]')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button - Fixed Top Left */}
      <motion.button
        data-hamburger
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-teal hover:bg-mutedTeal text-ink p-3 rounded-lg shadow-xl transition-colors"
        style={{ zIndex: 60 }}
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Hover Zone - Left Edge */}
      <div
        ref={hoverZoneRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="fixed left-0 top-0 bottom-0 w-4 z-40"
      />

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isHovering) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-30"
            />

            {/* Sidebar Panel - Solid Dark Background with Blur */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="fixed left-0 top-0 bottom-0 w-64 border-r-2 border-ash/50 shadow-2xl z-50 overflow-y-auto backdrop-blur-md"
              style={{ 
                backgroundColor: '#031926',
                backdropFilter: 'blur(10px)',
                zIndex: 50,
              }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent">
                    Navigation
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = currentPage === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-teal text-ink shadow-lg'
                            : 'text-cream/70 hover:text-cream hover:bg-card-hover'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-ink' : 'text-teal'}`} />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
