import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Globe, FileText, FolderOpen,
} from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { path: '/admin/content', icon: FileText, label: 'Content' },
  { path: '/admin/subjects', icon: FolderOpen, label: 'Subjects' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { path: '/admin/website', icon: Globe, label: 'Website' },
];

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
