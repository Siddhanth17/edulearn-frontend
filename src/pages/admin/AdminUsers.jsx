import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search: q, limit: 50 });
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id, isBanned) => {
    try {
      await adminAPI.banUser(id, isBanned);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned } : u)));
      toast.success(isBanned ? 'User banned' : 'User unbanned');
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => fetchUsers(search)}>Search</Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-3 px-4 font-medium">{user.name}</td>
                <td className="py-3 px-4 text-slate-500">{user.email}</td>
                <td className="py-3 px-4">
                  {user.isBanned ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Banned</span>
                  ) : user.isVerified ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unverified</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-400">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Button size="sm" variant={user.isBanned ? 'outline' : 'danger'} onClick={() => handleBan(user._id, !user.isBanned)}>
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
