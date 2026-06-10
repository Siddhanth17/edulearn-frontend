import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bookmark, Clock, TrendingUp, Settings, Mail } from 'lucide-react';
import { bookmarksAPI } from '../services/api';
import NoteCard from '../components/notes/NoteCard';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookmarksAPI.getAll({ limit: 6 }),
      bookmarksAPI.getRecent(),
    ]).then(([bookmarksRes, recentRes]) => {
      setBookmarks(bookmarksRes.data.bookmarks);
      setRecent(recentRes.data.notes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">Track your learning progress and access saved notes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Bookmark, label: 'Bookmarks', value: bookmarks.length, color: 'text-blue-600' },
            { icon: Clock, label: 'Recently Viewed', value: recent.length, color: 'text-green-600' },
            { icon: TrendingUp, label: 'Progress', value: 'Active', color: 'text-purple-600' },
            { icon: Settings, label: 'Account', link: '/settings', color: 'text-slate-600' },
          ].map((stat, i) => (
            <Card key={i} className="p-5">
              {stat.link ? (
                <Link to={stat.link} className="flex items-center gap-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="font-semibold">Manage</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" /> Recently Viewed
            </h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recently viewed notes yet. Start exploring!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.slice(0, 6).map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Bookmark className="w-5 h-5" /> Bookmarked Notes
          </h2>
          {bookmarks.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No bookmarks yet. Save notes for quick access!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
            </div>
          )}
        </section>

        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 text-primary-600 hover:underline">
            <Mail className="w-4 h-4" /> Contact Instructor
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
