import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Download, Bookmark, Eye, ExternalLink, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { notesAPI, bookmarksAPI } from '../services/api';
import CommentSection from '../components/comments/CommentSection';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await notesAPI.getById(id);
        setNote(data.note);
        if (user) {
          const bookmarks = await bookmarksAPI.getAll({ limit: 100 });
          setBookmarked(bookmarks.data.bookmarks.some((b) => b._id === id));
        }
      } catch {
        toast.error('Note not found');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, user]);

  const handleDownload = async () => {
    try {
      const { data } = await notesAPI.download(id);
      if (data.files?.length) {
        data.files.forEach((f) => window.open(f.url, '_blank'));
      } else {
        toast.error('No downloadable files');
      }
    } catch {
      toast.error('Download failed');
    }
  };

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to bookmark');
    try {
      const { data } = await bookmarksAPI.toggle(id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked!' : 'Bookmark removed');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) return <Loading />;
  if (!note) return <div className="text-center py-20">Note not found</div>;

  const getYoutubeId = (url) => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match?.[1];
  };

  const youtubeId = getYoutubeId(note.youtubeUrl);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link to={`/subjects/${note.subject?._id}`} className="hover:text-primary-600">{note.subject?.name}</Link>
          <span>/</span>
          <Link to={`/chapters/${note.chapter?._id}`} className="hover:text-primary-600">{note.chapter?.name}</Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{note.title}</h1>
            {note.videoTitle && <p className="text-slate-500">{note.videoTitle}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {note.viewCount} views</span>
              <span>Lecture {note.lectureNumber}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={handleBookmark}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-primary-600 text-primary-600' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>

        {youtubeId && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={note.videoTitle || note.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {note.youtubeUrl && !youtubeId && (
          <a href={note.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-600 mb-6 hover:underline">
            <Play className="w-4 h-4" /> Watch on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {note.description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{note.description}</p>
        )}

        {note.content && (
          <div className="prose dark:prose-invert max-w-none mb-8 bg-white dark:bg-slate-800 rounded-2xl border p-6">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        )}

        {note.files?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Attached Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {note.files.map((file, i) => (
                <div key={i} className="border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{file.name || `File ${i + 1}`}</p>
                    <p className="text-xs text-slate-400 uppercase">{file.type}</p>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      {file.type === 'pdf' ? 'View PDF' : 'View Image'}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
            {note.files.some((f) => f.type === 'image') && (
              <div className="mt-4 grid gap-4">
                {note.files.filter((f) => f.type === 'image').map((file, i) => (
                  <img key={i} src={file.url} alt={file.name} className="rounded-xl max-w-full" loading="lazy" />
                ))}
              </div>
            )}
          </div>
        )}

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {note.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <CommentSection noteId={id} />
        </div>
      </motion.div>
    </div>
  );
}
