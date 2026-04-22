import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import type { AuditLog } from '@/types/api';
import { Shield, Search, Download, MoreHorizontal, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const result = await apiService.getAuditLogs({
          page,
          limit: 20,
        });
        if (result.success && result.data) {
          setLogs(result.data.logs);
          setTotalPages(result.data.totalPages);
        }
      } catch (error) {
        console.error('Failed to load audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [page]);

  const filtered = logs.filter(l => {
    if (search && !l.user?.toLowerCase().includes(search.toLowerCase()) && !l.details?.toLowerCase().includes(search.toLowerCase()) && !l.action?.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const actionColors: Record<string, string> = {
    CREATE: 'border-success/30 text-success',
    UPDATE: 'border-info/30 text-info',
    DELETE: 'border-destructive/30 text-destructive',
    LOGIN: 'border-primary/30 text-primary',
    LOGOUT: 'border-muted-foreground/30 text-muted-foreground',
    APPROVE: 'border-success/30 text-success',
    REJECT: 'border-destructive/30 text-destructive',
    ASSIGN: 'border-warning/30 text-warning',
  };

  const handleExport = async () => {
    try {
      const result = await apiService.exportAuditLogs({
        startDate: '',
        endDate: '',
        user: search,
        action: actionFilter !== 'all' ? actionFilter : undefined,
      });
      if (result.success && result.data?.fileUrl) {
        toast.success('Audit logs exported successfully');
        window.open(result.data.fileUrl, '_blank');
      }
    } catch (error) {
      toast.error('Failed to export audit logs');
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
            <Shield className="w-6 h-6 text-primary" /> Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">System activity tracking</p>
        </div>
        <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="LOGIN">LOGIN</SelectItem>
              <SelectItem value="LOGOUT">LOGOUT</SelectItem>
              <SelectItem value="APPROVE">APPROVE</SelectItem>
              <SelectItem value="REJECT">REJECT</SelectItem>
              <SelectItem value="ASSIGN">ASSIGN</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border/30 h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-2">
        {filtered.map((log) => (
          <Card key={log.id} className="glass rounded-xl p-4 flex items-center gap-4 animate-slide-up hover:bg-secondary/10 transition-colors">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", log.status === 'SUCCESS' ? 'bg-success' : 'bg-destructive')} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono text-primary">{log.user}</span>
                <Badge variant="outline" className={cn("text-[10px]", actionColors[log.action] || '')}>{log.action}</Badge>
                <span className="text-xs text-muted-foreground">on {log.entity}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
              <p className="text-[10px] font-mono text-muted-foreground/60">{log.ipAddress}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          className="h-8 text-xs"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          className="h-8 text-xs"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AuditLogsPage;
