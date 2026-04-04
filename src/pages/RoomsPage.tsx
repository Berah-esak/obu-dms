import { useState } from 'react';
import { mockRooms, mockDorms } from '@/lib/mock-data';
import { DoorOpen, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RoomsPage = () => {
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockRooms.filter(r => {
    if (search && !r.roomId.toLowerCase().includes(search.toLowerCase()) && !r.building.toLowerCase().includes(search.toLowerCase())) return false;
    if (buildingFilter !== 'all' && r.building !== buildingFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-primary" /> Room Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{mockRooms.length} rooms across {mockDorms.length} buildings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
        </div>
        <Select value={buildingFilter} onValueChange={setBuildingFilter}>
          <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Building" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Buildings</SelectItem>
            {mockDorms.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
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

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((room) => (
          <div key={room.roomId} className="glass rounded-xl p-4 hover:shadow-glow transition-all duration-300 group animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">{room.roomId}</h3>
              <Badge variant="outline" className={cn("text-[10px]",
                room.status === 'Available' ? 'border-success/30 text-success' :
                room.status === 'Occupied' ? 'border-primary/30 text-primary' :
                'border-warning/30 text-warning'
              )}>
                {room.status}
              </Badge>
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
              {/* Occupancy bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="text-foreground">{room.currentOccupancy}/{room.capacity}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all",
                      room.currentOccupancy === room.capacity ? "bg-destructive" :
                      room.currentOccupancy === 0 ? "bg-success" : "bg-primary"
                    )}
                    style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
