import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { ApiService } from '../services/api';

export default function AuthPage({
  onAuthSuccess,
  onContinueAsGuest,
  darkMode,
  setDarkMode
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

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
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await ApiService.signup(cleanUser, password);
        setSuccessMsg('Account created! Entering GPAFlow...');
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 600);
      } else {
        const res = await ApiService.login(cleanUser, password);
        setSuccessMsg('Signed in! Welcome back.');
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 400);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-rose-50/40 dark:bg-[#070204] text-slate-900 dark:text-rose-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Dark Maroon ambient atmospheric background glow */}
      <div className="fixed -top-24 -left-24 w-[32rem] h-[32rem] bg-rose-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[32rem] h-[32rem] bg-maroon-900/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 hover:text-rose-600 dark:text-rose-300 dark:hover:text-white bg-white/80 dark:bg-dark-card hover:bg-rose-100 dark:hover:bg-maroon-950 border border-rose-200 dark:border-maroon-900/70 transition-all shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Maroon"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-rose-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-maroon-800 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-rose-300 dark:border-maroon-900 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-maroon-900 via-rose-700 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-950/60 text-white ring-4 ring-rose-500/20">
            <GraduationCap className="w-8 h-8 text-rose-100" />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-rose-800 via-rose-600 to-rose-400 dark:from-rose-200 dark:via-rose-400 dark:to-rose-600 bg-clip-text text-transparent">
              GPAFlow
            </h1>
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-maroon-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-maroon-800">
              PRO
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-rose-300/70 mt-1">
            {mode === 'login' 
              ? 'Sign in to access your private academic records' 
              : 'Create an account to track your GPA and semesters'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-rose-200/80 dark:border-maroon-900/80 bg-rose-50/60 dark:bg-dark-bg/80 rounded-2xl p-1.5 gap-1.5 mb-5">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-maroon-900 to-rose-800 text-white shadow-md border border-rose-700/50'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-maroon-900 to-rose-800 text-white shadow-md border border-rose-700/50'
                : 'text-slate-600 dark:text-rose-300/70 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 text-rose-300" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
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
                placeholder="Enter your username"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/90 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <User className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
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
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/90 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
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
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-dark-bg/90 border border-rose-200 dark:border-maroon-900 text-sm font-semibold text-slate-900 dark:text-rose-100 placeholder-slate-400 dark:placeholder-rose-300/30 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
                <Lock className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-maroon-900 via-rose-800 to-rose-600 hover:from-maroon-800 hover:to-rose-500 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all border border-rose-700/50 disabled:opacity-50 active:scale-98"
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>

          {/* Switch Tab Link */}
          <div className="text-center pt-2">
            <span className="text-xs text-rose-300/70">
              {mode === 'login' ? "New student? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => handleSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in here'}
            </button>
          </div>

          {/* Guest Mode Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-rose-200/60 dark:border-maroon-900/80 w-full" />
            <span className="bg-white dark:bg-dark-card px-3 text-[11px] font-medium text-slate-400 dark:text-rose-300/50 absolute">
              OR
            </span>
          </div>

          {/* Continue as Guest */}
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-100/60 dark:bg-maroon-950/70 hover:bg-rose-200/70 dark:hover:bg-maroon-900 text-rose-800 dark:text-rose-200 border border-rose-300/80 dark:border-maroon-800/80 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Explore Dashboard as Guest</span>
          </button>

        </form>

        {/* Security Feature badges */}
        <div className="mt-6 pt-4 border-t border-rose-200/60 dark:border-maroon-900/60 flex items-center justify-center gap-4 text-[10px] text-rose-300/60">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-rose-400" />
            Bcrypt Hashing
          </span>
          <span>•</span>
          <span>Per-User Isolation</span>
          <span>•</span>
          <span>Private GPA History</span>
        </div>

      </motion.div>

    </div>
  );
}
