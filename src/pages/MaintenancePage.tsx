import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench, Search, Plus, Camera, Send, AlertCircle, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiService } from '@/lib/api';
import type { MaintenanceRequest } from '@/types/api';

const MaintenancePage = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['dorm_admin', 'system_admin']);
  const isMaint = hasRole(['maintenance']);
  const isStudent = hasRole(['student']);

  const [requests, setRequests] = useState<any[]>([]);
  const [studentAssignment, setStudentAssignment] = useState<any>(null);
  const [dormBlocks, setDormBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const [newForm, setNewForm] = useState({ 
    category: '', 
    priority: '', 
    description: '', 
    image: null as File | null, 
    imagePreview: '',
    dormBlockId: '',
    roomId: '' 
  });
  const [statusForm, setStatusForm] = useState({ status: '', resolutionNotes: '' });
  const [approveForm, setApproveForm] = useState({ notes: '' });
  const [rejectForm, setRejectForm] = useState({ reason: '' });

  const refresh = async () => {
    if (isStudent) {
      // Students see their own maintenance requests
      const result = await apiService.getStudentMaintenanceRequests();
      if (result.success && result.data) {
        setRequests((result.data as any).requests || []);
      }
    } else if (isMaint) {
      // Maintenance staff see assigned tasks
      const result = await apiService.getMyMaintenanceTasks();
      if (result.success && result.data) {
        setRequests((result.data as any).tasks || []);
      }
    } else if (isAdmin) {
      // Admins see pending requests
      const result = await apiService.getMaintenanceRequests({});
      if (result.success && result.data) {
        setRequests((result.data as any).requests || []);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Load student's room assignment if student
      if (isStudent) {
        const assignmentResult = await apiService.getStudentAssignment();
        if (assignmentResult.success && assignmentResult.data) {
          setStudentAssignment(assignmentResult.data);
          // Pre-fill roomId for students
          setNewForm(f => ({ ...f, roomId: assignmentResult.data.room || '' }));
        }
      }
      
      // Load dorm blocks for admins
      if (isAdmin) {
        const dormsResult = await apiService.getDorms();
        if (dormsResult.success && dormsResult.data) {
          setDormBlocks(dormsResult.data.buildings || []);
        }
      }
      
      await refresh();
    };
    
    loadData();
  }, [user?.role]);

  const filtered = requests.filter(r => {
    if (search && !r.description?.toLowerCase().includes(search.toLowerCase()) && !r.requestId?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newForm.category || !newForm.priority || !newForm.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // For students, use their assigned room
    let roomId = newForm.roomId;
    if (isStudent) {
      if (!studentAssignment?.room) {
        toast.error('You do not have a room assignment. Please contact administration.');
        return;
      }
      roomId = studentAssignment.room;
    } else if (isAdmin) {
      // For admins, require dorm block and room selection
      if (!newForm.dormBlockId) {
        toast.error('Please select a dorm block.');
        return;
      }
      if (!newForm.roomId) {
        toast.error('Please select a room.');
        return;
      }
    }

    const result = await apiService.submitMaintenanceRequest({
      roomId,
      dormBlockId: newForm.dormBlockId,
      category: newForm.category,
      description: newForm.description,
      priority: newForm.priority,
      image: newForm.image || undefined,
    });

    if (result.success) {
      toast.success('Maintenance request submitted successfully.');
      setIsNewOpen(false);
      setNewForm({ category: '', priority: '', description: '', image: null, imagePreview: '', dormBlockId: '', roomId: '' });
      await refresh();
      return;
    }

    toast.error(result.error || 'Failed to submit request.');
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusForm.status) { toast.error('Select a status.'); return; }
    const result = await apiService.updateMaintenanceStatus(selectedReq.id, statusForm.status, statusForm.resolutionNotes);
    if (result.success) {
      toast.success('Status updated successfully.');
      setIsStatusOpen(false);
      setStatusForm({ status: '', resolutionNotes: '' });
      await refresh();
      return;
    }

    toast.error(result.error || 'Failed to update status.');
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await apiService.approveMaintenanceRequest(selectedReq.id, approveForm.notes);
    if (result.success) {
      toast.success('Maintenance request approved.');
      setIsApproveOpen(false);
      setApproveForm({ notes: '' });
      await refresh();
      return;
    }

    toast.error(result.error || 'Failed to approve request.');
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectForm.reason.trim()) { 
      toast.error('Please provide a rejection reason.'); 
      return; 
    }
    const result = await apiService.rejectMaintenanceRequest(selectedReq.id, rejectForm.reason);
    if (result.success) {
      toast.success('Maintenance request rejected.');
      setIsRejectOpen(false);
      setRejectForm({ reason: '' });
      await refresh();
      return;
    }

    toast.error(result.error || 'Failed to reject request.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewForm(f => ({ ...f, image: file, imagePreview: reader.result as string }));
      reader.readAsDataURL(file);
      toast.info('Image attached.');
    }
  };

  const handleDormBlockChange = async (dormBlockId: string) => {
    setNewForm(f => ({ ...f, dormBlockId, roomId: '' }));
    setRooms([]);
    
    if (dormBlockId) {
      const roomsResult = await apiService.getRooms({ building: dormBlockId });
      if (roomsResult.success && roomsResult.data) {
        setRooms(roomsResult.data.rooms || []);
      }
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending' || r.status === 'Submitted').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" /> Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin 
              ? `${pendingCount} pending request${pendingCount !== 1 ? 's' : ''} awaiting review`
              : `${filtered.length} request${filtered.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        {(isStudent || isAdmin) && (
          <Button onClick={() => setIsNewOpen(true)} className="gradient-primary text-primary-foreground h-10 shadow-glow">
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
              <Filter className="w-3 h-3 mr-1" /><SelectValue placeholder="Status" />
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
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="glass rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wrench className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">No maintenance requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <Card key={req.id} className="glass rounded-xl hover:border-primary/30 hover:shadow-glow transition-all animate-slide-up relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={cn('w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
                    req.priority === 'High' ? 'bg-destructive animate-pulse' :
                    req.priority === 'Medium' ? 'bg-warning' : 'bg-success'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{req.requestId}</span>
                      <Badge variant="outline" className={cn('text-[8px] font-bold uppercase',
                        req.status === 'Completed' ? 'border-success/30 text-success bg-success/5' :
                        req.status === 'In Progress' ? 'border-warning/30 text-warning bg-warning/5' :
                        req.status === 'Rejected' ? 'border-destructive/30 text-destructive bg-destructive/5' :
                        'border-primary/30 text-primary bg-primary/5'
                      )}>{req.status}</Badge>
                      <Badge variant="outline" className="text-[8px] font-bold uppercase border-border/30 text-muted-foreground">{req.category}</Badge>
                      <Badge variant="outline" className={cn('text-[8px] font-bold uppercase',
                        req.priority === 'High' ? 'border-destructive/30 text-destructive' :
                        req.priority === 'Medium' ? 'border-warning/30 text-warning' :
                        'border-success/30 text-success'
                      )}>{req.priority}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{req.description}</p>
                    <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-mono uppercase">
                      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {req.room?.roomNumber || req.room?.roomId || req.roomId || 'N/A'}</span>
                      <span>👤 {req.submittedBy?.fullName?.split(' ')[0] || 'Unknown'}</span>
                      <span>🕐 {new Date(req.submittedAt).toLocaleDateString()}</span>
                      {req.trackingNumber && <span className="text-primary">#{req.trackingNumber}</span>}
                    </div>
                    {req.resolutionNotes && (
                      <div className="mt-2 p-2 rounded-lg bg-success/5 border border-success/10">
                        <p className="text-[11px] text-success">✓ {req.resolutionNotes}</p>
                      </div>
                    )}
                    {req.rejectionReason && (
                      <div className="mt-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                        <p className="text-[11px] text-destructive">✗ Rejected: {req.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {isAdmin && (req.status === 'pending' || req.status === 'Submitted') && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 text-xs border-success/30 text-success hover:bg-success/10"
                          onClick={() => { setSelectedReq(req); setIsApproveOpen(true); }}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={() => { setSelectedReq(req); setIsRejectOpen(true); }}>
                          <XCircle className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {(isAdmin || isMaint) && req.status !== 'Completed' && req.status !== 'Rejected' && req.status !== 'rejected' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => { setSelectedReq(req); setStatusForm({ status: req.status, resolutionNotes: req.resolutionNotes || '' }); setIsStatusOpen(true); }}>
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="glass border-primary/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" /> New Maintenance Request
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {isStudent && studentAssignment && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
                <p className="text-xs text-muted-foreground mb-1">Your Room</p>
                <p className="font-semibold text-foreground">
                  {studentAssignment.roomDetails?.roomNumber || 'Room assigned'}
                </p>
                {studentAssignment.roomDetails && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {studentAssignment.roomDetails.type} • {studentAssignment.roomDetails.currentOccupancy}/{studentAssignment.roomDetails.capacity} occupied
                  </p>
                )}
              </div>
            )}
            
            {isAdmin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Dorm Block *</Label>
                  <Select value={newForm.dormBlockId} onValueChange={handleDormBlockChange}>
                    <SelectTrigger className="bg-secondary/40 border-white/5"><SelectValue placeholder="Select dorm block..." /></SelectTrigger>
                    <SelectContent>
                      {dormBlocks.map(dorm => (
                        <SelectItem key={dorm.id} value={dorm.id}>{dorm.name} ({dorm.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room *</Label>
                  <Select 
                    value={newForm.roomId} 
                    onValueChange={v => setNewForm(f => ({ ...f, roomId: v }))}
                    disabled={!newForm.dormBlockId}
                  >
                    <SelectTrigger className="bg-secondary/40 border-white/5">
                      <SelectValue placeholder={newForm.dormBlockId ? "Select room..." : "Select dorm block first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.roomNumber} ({room.type}, {room.currentOccupancy}/{room.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Category *</Label>
                <Select value={newForm.category} onValueChange={v => setNewForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-secondary/40 border-white/5"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {['Plumbing', 'Electrical', 'Furniture', 'Sanitation', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Priority *</Label>
                <Select value={newForm.priority} onValueChange={v => setNewForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger className="bg-secondary/40 border-white/5"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Description *</Label>
              <Textarea value={newForm.description} onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail..." className="bg-secondary/40 border-white/5 min-h-[90px] resize-none" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Photo (optional)</Label>
              <div className={cn('w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all',
                newForm.imagePreview ? 'border-primary/40 bg-primary/5' : 'border-white/10 bg-secondary/20 hover:border-primary/20'
              )} onClick={() => document.getElementById('maint-img')?.click()}>
                {newForm.imagePreview
                  ? <img src={newForm.imagePreview} alt="preview" className="h-full object-contain rounded-lg" />
                  : <><Camera className="w-6 h-6 text-primary/40 mb-1" /><span className="text-[10px] text-muted-foreground uppercase tracking-widest">Attach Image</span></>
                }
              </div>
              <input id="maint-img" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary text-primary-foreground">
                <Send className="w-4 h-4 mr-1" /> Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="glass border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStatusUpdate} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-secondary/30 border border-white/5 text-sm">
              <p className="font-mono text-primary text-xs">{selectedReq?.requestId}</p>
              <p className="text-foreground mt-1">{selectedReq?.description}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">New Status</Label>
              <Select value={statusForm.status} onValueChange={v => setStatusForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="bg-secondary/40 border-white/5"><SelectValue placeholder="Select status..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Resolution Notes</Label>
              <Textarea value={statusForm.resolutionNotes} onChange={e => setStatusForm(f => ({ ...f, resolutionNotes: e.target.value }))} className="bg-secondary/40 border-white/5 min-h-[70px] resize-none" placeholder="Optional notes..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary text-primary-foreground">Save Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="glass border-success/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" /> Approve Maintenance Request
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApprove} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-secondary/30 border border-white/5 text-sm">
              <p className="font-mono text-primary text-xs mb-1">{selectedReq?.requestId}</p>
              <p className="text-xs text-muted-foreground mb-1">
                Room: {selectedReq?.room?.roomNumber || selectedReq?.room?.roomId || selectedReq?.roomId || 'N/A'}
              </p>
              <p className="text-foreground">{selectedReq?.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-[8px]">{selectedReq?.category}</Badge>
                <Badge variant="outline" className="text-[8px]">{selectedReq?.priority} Priority</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Admin Notes (Optional)</Label>
              <Textarea
                value={approveForm.notes}
                onChange={e => setApproveForm({ notes: e.target.value })}
                className="bg-secondary/40 border-white/5 min-h-[70px] resize-none"
                placeholder="Add any notes about the approval..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-success text-white hover:bg-success/90">Confirm Approval</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="glass border-destructive/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" /> Reject Maintenance Request
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-secondary/30 border border-white/5 text-sm">
              <p className="font-mono text-primary text-xs mb-1">{selectedReq?.requestId}</p>
              <p className="text-xs text-muted-foreground mb-1">
                Room: {selectedReq?.room?.roomNumber || selectedReq?.room?.roomId || selectedReq?.roomId || 'N/A'}
              </p>
              <p className="text-foreground">{selectedReq?.description}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Rejection Reason *</Label>
              <Textarea
                value={rejectForm.reason}
                onChange={e => setRejectForm({ reason: e.target.value })}
                className="bg-secondary/40 border-white/5 min-h-[80px] resize-none"
                placeholder="Explain why this request is being rejected..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive">Confirm Rejection</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenancePage;
