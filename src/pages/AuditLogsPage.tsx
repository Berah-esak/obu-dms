import { mockAuditLogs } from '@/lib/mock-data';
import { Shield, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const AuditLogsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = mockAuditLogs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">System activity tracking</p>
        </div>
        <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((log) => (
          <div key={log.id} className="glass rounded-xl p-4 flex items-center gap-4 animate-slide-up hover:bg-secondary/10 transition-colors">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogsPage;
