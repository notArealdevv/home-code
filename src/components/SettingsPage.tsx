import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Lock, RotateCcw, RefreshCw, Check, X, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { HOUSEMATES } from '../constants';
import { ConsensusVote } from '../types';

interface SettingsPageProps {
  consensusVotes: ConsensusVote[];
  initiateConsensusVote: (type: 'system_reset' | 'role_rotation', userId: string) => void;
  approveConsensusVote: (type: 'system_reset' | 'role_rotation', userId: string) => boolean;
  getConsensusVote: (type: 'system_reset' | 'role_rotation') => ConsensusVote | undefined;
}

export const SettingsPage = ({ 
  consensusVotes, 
  initiateConsensusVote, 
  approveConsensusVote,
  getConsensusVote 
}: SettingsPageProps): JSX.Element => {
  const { currentUser, changePassword } = useUser();
  const [activeSection, setActiveSection] = useState<'appearance' | 'security' | 'reset' | 'rotation'>('appearance');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const currentUsername = localStorage.getItem('currentUsername') || '';

  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 3) {
      setPasswordError('New password must be at least 3 characters long.');
      return;
    }

    const result = changePassword(currentUsername, passwordForm.currentPassword, passwordForm.newPassword);
    
    if (result.success) {
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      setPasswordError(result.error || 'Failed to change password.');
    }
  };

  const handleInitiateVote = (type: 'system_reset' | 'role_rotation') => {
    if (currentUser) {
      initiateConsensusVote(type, currentUser);
    }
  };

  const handleApproveVote = (type: 'system_reset' | 'role_rotation') => {
    if (currentUser) {
      approveConsensusVote(type, currentUser);
    }
  };

  const resetVote = getConsensusVote('system_reset');
  const rotationVote = getConsensusVote('role_rotation');

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
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-teal" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent">
            Settings
          </h2>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 border-b border-ash/30">
          {[
            { id: 'appearance' as const, label: 'Appearance', icon: Palette },
            { id: 'security' as const, label: 'Security', icon: Lock },
            { id: 'reset' as const, label: 'System Reset', icon: RotateCcw },
            { id: 'rotation' as const, label: 'Role Rotation', icon: RefreshCw },
          ].map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all ${
                activeSection === section.id
                  ? 'text-teal border-b-2 border-teal'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Appearance Section */}
        {activeSection === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-cream mb-4">Color Palette / Theme</h3>
            <div className="flex items-center justify-between bg-card-hover p-4 rounded-lg border border-ash/30">
              <div>
                <div className="font-semibold text-cream">Theme</div>
                <div className="text-sm text-cream/70">Choose between light and dark themes</div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    theme === 'dark'
                      ? 'bg-teal text-ink'
                      : 'bg-card text-cream border border-ash/30'
                  }`}
                >
                  Dark
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    theme === 'light'
                      ? 'bg-teal text-ink'
                      : 'bg-card text-cream border border-ash/30'
                  }`}
                >
                  Light
                </motion.button>
              </div>
            </div>
            <p className="text-sm text-cream/60 italic">
              Note: Theme changes will be applied in a future update.
            </p>
          </motion.div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-cream mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-2 bg-transparent border-2 border-ash rounded-lg text-cream focus:outline-none focus:border-teal"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-2 bg-transparent border-2 border-ash rounded-lg text-cream focus:outline-none focus:border-teal"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-2 bg-transparent border-2 border-ash rounded-lg text-cream focus:outline-none focus:border-teal"
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-ink/50 border border-ash/30 rounded-lg"
                >
                  <AlertTriangle className="w-5 h-5 text-teal" />
                  <p className="text-sm text-cream">{passwordError}</p>
                </motion.div>
              )}
              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-mutedTeal/20 border border-mutedTeal/30 rounded-lg"
                >
                  <Check className="w-5 h-5 text-mutedTeal" />
                  <p className="text-sm text-cream">Password changed successfully!</p>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordChange}
                className="w-full bg-teal hover:bg-mutedTeal text-ink font-semibold py-3 px-4 rounded-lg transition"
              >
                Change Password
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* System Reset Section */}
        {activeSection === 'reset' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-ink/20 border-2 border-ash/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-teal" />
                <h3 className="text-xl font-bold text-cream">Factory Reset</h3>
              </div>
              <p className="text-cream/80 mb-4">
                This will clear all violation history, tasks, and weekly data. Credentials will be preserved.
                Requires unanimous approval from all 7 users.
              </p>
              
              {resetVote ? (
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-ash/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-cream">Vote in Progress</div>
                        <div className="text-sm text-cream/70">
                          Initiated by: {resetVote.initiatedBy} • {new Date(resetVote.initiatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal">{resetVote.approvals.length}/7</div>
                        <div className="text-xs text-cream/70">Approvals</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-cream/70 mb-2">Approved by:</div>
                      <div className="flex flex-wrap gap-2">
                        {HOUSEMATES.map(user => (
                          <div
                            key={user}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              resetVote.approvals.includes(user)
                                ? 'bg-mutedTeal text-ink'
                                : 'bg-card-hover text-cream/50 border border-ash/30'
                            }`}
                          >
                            {user} {resetVote.approvals.includes(user) && <Check className="w-3 h-3 inline ml-1" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    {!resetVote.approvals.includes(currentUser || '') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveVote('system_reset')}
                        className="w-full mt-4 bg-teal hover:bg-mutedTeal text-ink font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Approve Reset
                      </motion.button>
                    )}
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInitiateVote('system_reset')}
                  className="w-full bg-teal hover:bg-mutedTeal text-ink font-semibold py-3 px-4 rounded-lg transition"
                >
                  Initiate Factory Reset Vote
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Role Rotation Section */}
        {activeSection === 'rotation' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-ink/20 border-2 border-ash/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-teal" />
                <h3 className="text-xl font-bold text-cream">Manual Role Rotation</h3>
              </div>
              <p className="text-cream/80 mb-4">
                Manually force roles to rotate to the next week. Requires unanimous approval from all 7 users.
              </p>
              
              {rotationVote ? (
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-ash/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-cream">Vote in Progress</div>
                        <div className="text-sm text-cream/70">
                          Initiated by: {rotationVote.initiatedBy} • {new Date(rotationVote.initiatedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal">{rotationVote.approvals.length}/7</div>
                        <div className="text-xs text-cream/70">Approvals</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-cream/70 mb-2">Approved by:</div>
                      <div className="flex flex-wrap gap-2">
                        {HOUSEMATES.map(user => (
                          <div
                            key={user}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              rotationVote.approvals.includes(user)
                                ? 'bg-mutedTeal text-ink'
                                : 'bg-card-hover text-cream/50 border border-ash/30'
                            }`}
                          >
                            {user} {rotationVote.approvals.includes(user) && <Check className="w-3 h-3 inline ml-1" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    {!rotationVote.approvals.includes(currentUser || '') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveVote('role_rotation')}
                        className="w-full mt-4 bg-teal hover:bg-mutedTeal text-ink font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Approve Rotation
                      </motion.button>
                    )}
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInitiateVote('role_rotation')}
                  className="w-full bg-teal hover:bg-mutedTeal text-ink font-semibold py-3 px-4 rounded-lg transition"
                >
                  Initiate Role Rotation Vote
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

