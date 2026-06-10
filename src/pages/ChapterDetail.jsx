import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chaptersAPI } from '../services/api';
import NoteCard from '../components/notes/NoteCard';
import Loading from '../components/ui/Loading';

export default function ChapterDetail() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chaptersAPI.getById(id).then(({ data }) => {
      setChapter(data.chapter);
      setNotes(data.notes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!chapter) return <div className="text-center py-20">Chapter not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to={`/subjects/${chapter.subject?._id}`} className="text-sm text-primary-600 hover:underline">
          ← {chapter.subject?.name}
        </Link>
        <h1 className="text-3xl font-bold mt-2">{chapter.name}</h1>
        {chapter.description && <p className="text-slate-500 mt-2">{chapter.description}</p>}
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No notes in this chapter yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
        </div>
      )}
    </div>
  );
}
