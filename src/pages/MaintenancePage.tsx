import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Wrench, Search, Plus, X, Camera, Send, AlertCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MaintenancePage = () => {
  const { hasRole } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);

  const [newRequest, setNewRequest] = useState({
    roomId: '',
    category: '',
    priority: '',
    description: '',
    image: null as File | null
  });

  const [statusForm, setStatusForm] = useState({
    status: 'Submitted',
    resolutionNotes: ''
  });

  useEffect(() => {
    const loadRequests = async () => {
      try {
        let result;
        if (hasRole(['maintenance'])) {
          result = await apiService.getMyMaintenanceTasks();
        } else {
          result = await apiService.getMaintenanceRequests();
        }
        if (result.success && result.data?.requests) {
          setRequests(result.data.requests);
        }
      } catch (error) {
        console.error('Failed to load maintenance requests:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [hasRole]);

  const filtered = requests.filter(r => {
    if (search && !r.description?.toLowerCase().includes(search.toLowerCase()) && !r.requestId?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.category || !newRequest.priority || !newRequest.description || !newRequest.roomId) {
      toast.error('Please complete all protocol fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('roomId', newRequest.roomId);
      formData.append('category', newRequest.category);
      formData.append('description', newRequest.description);
      formData.append('priority', newRequest.priority);
      if (newRequest.image) formData.append('image', newRequest.image);

      const result = await apiService.submitMaintenanceRequest({
        roomId: newRequest.roomId,
        category: newRequest.category,
        description: newRequest.description,
        priority: newRequest.priority,
        image: newRequest.image || undefined
      });

      if (result.success && result.data) {
        toast.success('Maintenance protocol initiated. Tracking number: ' + result.data.requestId);
        setRequests([result.data, ...requests]);
        setIsModalOpen(false);
        setNewRequest({ roomId: '', category: '', priority: '', description: '', image: null });
      }
    } catch (error) {
      toast.error('Failed to submit maintenance request');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewRequest(prev => ({ ...prev, image: file }));
      toast.info('Visual data attached.');
    }
  };

  const handleStatusUpdate = async (requestId: string) => {
    try {
      const result = await apiService.updateMaintenanceStatus(requestId, statusForm.status, statusForm.resolutionNotes);
      if (result.success) {
        toast.success('Status updated successfully');
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: statusForm.status, resolutionNotes: statusForm.resolutionNotes } : r));
        setIsStatusModalOpen(false);
        setStatusForm({ status: 'Submitted', resolutionNotes: '' });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

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
    <div className="space-y-6 animate-fade-in relative transition-colors duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" /> Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage maintenance requests</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gradient-primary text-primary-foreground h-10 px-4 text-sm font-bold shadow-glow hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all">
          <Plus className="w-4 h-4 mr-2" /> New Protocol
        </Button>
      </div>

      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search system logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-10 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border/30 h-10 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((req) => (
          <Card key={req.id} className="glass rounded-xl p-5 hover:border-primary/30 hover:shadow-glow transition-all duration-300 animate-slide-up relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className={cn("w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(var(--bg),0.5)]",
                req.priority === 'High' ? 'bg-destructive animate-pulse' : req.priority === 'Medium' ? 'bg-warning' : 'bg-success'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">{req.requestId}</span>
                  <Badge variant="outline" className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5",
                    req.status === 'Completed' ? 'border-success/30 text-success bg-success/5' :
                    req.status === 'In Progress' ? 'border-warning/30 text-warning bg-warning/5' :
                    req.status === 'Rejected' ? 'border-destructive/30 text-destructive bg-destructive/5' :
                    'border-primary/30 text-primary bg-primary/5'
                  )}>{req.status}</Badge>
                  <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-border/30 text-muted-foreground bg-secondary/20">{req.category}</Badge>
                </div>
                <p className="text-sm text-foreground font-medium mb-3">{req.description}</p>
                <div className="flex flex-wrap gap-5 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> {req.room?.building} - {req.room?.roomNumber}</span>
                  <span className="flex items-center gap-1.5">👤 {req.submittedBy?.fullName?.split(' ')[0]}</span>
                  <span className="flex items-center gap-1.5">🕐 {new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
                {req.resolutionNotes && (
                  <div className="mt-3 p-2.5 rounded-lg bg-success/5 border border-success/10">
                    <p className="text-[11px] text-success font-medium">System Note: {req.resolutionNotes}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={cn("text-[9px] font-bold uppercase tracking-tighter shrink-0",
                  req.priority === 'High' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                  req.priority === 'Medium' ? 'bg-warning/20 text-warning border-warning/30' :
                  'bg-success/20 text-success border-success/30'
                )} variant="outline">{req.priority}</Badge>
                {hasRole(['maintenance', 'dorm_admin', 'system_admin']) && (
                  <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10" onClick={() => { setEditingRequest(req); setStatusForm({ status: req.status, resolutionNotes: req.resolutionNotes || '' }); setIsStatusModalOpen(true); }}>
                    Update Status
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Maintenance Protocol</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">Room Assignment</Label>
                <Input value={newRequest.roomId} onChange={e => setNewRequest({...newRequest, roomId: e.target.value})} placeholder="Enter room ID" className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">Issue Category</Label>
                <Select value={newRequest.category} onValueChange={(val) => setNewRequest({...newRequest, category: val})}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue placeholder="Identify..." />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">Operational Priority</Label>
              <div className="grid grid-cols-3 gap-3">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewRequest({...newRequest, priority: p})}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      newRequest.priority === p
                        ? "bg-primary/20 border-primary text-primary shadow-glow"
                        : "bg-secondary/40 border-white/5 text-muted-foreground hover:bg-secondary/60"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">Technical Description</Label>
              <Textarea
                placeholder="Provide detailed anomaly coordinates..."
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                className="bg-secondary/40 border-white/5 min-h-[100px] focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">Visual Evidence (Optional)</Label>
              <div className="relative group/upload">
                <div
                  className={cn(
                    "w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer",
                    newRequest.image ? "border-primary/40 bg-primary/5" : "border-white/5 bg-secondary/20 hover:border-primary/20 hover:bg-secondary/40"
                  )}
                  onClick={() => document.getElementById('maintenance-img')?.click()}
                >
                  {newRequest.image ? (
                    <div className="w-full h-full p-2 relative">
                      <span className="text-xs text-primary font-medium truncate block">{newRequest.image.name}</span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 bg-black/40 rounded-xl transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-primary/40 mb-2" />
                      <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Attach Image File</span>
                    </>
                  )}
                </div>
                <input id="maintenance-img" type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="pt-4">
              <Button disabled={!newRequest.category || !newRequest.priority || !newRequest.description || !newRequest.roomId} className="w-full gradient-primary h-12 shadow-glow text-primary-foreground font-bold uppercase tracking-[0.2em] gap-3">
                <Send className="w-5 h-5" /> Execute Protocol
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Maintenance Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Current Status</Label>
              <Badge variant="outline" className="text-sm">{editingRequest?.status}</Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">New Status</Label>
              <Select value={statusForm.status} onValueChange={(val) => setStatusForm({...statusForm, status: val})}>
                <SelectTrigger className="bg-secondary/40 border-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Resolution Notes</Label>
              <Textarea
                value={statusForm.resolutionNotes}
                onChange={(e) => setStatusForm({...statusForm, resolutionNotes: e.target.value})}
                className="bg-secondary/40 border-white/5 min-h-[80px]"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => handleStatusUpdate(editingRequest?.id)} className="gradient-primary text-primary-foreground">Update Status</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenancePage;
