import { mockDashboard } from '@/lib/mock-data';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import { Users, DoorOpen, BedDouble, Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const monthlyData = [
  { month: 'Sep', occupancy: 75, requests: 12 },
  { month: 'Oct', occupancy: 82, requests: 18 },
  { month: 'Nov', occupancy: 88, requests: 15 },
  { month: 'Dec', occupancy: 65, requests: 8 },
  { month: 'Jan', occupancy: 90, requests: 22 },
  { month: 'Feb', occupancy: 87, requests: 19 },
  { month: 'Mar', occupancy: 91, requests: 25 },
  { month: 'Apr', occupancy: 87, requests: 23 },
];

const ReportsPage = () => {
  const data = mockDashboard;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive dormitory analytics</p>
        </div>
        <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10">
          <Download className="w-4 h-4 mr-1" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={data.totalStudents.toLocaleString()} icon={Users} />
        <StatCard title="Total Rooms" value={data.totalRooms} icon={DoorOpen} />
        <StatCard title="Available Beds" value={data.availableBeds} icon={BedDouble} />
        <StatCard title="Pending Maintenance" value={data.pendingMaintenance} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Occupancy Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
              <Area type="monotone" dataKey="occupancy" stroke="hsl(185, 80%, 50%)" fill="hsl(185, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Maintenance Requests Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
              <Line type="monotone" dataKey="requests" stroke="hsl(38, 92%, 55%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(38, 92%, 55%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
