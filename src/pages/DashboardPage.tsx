import { useAuth } from '@/contexts/AuthContext';
import { mockDashboard, mockMaintenanceRequests, mockRooms, mockRoomChangeRequests } from '@/lib/mock-data';
import StatCard from '@/components/StatCard';
import { Users, DoorOpen, Wrench, BedDouble, BarChart3, ArrowRightLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const occupancyData = [
  { name: 'Block A', occupancy: 92, total: 120 },
  { name: 'Block B', occupancy: 78, total: 90 },
  { name: 'Block C', occupancy: 95, total: 150 },
  { name: 'Block D', occupancy: 72, total: 96 },
];

const statusData = [
  { name: 'Available', value: 58, color: 'hsl(152, 60%, 45%)' },
  { name: 'Occupied', value: 375, color: 'hsl(185, 80%, 50%)' },
  { name: 'Maintenance', value: 23, color: 'hsl(38, 92%, 55%)' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const data = mockDashboard;
  const isStudent = user?.role === 'student';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-gradient">{user?.fullName?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening in your dormitory system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={data.totalStudents.toLocaleString()} icon={Users} trend={{ value: 5.2, positive: true }} />
        <StatCard title="Total Rooms" value={data.totalRooms} icon={DoorOpen} subtitle="Across 4 blocks" />
        <StatCard title="Occupancy Rate" value={`${data.occupancyRate}%`} icon={BarChart3} trend={{ value: 2.1, positive: true }} />
        <StatCard title="Available Beds" value={data.availableBeds} icon={BedDouble} subtitle={`${data.pendingMaintenance} under maintenance`} />
      </div>

      {!isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy Chart */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Building Occupancy</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }}
                />
                <Bar dataKey="occupancy" fill="hsl(185, 80%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Room Status Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-muted-foreground">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Maintenance */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Recent Maintenance Requests
          </h3>
          <div className="space-y-3">
            {mockMaintenanceRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                  req.priority === 'High' ? 'bg-destructive' : req.priority === 'Medium' ? 'bg-warning' : 'bg-success'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{req.description}</p>
                  <p className="text-[10px] text-muted-foreground">{req.room.building} • {req.requestId}</p>
                </div>
                <Badge variant="outline" className={cn("text-[10px] shrink-0",
                  req.status === 'Completed' ? 'border-success/30 text-success' :
                  req.status === 'In Progress' ? 'border-warning/30 text-warning' :
                  'border-primary/30 text-primary'
                )}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Room Change Requests */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-primary" />
            Room Change Requests
          </h3>
          <div className="space-y-3">
            {mockRoomChangeRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                {req.status === 'pending' ? <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{req.student.fullName}</p>
                  <p className="text-[10px] text-muted-foreground">{req.reason} • {req.currentRoom.roomId}</p>
                </div>
                <Badge variant="outline" className={cn("text-[10px] shrink-0",
                  req.status === 'approved' ? 'border-success/30 text-success' :
                  req.status === 'rejected' ? 'border-destructive/30 text-destructive' :
                  'border-warning/30 text-warning'
                )}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
