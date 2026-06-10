import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Bell, LogOut, LayoutDashboard, BookOpen,
} from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../ui/SearchBar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">
              Edu<span className="text-primary-600">Learn</span>
            </span>
          </Link>

          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                <Link
                  to={dashboardLink}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/subjects" className="block px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                Subjects
              </Link>
              <Link to="/contact" className="block px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                Contact Instructor
              </Link>
              {user && (
                <>
                  <Link to={dashboardLink} className="block px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
