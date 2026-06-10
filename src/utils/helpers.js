export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getContentTypeIcon = (type) => {
  switch (type) {
    case 'pdf': return '📄';
    case 'image': return '🖼️';
    case 'mixed': return '📚';
    default: return '📝';
  }
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
};
