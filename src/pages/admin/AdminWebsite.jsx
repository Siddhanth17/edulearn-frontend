import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AdminWebsite() {
  const [settings, setSettings] = useState({
    heroTitle: '', heroSubtitle: '', contactEmail: '',
    socialLinks: { youtube: '', twitter: '', instagram: '' },
  });
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then(({ data }) => {
      setSettings({
        heroTitle: data.settings.heroTitle || '',
        heroSubtitle: data.settings.heroSubtitle || '',
        contactEmail: data.settings.contactEmail || '',
        socialLinks: data.settings.socialLinks || { youtube: '', twitter: '', instagram: '' },
      });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.sendAnnouncement(announcement);
      toast.success('Announcement published');
      setAnnouncement({ title: '', content: '' });
    } catch {
      toast.error('Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBanner = async (e) => {
    e.preventDefault();
    const file = e.target.banner?.files?.[0];
    if (!file) return toast.error('Select a banner image');

    const formData = new FormData();
    formData.append('banner', file);
    formData.append('link', e.target.link.value);

    setLoading(true);
    try {
      await adminAPI.uploadBanner(formData);
      toast.success('Banner uploaded');
      e.target.reset();
    } catch {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Website Management</h1>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Homepage Content</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <Input label="Hero Title" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Hero Subtitle</label>
            <textarea value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border" />
          </div>
          <Input label="Contact Email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
          <Input label="YouTube Channel" value={settings.socialLinks.youtube} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} />
          <Button type="submit" loading={loading}>Save Settings</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Send Announcement</h2>
        <form onSubmit={handleAnnouncement} className="space-y-4 max-w-xl">
          <Input label="Title" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            <textarea value={announcement.content} onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl border" required />
          </div>
          <Button type="submit" loading={loading}>Publish Announcement</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Upload Banner</h2>
        <form onSubmit={handleBanner} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1.5">Banner Image</label>
            <input type="file" name="banner" accept="image/*" className="text-sm" />
          </div>
          <Input label="Link URL (optional)" name="link" />
          <Button type="submit" loading={loading}>Upload Banner</Button>
        </form>
      </Card>
    </div>
  );
}
