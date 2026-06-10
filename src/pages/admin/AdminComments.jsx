import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { commentsAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatRelativeTime } from '../../utils/helpers';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data } = await commentsAPI.getAll({ limit: 50 });
      setComments(data.comments);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, []);

  const handleDelete = async (id) => {
    try {
      await commentsAPI.delete(id);
      fetchComments();
      toast.success('Comment deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handlePin = async (id, isPinned) => {
    try {
      await commentsAPI.pin(id, !isPinned);
      fetchComments();
      toast.success(isPinned ? 'Unpinned' : 'Pinned');
    } catch {
      toast.error('Pin failed');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-8">Comment Moderation</h1>

      {loading ? (
        <p className="text-center py-12 text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author?.name}</span>
                    <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                    {comment.isPinned && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pinned</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{comment.content}</p>
                  <p className="text-xs text-slate-400">On: {comment.note?.title || 'Unknown note'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handlePin(comment._id, comment.isPinned)}>
                    {comment.isPinned ? 'Unpin' : 'Pin'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(comment._id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
