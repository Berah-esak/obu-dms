import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { DoorOpen, Search, Filter, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [dorms, setDorms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const [formData, setFormData] = useState({
    roomId: '',
    building: '',
    floor: 1,
    roomNumber: '',
    type: 'Double',
    capacity: 4,
    status: 'Available',
    genderRestriction: 'Male',
  });

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const [roomsRes, dormsRes] = await Promise.all([
          apiService.getRooms(),
          apiService.getDorms(),
        ]);
        if (roomsRes.success && roomsRes.data?.rooms) {
          setRooms(roomsRes.data.rooms);
        }
        if (dormsRes.success && dormsRes.data?.buildings) {
          setDorms(dormsRes.data.buildings);
        }
      } catch (error) {
        console.error('Failed to load rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const filtered = rooms.filter(r => {
    if (search && !r.roomId?.toLowerCase().includes(search.toLowerCase()) && !r.building?.toLowerCase().includes(search.toLowerCase())) return false;
    if (buildingFilter !== 'all' && r.building !== buildingFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const result = await apiService.updateRoom(editingRoom.roomId, formData);
        if (result.success) {
          toast.success('Room updated successfully');
          setRooms(rooms.map(r => r.roomId === editingRoom.roomId ? { ...r, ...formData } : r));
        }
      } else {
        const result = await apiService.createRoom(formData);
        if (result.success && result.data) {
          toast.success('Room created successfully');
          setRooms([...rooms, result.data]);
        }
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({ roomId: '', building: '', floor: 1, roomNumber: '', type: 'Double', capacity: 4, status: 'Available', genderRestriction: 'Male' });
    } catch (error) {
      toast.error(editingRoom ? 'Failed to update room' : 'Failed to create room');
    }
  };

  const handleDelete = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const result = await apiService.updateRoom(roomId, { status: 'Under Maintenance' });
        if (result.success) {
          toast.success('Room marked as maintenance');
          setRooms(rooms.filter(r => r.roomId !== roomId));
        }
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const buildings = Array.from(new Set(rooms.map(r => r.building))).sort();

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
            <DoorOpen className="w-6 h-6 text-primary" /> Room Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{rooms.length} rooms across {dorms.length} buildings</p>
        </div>
        <Button className="gradient-primary text-primary-foreground h-9 text-sm" onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Room
        </Button>
      </div>

      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger className="w-48 bg-secondary/30 border-border/30 h-9 text-sm">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {buildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Under Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((room) => (
          <Card key={room.roomId} className="glass rounded-xl p-4 hover:shadow-glow transition-all duration-300 group animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">{room.roomId}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary hover:bg-primary/10" onClick={() => { setEditingRoom(room); setFormData(room); setIsModalOpen(true); }}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(room.roomId)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Building</span>
                <span className="text-foreground">{room.building}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Floor</span>
                <span className="text-foreground">{room.floor}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">{room.type}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Gender</span>
                <span className="text-foreground">{room.genderRestriction}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="text-foreground">{room.currentOccupancy || 0}/{room.capacity}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all",
                      room.currentOccupancy === room.capacity ? "bg-destructive" :
                      room.currentOccupancy === 0 ? "bg-success" : "bg-primary"
                    )}
                    style={{ width: `${((room.currentOccupancy || 0) / room.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Room Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room ID</Label>
                <Input value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} required className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Building</Label>
                <Input value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })} required className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Floor</Label>
                <Input type="number" value={formData.floor} onChange={e => setFormData({ ...formData, floor: parseInt(e.target.value) })} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room Number</Label>
                <Input value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Capacity</Label>
                <Input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Gender Restriction</Label>
                <Select value={formData.genderRestriction} onValueChange={(val) => setFormData({ ...formData, genderRestriction: val })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="gradient-primary text-primary-foreground">Save Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
