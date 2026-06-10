import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studentAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Contact() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentAPI.contact(form);
      toast.success('Message sent to instructor!');
      setForm({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Please login to contact the instructor</p>
        <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Instructor</h1>
      <p className="text-slate-500 mb-8">Have a question? Send a message directly to your instructor.</p>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border p-8 space-y-5">
        <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <Button type="submit" className="w-full" loading={loading}>Send Message</Button>
      </form>
    </div>
  );
}
