import { mockNotifications } from '@/lib/mock-data';
import { Bell, CheckCheck, DoorOpen, Wrench, ArrowRightLeft, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconMap = {
  room_assignment: DoorOpen,
  maintenance_update: Wrench,
  room_change: ArrowRightLeft,
  announcement: Megaphone,
};

const NotificationsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{mockNotifications.filter(n => !n.isRead).length} unread notifications</p>
        </div>
        <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10">
          <CheckCheck className="w-4 h-4 mr-1" /> Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <div key={n.id} className={cn("glass rounded-xl p-4 flex items-start gap-4 transition-all hover:shadow-glow animate-slide-up", !n.isRead && "border-l-2 border-l-primary")}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
