import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiService } from '@/lib/api';
import { Package, Armchair, Key, Shirt, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FurnitureCondition = 'Good' | 'Fair' | 'Damaged' | 'Missing';

type RoomOption = {
  id: string;
  label: string;
};

type FurnitureRow = {
  id: string;
  roomId: string;
  itemName: string;
  quantity: number;
  condition: FurnitureCondition;
};

type MissingKeyRow = {
  id: string;
  keyCode: string;
  studentName: string;
  roomLabel: string;
  issuedAt?: string;
};

type LinenForm = {
  studentId: string;
  itemsCsv: string;
};

type KeyForm = {
  studentId: string;
  roomId: string;
  keyCode: string;
};

const mapRoomLabel = (room: { roomNumber?: string; floor?: number; building?: string; dormId?: { name?: string } | string }) => {
  const building = typeof room.dormId === 'object' ? room.dormId?.name : room.building;
  return `${building || 'Building'}-${room.roomNumber || 'Room'} (Floor ${room.floor || 1})`;
};

const InventoryPage = () => {
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [furniture, setFurniture] = useState<FurnitureRow[]>([]);
  const [missingKeys, setMissingKeys] = useState<MissingKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('furniture');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FurnitureRow | null>(null);

  const [furnitureForm, setFurnitureForm] = useState({
    roomId: '',
    itemName: 'Bed',
    quantity: 1,
    condition: 'Good' as FurnitureCondition,
  });

  const [linenForm, setLinenForm] = useState<LinenForm>({ studentId: '', itemsCsv: '' });
  const [keyForm, setKeyForm] = useState<KeyForm>({ studentId: '', roomId: '', keyCode: '' });

  const loadRooms = useCallback(async () => {
    const roomsRes = await apiService.getRooms();
    if (roomsRes.success && roomsRes.data?.rooms) {
      const options = roomsRes.data.rooms.map((room) => ({
        id: room.roomId || (room as unknown as { id?: string; _id?: string }).id || (room as unknown as { _id?: string })._id || '',
        label: mapRoomLabel(room),
      })).filter((room) => room.id);

      setRooms(options);
      setSelectedRoomId((prev) => prev || options[0]?.id || '');
      setFurnitureForm((prev) => ({ ...prev, roomId: prev.roomId || options[0]?.id || '' }));
      setKeyForm((prev) => ({ ...prev, roomId: prev.roomId || options[0]?.id || '' }));
    }
  }, []);

  const loadFurniture = useCallback(async (roomId: string) => {
    if (!roomId) {
      setFurniture([]);
      return;
    }

    const furnitureRes = await apiService.getRoomFurniture(roomId);
    if (furnitureRes.success && furnitureRes.data?.items) {
      const rows = furnitureRes.data.items.map((item) => ({
        id: item.id,
        roomId: item.roomId,
        itemName: item.itemName,
        quantity: item.quantity,
        condition: item.condition,
      }));
      setFurniture(rows);
      return;
    }

    setFurniture([]);
  }, []);

  const loadMissingKeys = useCallback(async () => {
    const result = await apiService.getMissingKeys();
    if (result.success && result.data?.missingKeys) {
      const rows = result.data.missingKeys.map((k) => ({
        id: k.id,
        keyCode: k.keyCode,
        studentName: k.student?.fullName || k.student?.studentId || 'Unknown',
        roomLabel: `${k.room?.building || 'Building'}-${k.room?.roomNumber || 'Room'}`,
        issuedAt: k.dateIssued,
      }));
      setMissingKeys(rows);
      return;
    }

    setMissingKeys([]);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await loadRooms();
    setLoading(false);
  }, [loadRooms]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    loadFurniture(selectedRoomId);
  }, [selectedRoomId, loadFurniture]);

  useEffect(() => {
    if (activeTab === 'keys') {
      loadMissingKeys();
    }
  }, [activeTab, loadMissingKeys]);

  const selectedRoomLabel = useMemo(() => rooms.find((r) => r.id === selectedRoomId)?.label || 'No room selected', [rooms, selectedRoomId]);

  const handleSaveFurniture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!furnitureForm.roomId) {
      toast.error('Please select a room');
      return;
    }

    if (editingItem) {
      const result = await apiService.updateFurnitureItem(editingItem.id, {
        quantity: furnitureForm.quantity,
        condition: furnitureForm.condition,
      });

      if (result.success) {
        toast.success('Furniture item updated successfully');
        await loadFurniture(selectedRoomId);
        setIsModalOpen(false);
        setEditingItem(null);
        return;
      }

      toast.error(result.error || 'Failed to update furniture item');
      return;
    }

    const result = await apiService.addFurnitureItem(furnitureForm);
    if (result.success) {
      toast.success('Furniture item added successfully');
      await loadFurniture(selectedRoomId);
      setIsModalOpen(false);
      setEditingItem(null);
      setFurnitureForm((prev) => ({ ...prev, itemName: 'Bed', quantity: 1, condition: 'Good' }));
      return;
    }

    toast.error(result.error || 'Failed to add furniture item');
  };

  const handleMarkMissing = async (id: string) => {
    const result = await apiService.updateFurnitureItem(id, { condition: 'Missing' });
    if (result.success) {
      toast.success('Furniture marked as missing');
      await loadFurniture(selectedRoomId);
      return;
    }

    toast.error(result.error || 'Failed to update furniture item');
  };

  const handleIssueLinen = async (e: React.FormEvent) => {
    e.preventDefault();

    const items = linenForm.itemsCsv.split(',').map((v) => v.trim()).filter(Boolean);
    if (!linenForm.studentId || items.length === 0) {
      toast.error('Provide student ID and at least one linen item');
      return;
    }

    const result = await apiService.issueLinen({
      studentId: linenForm.studentId,
      items,
      dateIssued: new Date().toISOString(),
    });

    if (result.success) {
      toast.success('Linen issued successfully');
      setLinenForm({ studentId: '', itemsCsv: '' });
      return;
    }

    toast.error(result.error || 'Failed to issue linen');
  };

  const handleIssueKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyForm.studentId || !keyForm.roomId || !keyForm.keyCode) {
      toast.error('Student ID, room, and key code are required');
      return;
    }

    const result = await apiService.issueKey(keyForm);
    if (result.success) {
      toast.success('Key issued successfully');
      setKeyForm((prev) => ({ ...prev, studentId: '', keyCode: '' }));
      await loadMissingKeys();
      return;
    }

    toast.error(result.error || 'Failed to issue key');
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
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" /> Inventory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track furniture, linen, and keys</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary/30 border border-border/30">
          <TabsTrigger value="furniture" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Armchair className="w-4 h-4 mr-1.5" /> Furniture
          </TabsTrigger>
          <TabsTrigger value="linen" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Shirt className="w-4 h-4 mr-1.5" /> Linen
          </TabsTrigger>
          <TabsTrigger value="keys" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Key className="w-4 h-4 mr-1.5" /> Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="furniture" className="space-y-4">
          <Card className="glass rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room</Label>
              <Select value={selectedRoomId} onValueChange={(value) => {
                setSelectedRoomId(value);
                setFurnitureForm((prev) => ({ ...prev, roomId: value }));
              }}>
                <SelectTrigger className="w-[360px] bg-secondary/30 border-border/30 h-9 text-sm">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>{room.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setEditingItem(null);
                  setFurnitureForm((prev) => ({ ...prev, roomId: selectedRoomId || prev.roomId }));
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Item
              </Button>
            </div>
          </Card>

          <Card className="glass rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Furniture Inventory • {selectedRoomLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Item</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Quantity</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Condition</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {furniture.map((item) => (
                      <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3 text-sm text-foreground">{item.itemName}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{item.quantity}</td>
                        <td className="px-5 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              item.condition === 'Good'
                                ? 'border-success/30 text-success'
                                : item.condition === 'Fair'
                                ? 'border-warning/30 text-warning'
                                : item.condition === 'Damaged'
                                ? 'border-destructive/30 text-destructive'
                                : 'border-muted-foreground/30 text-muted-foreground'
                            )}
                          >
                            {item.condition}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                              onClick={() => {
                                setEditingItem(item);
                                setFurnitureForm({
                                  roomId: item.roomId,
                                  itemName: item.itemName,
                                  quantity: item.quantity,
                                  condition: item.condition,
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleMarkMissing(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {furniture.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No furniture records for this room yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linen">
          <Card className="glass rounded-xl p-6 max-w-xl">
            <h3 className="text-sm font-semibold text-foreground mb-4">Issue Linen</h3>
            <form onSubmit={handleIssueLinen} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Student ID</Label>
                <Input value={linenForm.studentId} onChange={(e) => setLinenForm((prev) => ({ ...prev, studentId: e.target.value }))} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Items (comma separated)</Label>
                <Input
                  value={linenForm.itemsCsv}
                  onChange={(e) => setLinenForm((prev) => ({ ...prev, itemsCsv: e.target.value }))}
                  placeholder="Bedsheet, Pillowcase, Blanket"
                  className="bg-secondary/40 border-white/5"
                />
              </div>
              <Button type="submit" className="gradient-primary text-primary-foreground">Issue Linen</Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card className="glass rounded-xl p-6 max-w-xl">
            <h3 className="text-sm font-semibold text-foreground mb-4">Issue Key</h3>
            <form onSubmit={handleIssueKey} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Student ID</Label>
                <Input value={keyForm.studentId} onChange={(e) => setKeyForm((prev) => ({ ...prev, studentId: e.target.value }))} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room</Label>
                <Select value={keyForm.roomId} onValueChange={(value) => setKeyForm((prev) => ({ ...prev, roomId: value }))}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>{room.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Key Code</Label>
                <Input value={keyForm.keyCode} onChange={(e) => setKeyForm((prev) => ({ ...prev, keyCode: e.target.value }))} className="bg-secondary/40 border-white/5" />
              </div>
              <Button type="submit" className="gradient-primary text-primary-foreground">Issue Key</Button>
            </form>
          </Card>

          <Card className="glass rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Missing Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {missingKeys.map((key) => (
                  <div key={key.id} className="rounded-lg border border-border/30 bg-secondary/20 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{key.keyCode} • {key.roomLabel}</p>
                      <p className="text-xs text-muted-foreground">Student: {key.studentName}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{key.issuedAt ? new Date(key.issuedAt).toLocaleDateString() : ''}</span>
                  </div>
                ))}
                {missingKeys.length === 0 && <p className="text-sm text-muted-foreground">No missing keys right now.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingItem ? 'Edit Furniture Item' : 'Add Furniture Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveFurniture} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room</Label>
              <Select value={furnitureForm.roomId} onValueChange={(value) => setFurnitureForm((prev) => ({ ...prev, roomId: value }))}>
                <SelectTrigger className="bg-secondary/40 border-white/5">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>{room.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Item Name</Label>
              <Select value={furnitureForm.itemName} onValueChange={(value) => setFurnitureForm((prev) => ({ ...prev, itemName: value }))}>
                <SelectTrigger className="bg-secondary/40 border-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bed">Bed</SelectItem>
                  <SelectItem value="Mattress">Mattress</SelectItem>
                  <SelectItem value="Desk">Desk</SelectItem>
                  <SelectItem value="Chair">Chair</SelectItem>
                  <SelectItem value="Wardrobe">Wardrobe</SelectItem>
                  <SelectItem value="Shelf">Shelf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Quantity</Label>
                <Input type="number" min={0} value={furnitureForm.quantity} onChange={(e) => setFurnitureForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Condition</Label>
                <Select value={furnitureForm.condition} onValueChange={(value) => setFurnitureForm((prev) => ({ ...prev, condition: value as FurnitureCondition }))}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="gradient-primary text-primary-foreground">Save Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
