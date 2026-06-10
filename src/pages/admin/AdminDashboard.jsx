import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, FileText, FolderOpen, MessageSquare, Activity,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { adminAPI } from '../../services/api';
import Loading from '../../components/ui/Loading';
import Card from '../../components/ui/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => {
      setStats(data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!stats) return <div className="p-8 text-center text-slate-500">Failed to load stats</div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Verified Users', value: stats.verifiedUsers, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Total Notes', value: stats.totalNotes, icon: FileText, color: 'bg-purple-500' },
    { label: 'Total Chapters', value: stats.totalChapters, icon: FolderOpen, color: 'bg-amber-500' },
    { label: 'Total Comments', value: stats.totalComments, icon: MessageSquare, color: 'bg-pink-500' },
    { label: 'Daily Active', value: stats.dailyActiveUsers, icon: Activity, color: 'bg-indigo-500' },
    { label: 'Weekly Active', value: stats.weeklyActiveUsers, icon: Activity, color: 'bg-cyan-500' },
    { label: 'Monthly Active', value: stats.monthlyActiveUsers, icon: Activity, color: 'bg-teal-500' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="newUsers" stroke="#3B82F6" strokeWidth={2} name="New Users" />
              <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Platform Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="noteViews" fill="#8B5CF6" name="Note Views" />
              <Bar dataKey="searches" fill="#F59E0B" name="Searches" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Most Viewed Notes</h3>
          <div className="space-y-3">
            {stats.mostViewedNotes?.map((note, i) => (
              <div key={note._id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-400 w-6">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{note.title}</p>
                    <p className="text-xs text-slate-400">{note.subject?.name}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{note.viewCount} views</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Searched Topics</h3>
          <div className="space-y-3">
            {stats.topSearches?.map((search, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm font-medium">{search.query}</span>
                <span className="text-sm text-slate-500">{search.count} searches</span>
              </div>
            ))}
            {(!stats.topSearches || stats.topSearches.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">No search data yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
