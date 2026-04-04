import { mockMaintenanceRequests } from '@/lib/mock-data';
import { Wrench, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MaintenancePage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = mockMaintenanceRequests.filter(r => {
    if (search && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.requestId.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" /> Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage maintenance requests</p>
        </div>
        <Button className="gradient-primary text-primary-foreground h-9 text-sm">
          <Plus className="w-4 h-4 mr-1" /> New Request
        </Button>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 bg-secondary/30 border-border/30 h-9 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <div key={req.id} className="glass rounded-xl p-5 hover:shadow-glow transition-all duration-300 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className={cn("w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                req.priority === 'High' ? 'bg-destructive animate-pulse' : req.priority === 'Medium' ? 'bg-warning' : 'bg-success'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary">{req.requestId}</span>
                  <Badge variant="outline" className={cn("text-[10px]",
                    req.status === 'Completed' ? 'border-success/30 text-success' :
                    req.status === 'In Progress' ? 'border-warning/30 text-warning' :
                    req.status === 'Rejected' ? 'border-destructive/30 text-destructive' :
                    'border-primary/30 text-primary'
                  )}>{req.status}</Badge>
                  <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">{req.category}</Badge>
                </div>
                <p className="text-sm text-foreground">{req.description}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-[11px] text-muted-foreground">
                  <span>📍 {req.room.building} - {req.room.roomNumber}</span>
                  <span>👤 {req.submittedBy.fullName}</span>
                  <span>🕐 {new Date(req.submittedAt).toLocaleDateString()}</span>
                  {req.assignedTo && <span>🔧 {req.assignedTo.fullName}</span>}
                </div>
                {req.resolutionNotes && (
                  <p className="text-xs text-success/80 mt-2 italic">✓ {req.resolutionNotes}</p>
                )}
              </div>
              <Badge className={cn("text-[10px] shrink-0",
                req.priority === 'High' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                req.priority === 'Medium' ? 'bg-warning/20 text-warning border-warning/30' :
                'bg-success/20 text-success border-success/30'
              )} variant="outline">{req.priority}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenancePage;
