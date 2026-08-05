import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, X, CalendarDays, AlertTriangle, Settings, Receipt, Pill } from 'lucide-react';
import { markAsRead, markAllAsRead, clearNotification } from './notificationSlice';
import { Badge } from '../../components/ui';
import { formatTimeAgo } from '../../utils/helpers';

const typeConfig = {
  appointment: { icon: CalendarDays, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-950/30' },
  alert: { icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50 dark:bg-danger-950/30' },
  system: { icon: Settings, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-800' },
  billing: { icon: Receipt, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-950/30' },
  pharmacy: { icon: Pill, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-950/30' },
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notifications);

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">All Notifications</h2>
          {unreadCount > 0 && <Badge variant="danger">{unreadCount} unread</Badge>}
        </div>
        {unreadCount > 0 && (
          <button onClick={() => dispatch(markAllAsRead())} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Bell className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500">No notifications</p>
          </div>
        ) : (
          items.map((n) => {
            const config = typeConfig[n.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && dispatch(markAsRead(n.id))}
                className={`glass-card p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md ${!n.read ? 'border-l-4 border-l-primary-500' : 'opacity-75'}`}
              >
                <div className={`${config.bg} p-2.5 rounded-xl flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{n.title}</p>
                    {n.priority === 'high' && <Badge variant="danger">Urgent</Badge>}
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-surface-400 mt-1.5">{formatTimeAgo(n.timestamp)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dispatch(clearNotification(n.id)); }} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
