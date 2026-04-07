import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '@/lib/local-store';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unread = getNotifications().filter((n: any) => !n.isRead).length;

  return (
    <header className="hidden md:flex h-16 border-b border-border glass sticky top-0 z-30 items-center justify-between px-6">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search anything..."
          className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground leading-tight">{user?.fullName}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
