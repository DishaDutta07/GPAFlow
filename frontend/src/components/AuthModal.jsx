import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { ApiService } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login' // 'login' | 'signup'
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validation
    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Please enter a username.');
      return;
    }
    if (cleanUser.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await ApiService.signup(cleanUser, password);
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 800);
      } else {
        const res = await ApiService.login(cleanUser, password);
        setSuccessMsg('Welcome back!');
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 500);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="glass-panel rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden border-t sm:border border-rose-300 dark:border-maroon-900/90 shadow-2xl transition-all"
      >
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1 bg-rose-500/40 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/60 dark:border-maroon-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-maroon-950 text-rose-400 border border-rose-900/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-rose-100">
                {mode === 'login' ? 'Sign In to GPAFlow' : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-300/60">
                {mode === 'login' ? 'Access your private GPA history & settings' : 'Start tracking your degree with personal isolation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-maroon-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-rose-200/60 dark:border-maroon-900/60 bg-rose-50/50 dark:bg-dark-bg/60 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-rose-900 text-rose-100 shadow-sm border border-rose-700/60'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 text-rose-400" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Banner */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AlexMorgan"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <User className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <Lock className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-rose-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'signup' && (
              <span className="text-[10px] text-rose-300/60 mt-1 block">
                Minimum 6 characters (hashed with bcrypt)
              </span>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/80 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <Lock className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all border border-rose-700/50 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Bottom Switch Note */}
          <div className="text-center pt-2">
            <span className="text-xs text-rose-300/70">
              {mode === 'login' ? "Don't have an account yet?" : 'Already registered?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => handleSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              {mode === 'login' ? 'Create one here' : 'Sign in here'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
