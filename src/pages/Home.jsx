import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Search, TrendingUp, Star } from 'lucide-react';
import { notesAPI, publicAPI, subjectsAPI } from '../services/api';
import NoteCard from '../components/notes/NoteCard';
import SearchBar from '../components/ui/SearchBar';
import Loading from '../components/ui/Loading';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes, popularRes, subjectsRes, settingsRes] = await Promise.all([
          notesAPI.getFeatured(),
          notesAPI.getLatest(),
          notesAPI.getPopular(),
          subjectsAPI.getAll(),
          publicAPI.getSettings(),
        ]);
        setFeatured(featuredRes.data.notes);
        setLatest(latestRes.data.notes);
        setPopular(popularRes.data.notes);
        setSubjects(subjectsRes.data.subjects);
        setSettings(settingsRes.data.settings);
      } catch {
        /* partial load ok */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {settings?.heroTitle || 'Learn Smarter with EduLearn'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              {settings?.heroSubtitle || 'Access lecture notes, discuss doubts, and track your learning progress — all in one place.'}
            </p>
            <div className="max-w-xl mb-8">
              <SearchBar large className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder-white/60 [&_input]:focus:ring-white/50" />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/subjects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Browse Notes <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Lecture Notes', value: `${latest.length}+` },
            { icon: Users, label: 'Subjects', value: subjects.length },
            { icon: Search, label: 'Smart Search', value: 'Fast' },
            { icon: TrendingUp, label: 'Track Progress', value: '100%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      {settings?.announcements?.filter((a) => a.isActive).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Announcements</h3>
            {settings.announcements.filter((a) => a.isActive).slice(0, 3).map((a, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <p className="font-medium text-amber-900 dark:text-amber-200">{a.title}</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">{a.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" /> Featured Notes
            </h2>
            <Link to="/notes" className="text-primary-600 hover:underline text-sm font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Latest Lectures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
        </div>
      </section>

      {/* Popular */}
      {popular.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-100 dark:bg-slate-900/50 rounded-3xl mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-600" /> Popular Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.slice(0, 6).map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
          </div>
        </section>
      )}

      {/* Subjects */}
      {subjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8">Browse by Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject._id}
                to={`/subjects/${subject._id}`}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 card-hover text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  📚
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{subject.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{subject.noteCount || 0} notes</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
