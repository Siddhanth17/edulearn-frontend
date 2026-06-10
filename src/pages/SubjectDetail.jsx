import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjectsAPI } from '../services/api';
import Loading from '../components/ui/Loading';

export default function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectsAPI.getById(id).then(({ data }) => {
      setSubject(data.subject);
      setChapters(data.chapters);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!subject) return <div className="text-center py-20">Subject not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: subject.color }}>{subject.name}</h1>
        {subject.description && <p className="text-slate-500 mt-2">{subject.description}</p>}
      </div>

      <h2 className="text-xl font-semibold mb-6">Chapters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <Link
            key={chapter._id}
            to={`/chapters/${chapter._id}`}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 card-hover"
          >
            <h3 className="font-semibold hover:text-primary-600 transition-colors">{chapter.name}</h3>
            {chapter.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{chapter.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
