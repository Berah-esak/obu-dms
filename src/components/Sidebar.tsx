import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, DoorOpen, Wrench,
  ArrowRightLeft, Package, BarChart3, Bell, Shield, LogOut,
  ChevronLeft, ChevronRight, Settings, X, Menu,
} from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/types/api';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/dashboard',   roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
  { icon: Users,           label: 'Profile',        path: '/profile',     roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
  { icon: Users,           label: 'Students',       path: '/students',    roles: ['dorm_admin', 'management', 'system_admin'] },
  { icon: DoorOpen,        label: 'Rooms',          path: '/rooms',       roles: ['dorm_admin', 'management', 'system_admin'] },
  { icon: ArrowRightLeft,  label: 'Room Changes',   path: '/room-changes',roles: ['student', 'dorm_admin', 'system_admin'] },
  { icon: Wrench,          label: 'Maintenance',    path: '/maintenance', roles: ['student', 'dorm_admin', 'maintenance', 'system_admin'] },
  { icon: Package,         label: 'Inventory',      path: '/inventory',   roles: ['dorm_admin', 'system_admin'] },
  { icon: BarChart3,       label: 'Reports',        path: '/reports',     roles: ['dorm_admin', 'management', 'system_admin'] },
  { icon: Users,           label: 'Users',          path: '/users',       roles: ['system_admin'] },
  { icon: Bell,            label: 'Notifications',  path: '/notifications',roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
  { icon: Shield,          label: 'Audit Logs',     path: '/audit-logs',  roles: ['system_admin'] },
  { icon: Settings,        label: 'Settings',       path: '/settings',    roles: ['system_admin'] },
];

// Items shown in mobile bottom bar (most important per role)
const mobileBottomItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Home',      path: '/dashboard',    roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
  { icon: ArrowRightLeft,  label: 'Changes',   path: '/room-changes', roles: ['student', 'dorm_admin', 'system_admin'] },
  { icon: Wrench,          label: 'Maint.',    path: '/maintenance',  roles: ['student', 'dorm_admin', 'maintenance', 'system_admin'] },
  { icon: Bell,            label: 'Inbox',     path: '/notifications',roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
  { icon: Users,           label: 'Profile',   path: '/profile',      roles: ['student', 'dorm_admin', 'maintenance', 'management', 'system_admin'] },
];

export default function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = navItems.filter(item => hasRole(item.roles));
  const filteredBottom = mobileBottomItems.filter(item => hasRole(item.roles));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const NavItem = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
        isActive
          ? 'bg-primary/15 text-primary shadow-glow font-semibold'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside className={cn(
        'hidden md:flex fixed left-0 top-0 h-full z-40 flex-col border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-60'
      )} style={{ background: 'var(--gradient-sidebar)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-9 h-9">
            <img src="/logo.png" alt="OBU" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate">OBU DMS</h2>
              <p className="text-[10px] text-muted-foreground truncate">Dormitory System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {filteredNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-primary/15 text-primary shadow-glow font-semibold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && user && (
            <div className="mb-3 px-2">
              <p className="text-xs font-medium text-foreground truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Mobile Top Bar ───────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="OBU" className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold text-foreground">OBU DMS</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* ── Mobile Drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full flex flex-col border-r border-sidebar-border animate-slide-up"
            style={{ background: 'var(--gradient-sidebar)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="OBU" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-sm font-bold text-foreground">OBU DMS</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/50">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* User info */}
            <div className="px-4 py-3 border-b border-sidebar-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                  {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
              {filteredNav.map(item => (
                <NavItem key={item.path} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-sidebar-border p-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border flex items-center justify-around px-2 py-1 safe-area-pb">
        {filteredBottom.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0"
            >
              <item.icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span className={cn('text-[9px] font-bold uppercase tracking-wider truncate', isActive ? 'text-primary' : 'text-muted-foreground')}>
                {item.label}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
