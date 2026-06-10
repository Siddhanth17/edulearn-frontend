import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subjectsAPI } from '../services/api';
import Loading from '../components/ui/Loading';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => {
      setSubjects(data.subjects);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">All Subjects</h1>
      <p className="text-slate-500 mb-8">Browse lecture notes organized by subject</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link
            key={subject._id}
            to={`/subjects/${subject._id}`}
            className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 card-hover"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ backgroundColor: `${subject.color}20` }}
            >
              📚
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary-600 transition-colors">{subject.name}</h3>
            {subject.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{subject.description}</p>}
            <div className="flex gap-4 mt-4 text-sm text-slate-400">
              <span>{subject.chapterCount || 0} chapters</span>
              <span>{subject.noteCount || 0} notes</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
