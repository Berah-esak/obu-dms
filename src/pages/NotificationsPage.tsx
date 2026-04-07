import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Bell, CheckCheck, DoorOpen, Wrench, ArrowRightLeft, Megaphone, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const iconMap = {
  room_assignment: DoorOpen,
  maintenance_update: Wrench,
  room_change: ArrowRightLeft,
  announcement: Megaphone,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [notifs, count] = await Promise.all([
          apiService.getNotifications({ limit: 50 }),
          apiService.getUnreadNotificationCount(),
        ]);

        if (notifs.success && notifs.data?.notifications) {
          setNotifications(notifs.data.notifications);
        }
        if (count.success && count.data) {
          setUnreadCount(count.data.count);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await apiService.markNotificationAsRead(id);
      if (result.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await apiService.markAllNotificationsAsRead();
      if (result.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread notifications</p>
        </div>
        <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10" onClick={handleMarkAllAsRead}>
          <CheckCheck className="w-4 h-4 mr-1" /> Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <Card key={n.id} className={cn("glass rounded-xl p-4 flex items-start gap-4 transition-all hover:shadow-glow animate-slide-up", !n.isRead && "border-l-2 border-l-primary")}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", !n.isRead ? "bg-primary/10" : "bg-secondary/50")}>
                <Icon className={cn("w-5 h-5", !n.isRead ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-medium", !n.isRead ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10" onClick={() => handleMarkAsRead(n.id)}>
                  <CheckCheck className="w-4 h-4" />
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
