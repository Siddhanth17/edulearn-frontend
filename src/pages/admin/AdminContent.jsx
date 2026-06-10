import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notesAPI, subjectsAPI, chaptersAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AdminContent() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', content: '', subject: '', chapter: '',
    lectureNumber: 1, videoTitle: '', youtubeUrl: '', tags: '', keywords: '',
    isFeatured: false, isPublished: true,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.subjects));
    notesAPI.getAll({ limit: 50 }).then(({ data }) => setNotes(data.notes));
  }, []);

  useEffect(() => {
    if (form.subject) {
      chaptersAPI.getBySubject(form.subject).then(({ data }) => setChapters(data.chapters));
    }
  }, [form.subject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '' && value !== null) formData.append(key, value);
    });
    files.forEach((f) => formData.append('files', f));

    try {
      if (editingId) {
        await notesAPI.update(editingId, formData);
        toast.success('Note updated');
      } else {
        await notesAPI.create(formData);
        toast.success('Note created');
      }
      setForm({
        title: '', description: '', content: '', subject: '', chapter: '',
        lectureNumber: 1, videoTitle: '', youtubeUrl: '', tags: '', keywords: '',
        isFeatured: false, isPublished: true,
      });
      setFiles([]);
      setEditingId(null);
      const { data } = await notesAPI.getAll({ limit: 50 });
      setNotes(data.notes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await notesAPI.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({
      title: note.title,
      description: note.description || '',
      content: note.content || '',
      subject: note.subject?._id || note.subject,
      chapter: note.chapter?._id || note.chapter,
      lectureNumber: note.lectureNumber || 1,
      videoTitle: note.videoTitle || '',
      youtubeUrl: note.youtubeUrl || '',
      tags: note.tags?.join(', ') || '',
      keywords: note.keywords?.join(', ') || '',
      isFeatured: note.isFeatured,
      isPublished: note.isPublished,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-8">Content Management</h1>

      <Card className="p-6 mb-8">
        <h2 className="font-semibold mb-4">{editingId ? 'Edit Note' : 'Upload New Note'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Lecture Number" type="number" value={form.lectureNumber} onChange={(e) => setForm({ ...form, lectureNumber: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value, chapter: '' })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" required>
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Chapter</label>
            <select value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" required>
              <option value="">Select Chapter</option>
              {chapters.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Video Title" value={form.videoTitle} onChange={(e) => setForm({ ...form, videoTitle: e.target.value })} />
          <Input label="YouTube URL" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <Input label="Keywords (comma separated)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
          <div className="md:col-span-2">
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Text Content (Markdown)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Upload Files (PDF/Images)</label>
            <input type="file" multiple accept=".pdf,image/*" onChange={(e) => setFiles(Array.from(e.target.files))} className="w-full text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" loading={loading}>{editingId ? 'Update Note' : 'Create Note'}</Button>
            {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm({ title: '', description: '', content: '', subject: '', chapter: '', lectureNumber: 1, videoTitle: '', youtubeUrl: '', tags: '', keywords: '', isFeatured: false, isPublished: true }); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">All Notes ({notes.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">Title</th>
                <th className="text-left py-3 px-2">Subject</th>
                <th className="text-left py-3 px-2">Views</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-2">
                    <Link to={`/notes/${note._id}`} className="hover:text-primary-600 line-clamp-1">{note.title}</Link>
                  </td>
                  <td className="py-3 px-2 text-slate-500">{note.subject?.name}</td>
                  <td className="py-3 px-2">{note.viewCount}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${note.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {note.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button onClick={() => handleEdit(note)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
