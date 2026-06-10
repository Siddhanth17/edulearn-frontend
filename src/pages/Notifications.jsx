import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificationsAPI } from '../services/api';
import { formatRelativeTime } from '../utils/helpers';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll().then(({ data }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await notificationsAPI.markRead('all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
          {unreadCount > 0 && (
            <span className="text-sm bg-primary-600 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border ${n.isRead ? 'bg-white dark:bg-slate-800' : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {n.link && (
                  <a href={n.link} className="text-sm text-primary-600 hover:underline shrink-0">
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
