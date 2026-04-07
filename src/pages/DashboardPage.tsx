import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/StatCard';
import {
  Users, DoorOpen, Wrench, BedDouble, BarChart3, ArrowRightLeft,
  AlertTriangle, CheckCircle2, Bell, Cpu, Activity, RefreshCw,
  TrendingUp, TrendingDown, Shield, Package, Zap, Clock,
  ChevronRight, Radio
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  getDashboardSummary, getMaintenanceRequests,
  getRoomChangeRequests, getNotifications, getRooms
} from '@/lib/local-store';

const CHART_STYLE = {
  tooltip: { background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '12px', color: 'hsl(210, 40%, 95%)' },
  tick: { fill: 'hsl(215, 15%, 55%)', fontSize: 10 },
  grid: 'hsl(220, 15%, 16%)',
};

const monthlyData = [
  { month: 'Sep', occupancy: 75, requests: 12, changes: 4 },
  { month: 'Oct', occupancy: 82, requests: 18, changes: 6 },
  { month: 'Nov', occupancy: 88, requests: 15, changes: 3 },
  { month: 'Dec', occupancy: 65, requests: 8,  changes: 2 },
  { month: 'Jan', occupancy: 90, requests: 22, changes: 8 },
  { month: 'Feb', occupancy: 87, requests: 19, changes: 5 },
  { month: 'Mar', occupancy: 91, requests: 25, changes: 7 },
  { month: 'Apr', occupancy: 87, requests: 23, changes: 6 },
];

const buildingData = [
  { name: 'Blk A', occupancy: 92, capacity: 120 },
  { name: 'Blk B', occupancy: 78, capacity: 90 },
  { name: 'Blk C', occupancy: 95, capacity: 150 },
  { name: 'Blk D', occupancy: 72, capacity: 96 },
];

const pieColors = ['hsl(152,60%,45%)', 'hsl(185,80%,50%)', 'hsl(38,92%,55%)'];

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';
  const isAdmin = hasRole(['dorm_admin', 'system_admin', 'management']);

  const [summary] = useState(() => getDashboardSummary());
  const [maintenance] = useState(() => getMaintenanceRequests());
  const [roomChanges] = useState(() => getRoomChangeRequests());
  const [notifications] = useState(() => getNotifications());
  const [rooms] = useState(() => getRooms());

  const unread = notifications.filter((n: any) => !n.isRead).length;
  const pendingMaint = maintenance.filter((m: any) => m.status === 'Submitted').length;
  const pendingChanges = roomChanges.filter((r: any) => r.status === 'pending').length;
  const availableRooms = rooms.filter((r: any) => r.status === 'Available').length;

  const pieData = [
    { name: 'Available', value: availableRooms },
    { name: 'Occupied', value: rooms.filter((r: any) => r.status === 'Occupied').length },
    { name: 'Maintenance', value: rooms.filter((r: any) => r.status === 'Under Maintenance').length },
  ];

  const recentMaint = maintenance.slice(0, 5);
  const recentChanges = roomChanges.slice(0, 3);

  // Pulse animation for live indicator
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, <span className="text-gradient">{user?.fullName?.split(' ')[0]}</span>
            </h1>
            <span className={cn('flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all',
              pulse ? 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10' : 'border-emerald-400/30 text-emerald-400/70 bg-emerald-400/5'
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
          </div>
          <p className="text-sm text-muted-foreground lowercase tracking-wider">
            System: <span className="text-emerald-400 font-mono">NOMINAL</span>
            {' '}•{' '}Role: <span className="text-primary font-mono uppercase">{user?.role?.replace('_', ' ')}</span>
            {' '}•{' '}{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {isStudent && (
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/room-changes')} variant="outline" className="glass border-primary/20 text-primary hover:bg-primary/10 h-10 gap-2 font-bold uppercase tracking-widest text-[10px]">
              <ArrowRightLeft className="w-4 h-4" /> Request Change
            </Button>
            <Button onClick={() => navigate('/maintenance')} className="gradient-primary text-primary-foreground h-10 gap-2 font-bold uppercase tracking-widest text-[10px] shadow-glow">
              <Wrench className="w-4 h-4" /> Report Issue
            </Button>
          </div>
        )}

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/reports')} variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10">
              <BarChart3 className="w-4 h-4 mr-1" /> Reports
            </Button>
            <Button onClick={() => navigate('/notifications')} variant="outline" className="relative h-9 text-sm border-border/30 hover:bg-secondary/50">
              <Bell className="w-4 h-4 mr-1" /> Inbox
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">{unread}</span>}
            </Button>
          </div>
        )}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isStudent ? (
          <>
            <StatCard title="Assigned Room" value="BLK-A 402" icon={DoorOpen} subtitle="Floor 4 • Triple" />
            <StatCard title="My Requests" value={maintenance.filter((m: any) => m.submittedBy?.email === user?.email).length} icon={Wrench} subtitle="Maintenance" />
            <StatCard title="Room Changes" value={roomChanges.filter((r: any) => r.student?.email === user?.email).length} icon={ArrowRightLeft} subtitle="Submitted" />
            <StatCard title="Notifications" value={unread} icon={Bell} subtitle="Unread" trend={{ value: unread, positive: false }} />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value={summary.totalStudents.toLocaleString()} icon={Users} trend={{ value: 5.2, positive: true }} />
            <StatCard title="Occupancy Rate" value={`${summary.occupancyRate}%`} icon={BarChart3} trend={{ value: 2.1, positive: true }} />
            <StatCard title="Pending Issues" value={pendingMaint + pendingChanges} icon={AlertTriangle} subtitle={`${pendingMaint} maint · ${pendingChanges} changes`} />
            <StatCard title="Available Beds" value={summary.availableBeds} icon={BedDouble} subtitle={`${rooms.length} total rooms`} />
          </>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Charts + Logs */}
        <div className="lg:col-span-2 space-y-6">

          {isStudent ? (
            /* Student room card */
            <Card className="glass border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                    <DoorOpen className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Room BLK-A 402</h2>
                    <p className="text-sm text-muted-foreground">Standard Triple • 4th Floor</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Room Status</p>
                    {['HVAC Controller', 'Network Hub', 'Biometric Lock'].map(item => (
                      <div key={item} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-white/5">
                        <span className="text-xs font-medium">{item}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Occupants</p>
                    {['Alemu Bekele (You)', 'Dawit M.', 'Tadesse K.'].map(p => (
                      <div key={p} className="flex items-center gap-2 p-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Users className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-warning/5 border border-warning/10 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-warning animate-pulse flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Block A water maintenance scheduled tomorrow 14:00–16:00.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Admin charts */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Building Occupancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={buildingData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
                      <XAxis dataKey="name" tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
                      <YAxis tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_STYLE.tooltip} />
                      <Bar dataKey="occupancy" fill="hsl(185,80%,50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Room Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none" paddingAngle={4}>
                        {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={CHART_STYLE.tooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-1">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                        <span className="text-[10px] text-muted-foreground uppercase">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/5 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Semester Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(185,80%,50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(185,80%,50%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(38,92%,55%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(38,92%,55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} />
                      <XAxis dataKey="month" tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
                      <YAxis tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={CHART_STYLE.tooltip} />
                      <Area type="monotone" dataKey="occupancy" stroke="hsl(185,80%,50%)" fill="url(#occGrad)" strokeWidth={2} name="Occupancy %" />
                      <Area type="monotone" dataKey="requests" stroke="hsl(38,92%,55%)" fill="url(#reqGrad)" strokeWidth={2} name="Maintenance" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <Card className="glass border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" /> Recent Activity
              </CardTitle>
              <Button variant="link" className="text-xs text-primary p-0 h-auto" onClick={() => navigate('/maintenance')}>
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentMaint.map((req: any) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all border border-white/5 cursor-pointer" onClick={() => navigate('/maintenance')}>
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                    req.priority === 'High' ? 'bg-destructive animate-pulse' :
                    req.priority === 'Medium' ? 'bg-warning' : 'bg-success'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{req.requestId}</p>
                    <p className="text-xs text-foreground truncate">{req.description}</p>
                  </div>
                  <Badge variant="outline" className={cn('text-[8px] font-bold uppercase shrink-0',
                    req.status === 'Completed' ? 'border-success/30 text-success' :
                    req.status === 'In Progress' ? 'border-warning/30 text-warning' :
                    'border-primary/30 text-primary'
                  )}>{req.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">

          {/* Quick Stats */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pending Changes', value: pendingChanges, icon: ArrowRightLeft, color: 'text-warning', path: '/room-changes' },
                { label: 'Pending Maint.', value: pendingMaint, icon: Wrench, color: 'text-destructive', path: '/maintenance' },
                { label: 'Total Rooms', value: rooms.length, icon: DoorOpen, color: 'text-primary', path: '/rooms' },
                { label: 'Unread Notifs', value: unread, icon: Bell, color: 'text-info', path: '/notifications' },
              ].map(item => (
                <div key={item.label} className="glass rounded-xl p-4 border-white/5 hover:shadow-glow transition-all cursor-pointer group" onClick={() => navigate(item.path)}>
                  <item.icon className={cn('w-5 h-5 mb-2', item.color)} />
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pending Room Changes */}
          {isAdmin && recentChanges.filter((r: any) => r.status === 'pending').length > 0 && (
            <Card className="glass border-warning/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" /> Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentChanges.filter((r: any) => r.status === 'pending').map((req: any) => (
                  <div key={req.id} className="p-3 rounded-xl bg-warning/5 border border-warning/10 cursor-pointer hover:bg-warning/10 transition-all" onClick={() => navigate('/room-changes')}>
                    <p className="text-xs font-semibold text-foreground">{req.student?.fullName}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{req.reason} • {req.currentRoom?.roomId}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full h-8 text-xs border-warning/20 text-warning hover:bg-warning/10" onClick={() => navigate('/room-changes')}>
                  Review All
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          <Card className="glass border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Inbox
                {unread > 0 && <Badge className="ml-auto bg-primary text-primary-foreground text-[9px] px-1.5">{unread}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className={cn('relative pl-4 cursor-pointer group', !n.isRead && 'before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full')}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={cn('text-xs font-bold group-hover:text-primary transition-colors', n.isRead ? 'text-muted-foreground' : 'text-foreground')}>{n.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
              ))}
              <Button className="w-full h-9 bg-secondary/40 hover:bg-secondary/60 text-muted-foreground text-[10px] font-bold uppercase tracking-widest" onClick={() => navigate('/notifications')}>
                View All
              </Button>
            </CardContent>
          </Card>

          {/* System Telemetry */}
          <Card className="glass border-primary/10">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">System Telemetry</span>
              </div>
              <div className="h-20 flex items-end justify-between gap-1">
                {[40, 70, 45, 90, 65, 80, 50, 75, 45, 95, 60, 85].map((h, i) => (
                  <div key={i} className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { label: 'API Latency', value: '4ms', ok: true },
                  { label: 'DB Sync', value: 'LIVE', ok: true },
                  { label: 'Auth Service', value: 'ACTIVE', ok: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    <span className={cn('font-mono font-bold', item.ok ? 'text-emerald-400' : 'text-destructive')}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
