import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { BarChart3, Download, Users, DoorOpen, BedDouble, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const ReportsPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [occupancyData, setOccupancyData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summary, occupancy] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getOccupancyReport(),
        ]);

        if (summary.success && summary.data) {
          setDashboardData(summary.data);
        }
        if (occupancy.success && occupancy.data) {
          setOccupancyData(occupancy.data);
        }
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleExport = async (type: string) => {
    try {
      const result = await apiService.exportReport(type, 'xlsx', dateRange);
      if (result.success && result.data?.fileUrl) {
        toast.success('Report exported successfully');
        window.open(result.data.fileUrl, '_blank');
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

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
            <BarChart3 className="w-6 h-6 text-primary" /> Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive dormitory analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="w-32 bg-secondary/30 border-border/30 h-9 text-sm" />
            <Input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="w-32 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-48 bg-secondary/30 border-border/30 h-9 text-sm">
              <Download className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Export Report" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="occupancy">Occupancy Report</SelectItem>
              <SelectItem value="student_directory">Student Directory</SelectItem>
              <SelectItem value="maintenance_summary">Maintenance Summary</SelectItem>
              <SelectItem value="room_utilization">Room Utilization</SelectItem>
              <SelectItem value="inventory_condition">Inventory Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={dashboardData?.totalStudents?.toLocaleString() || '0'} icon={Users} />
        <StatCard title="Total Rooms" value={dashboardData?.totalRooms || '0'} icon={DoorOpen} />
        <StatCard title="Available Beds" value={dashboardData?.availableBeds || '0'} icon={BedDouble} />
        <StatCard title="Pending Maintenance" value={dashboardData?.pendingMaintenance || '0'} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass rounded-xl p-5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Occupancy Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
                <Area type="monotone" dataKey="occupancy" stroke="hsl(185, 80%, 50%)" fill="hsl(185, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass rounded-xl p-5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Maintenance Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
                <Line type="monotone" dataKey="requests" stroke="hsl(38, 92%, 55%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(38, 92%, 55%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass rounded-xl p-5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Occupancy by Building</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '12px', color: 'hsl(210, 40%, 95%)' }} />
                <Bar dataKey="occupancy" fill="hsl(185, 80%, 50%)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass rounded-xl p-5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[
                  { name: 'Available', value: 58, color: 'hsl(152, 60%, 45%)' },
                  { name: 'Occupied', value: 375, color: 'hsl(185, 80%, 50%)' },
                  { name: 'Maintenance', value: 23, color: 'hsl(38, 92%, 55%)' },
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none" paddingAngle={5}>
                  {[
                    { name: 'Available', color: 'hsl(152, 60%, 45%)' },
                    { name: 'Occupied', color: 'hsl(185, 80%, 50%)' },
                    { name: 'Maintenance', color: 'hsl(38, 92%, 55%)' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '12px', color: 'hsl(210, 40%, 95%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
