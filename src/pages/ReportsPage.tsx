import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiService } from '@/lib/api';
import { BarChart3, Download, Users, DoorOpen, BedDouble, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

type DashboardData = {
  totalStudents: number;
  totalRooms: number;
  occupancyRate: number;
  pendingMaintenance: number;
  availableBeds: number;
};

type OccupancyReport = {
  building: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  data: Array<{ floor: number; occupancyRate: number }>;
};

type MaintenanceSummary = {
  byCategory: Array<{ category: string; count: number }>;
};

type InventoryCondition = {
  byCondition: Array<{ condition: string; count: number }>;
};

const colorByCondition: Record<string, string> = {
  Good: 'hsl(152, 60%, 45%)',
  Fair: 'hsl(38, 92%, 55%)',
  Damaged: 'hsl(0, 84%, 60%)',
  Missing: 'hsl(215, 15%, 55%)',
};

const ReportsPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyReport | null>(null);
  const [maintenanceSummary, setMaintenanceSummary] = useState<MaintenanceSummary | null>(null);
  const [inventoryCondition, setInventoryCondition] = useState<InventoryCondition | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const loadData = useCallback(async () => {
    setLoading(true);

    const [summaryRes, occupancyRes, maintenanceRes, inventoryRes] = await Promise.all([
      apiService.getDashboardSummary(),
      apiService.getOccupancyReport({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      }),
      apiService.getMaintenanceSummary({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      }),
      apiService.getInventoryConditionReport(),
    ]);

    if (summaryRes.success && summaryRes.data) {
      setDashboardData(summaryRes.data as DashboardData);
    }

    if (occupancyRes.success && occupancyRes.data) {
      setOccupancy(occupancyRes.data as OccupancyReport);
    }

    if (maintenanceRes.success && maintenanceRes.data) {
      setMaintenanceSummary(maintenanceRes.data as MaintenanceSummary);
    }

    if (inventoryRes.success && inventoryRes.data) {
      setInventoryCondition(inventoryRes.data as InventoryCondition);
    }

    setLoading(false);
  }, [dateRange.end, dateRange.start]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async (type: string) => {
    const result = await apiService.exportReport(type, 'xlsx', {
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    });

    if (result.success && result.data?.fileUrl) {
      toast.success('Report exported successfully');
      window.open(result.data.fileUrl, '_blank');
      return;
    }

    toast.error(result.error || 'Failed to export report');
  };

  const floorOccupancyData = useMemo(() => {
    return (occupancy?.data || []).map((row) => ({
      name: `Floor ${row.floor}`,
      occupancy: Math.round(row.occupancyRate),
    }));
  }, [occupancy]);

  const statusDistributionData = useMemo(() => {
    const totalRooms = occupancy?.totalRooms || 0;
    const occupiedRooms = occupancy?.occupiedRooms || 0;
    const availableRooms = Math.max(totalRooms - occupiedRooms, 0);

    return [
      { name: 'Available', value: availableRooms, color: 'hsl(152, 60%, 45%)' },
      { name: 'Occupied', value: occupiedRooms, color: 'hsl(185, 80%, 50%)' },
      { name: 'Maintenance Requests', value: dashboardData?.pendingMaintenance || 0, color: 'hsl(38, 92%, 55%)' },
    ];
  }, [occupancy, dashboardData]);

  const inventoryConditionData = useMemo(() => {
    return (inventoryCondition?.byCondition || []).map((item) => ({
      ...item,
      color: colorByCondition[item.condition] || 'hsl(215, 15%, 55%)',
    }));
  }, [inventoryCondition]);

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
            <Input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="w-32 bg-secondary/30 border-border/30 h-9 text-sm" />
            <Input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="w-32 bg-secondary/30 border-border/30 h-9 text-sm" />
            <Button variant="outline" className="h-9 text-sm" onClick={loadData}>Apply</Button>
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
            <CardTitle className="text-sm font-semibold text-foreground">Occupancy by Floor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={floorOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
                <Area type="monotone" dataKey="occupancy" stroke="hsl(185, 80%, 50%)" fill="hsl(185, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass rounded-xl p-5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Maintenance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={maintenanceSummary?.byCategory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', color: 'hsl(210, 40%, 95%)' }} />
                <Bar dataKey="count" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass rounded-xl p-5">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Room Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusDistributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none" paddingAngle={5}>
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '12px', color: 'hsl(210, 40%, 95%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass rounded-xl p-5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Inventory Condition Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inventoryConditionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" vertical={false} />
                <XAxis dataKey="condition" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '12px', color: 'hsl(210, 40%, 95%)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {inventoryConditionData.map((entry, index) => (
                    <Cell key={`condition-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
