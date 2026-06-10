import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp, Pin, Trash2, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { commentsAPI } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';

function CommentItem({ comment, noteId, depth = 0, onReply, onRefresh }) {
  const { user } = useSelector((state) => state.auth);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like comments');
    try {
      await commentsAPI.like(comment._id);
      onRefresh();
    } catch {
      toast.error('Failed to like comment');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await commentsAPI.create(noteId, { content: replyText, parent: comment._id });
      setReplyText('');
      setShowReply(false);
      onRefresh();
      toast.success('Reply posted');
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete(comment._id);
      onRefresh();
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handlePin = async () => {
    try {
      await commentsAPI.pin(comment._id, !comment.isPinned);
      onRefresh();
    } catch {
      toast.error('Failed to pin comment');
    }
  };

  const isLiked = comment.likes?.includes(user?.id) || comment.likes?.some((l) => l === user?.id || l._id === user?.id);

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700' : ''}`}>
      <div className={`p-4 rounded-xl ${comment.isPinned ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm shrink-0">
            {comment.author?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                {comment.author?.name}
              </span>
              {comment.author?.role === 'admin' && (
                <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                  Instructor
                </span>
              )}
              {comment.isPinned && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs ${isLiked ? 'text-primary-600' : 'text-slate-500'} hover:text-primary-600 transition-colors`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {comment.likeCount || comment.likes?.length || 0}
              </button>
              {user && depth < 3 && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Reply
                </button>
              )}
              {user?.role === 'admin' && (
                <button onClick={handlePin} className="text-xs text-slate-500 hover:text-amber-600">
                  {comment.isPinned ? 'Unpin' : 'Pin'}
                </button>
              )}
              {(user?.role === 'admin' || comment.author?._id === user?.id) && (
                <button onClick={handleDelete} className="text-xs text-slate-500 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {showReply && (
          <form onSubmit={handleReply} className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
            />
            <Button type="submit" size="sm" loading={submitting}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <div key={reply._id} className="mt-3">
          <CommentItem comment={reply} noteId={noteId} depth={depth + 1} onReply={onReply} onRefresh={onRefresh} />
        </div>
      ))}
    </div>
  );
}

export default function CommentSection({ noteId }) {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await commentsAPI.getByNote(noteId);
      setComments(data.comments);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useSocket(noteId, {
    onNewComment: () => fetchComments(),
    onLike: () => fetchComments(),
    onPin: () => fetchComments(),
    onDelete: () => fetchComments(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await commentsAPI.create(noteId, { content });
      setContent('');
      fetchComments();
      toast.success('Comment posted');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Discussion ({comments.length} threads)
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask a doubt or share your thoughts..."
            rows={3}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="submit" loading={submitting} className="self-end">
            Post
          </Button>
        </form>
      ) : (
        <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          Please <a href="/login" className="text-primary-600 hover:underline">login</a> to join the discussion.
        </p>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No comments yet. Be the first to ask a question!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              noteId={noteId}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
