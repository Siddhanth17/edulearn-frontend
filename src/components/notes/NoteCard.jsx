import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Download, BookOpen } from 'lucide-react';
import { getContentTypeIcon, formatDate } from '../../utils/helpers';

export default function NoteCard({ note, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/notes/${note._id}`}>
        <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 card-hover h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${note.subject?.color || '#3B82F6'}20`,
                color: note.subject?.color || '#3B82F6',
              }}
            >
              {note.subject?.name || 'Subject'}
            </span>
            <span className="text-lg">{getContentTypeIcon(note.contentType)}</span>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
            {note.title}
          </h3>

          {note.chapter && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              {note.chapter.name} • Lecture {note.lectureNumber}
            </p>
          )}

          {note.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
              {note.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
            <span>{formatDate(note.createdAt)}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {note.viewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> {note.downloadCount || 0}
              </span>
            </div>
          </div>

          {note.isFeatured && (
            <div className="absolute top-3 right-3">
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
