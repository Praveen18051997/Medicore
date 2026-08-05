export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateStr);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status) => {
  const map = {
    'Active': 'badge-success',
    'Available': 'badge-success',
    'Completed': 'badge-success',
    'Paid': 'badge-success',
    'Scheduled': 'badge-info',
    'In Progress': 'badge-info',
    'In Surgery': 'badge-info',
    'Recovering': 'badge-info',
    'Pending': 'badge-warning',
    'On Leave': 'badge-warning',
    'Maintenance': 'badge-warning',
    'Critical': 'badge-danger',
    'Cancelled': 'badge-danger',
    'Overdue': 'badge-danger',
    'Occupied': 'badge-neutral',
    'Discharged': 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
