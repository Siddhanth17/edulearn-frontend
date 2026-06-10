import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { subjectsAPI, chaptersAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '', color: '#3B82F6' });
  const [chapterForm, setChapterForm] = useState({ name: '', description: '', subject: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await subjectsAPI.getAll();
    setSubjects(data.subjects);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subjectsAPI.create(subjectForm);
      toast.success('Subject created');
      setSubjectForm({ name: '', description: '', color: '#3B82F6' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await chaptersAPI.create(chapterForm);
      toast.success('Chapter created');
      setChapterForm({ name: '', description: '', subject: '' });
      if (chapterForm.subject) {
        const { data } = await chaptersAPI.getBySubject(chapterForm.subject);
        setChapters(data.chapters);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Delete subject?')) return;
    try {
      await subjectsAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete');
    }
  };

  const loadChapters = async (subjectId) => {
    const { data } = await chaptersAPI.getBySubject(subjectId);
    setChapters(data.chapters);
    setChapterForm({ ...chapterForm, subject: subjectId });
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-8">Subjects & Chapters</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Create Subject</h2>
          <form onSubmit={handleCreateSubject} className="space-y-4">
            <Input label="Name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
            <Input label="Description" value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} />
            <Input label="Color" type="color" value={subjectForm.color} onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })} />
            <Button type="submit" loading={loading}>Create Subject</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Create Chapter</h2>
          <form onSubmit={handleCreateChapter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject</label>
              <select value={chapterForm.subject} onChange={(e) => setChapterForm({ ...chapterForm, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border" required>
                <option value="">Select</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <Input label="Chapter Name" value={chapterForm.name} onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })} required />
            <Input label="Description" value={chapterForm.description} onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })} />
            <Button type="submit" loading={loading}>Create Chapter</Button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Subjects</h2>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject._id} className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: subject.color }} />
                <div>
                  <p className="font-medium">{subject.name}</p>
                  <p className="text-xs text-slate-500">{subject.chapterCount} chapters, {subject.noteCount} notes</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => loadChapters(subject._id)}>View Chapters</Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteSubject(subject._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {chapters.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Chapters</h3>
            {chapters.map((c) => (
              <div key={c._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span>{c.name}</span>
                <span className="text-xs text-slate-400">{c.noteCount} notes</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
