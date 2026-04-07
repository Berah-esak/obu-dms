import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Package, Armchair, Key, Shirt, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const InventoryPage = () => {
  const [furniture, setFurniture] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('furniture');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    roomId: '',
    itemName: 'Bed',
    quantity: 1,
    condition: 'Good',
  });

  useEffect(() => {
    const loadFurniture = async () => {
      try {
        const result = await apiService.getRoomFurniture('BLK-A-101');
        if (result.success && result.data?.items) {
          setFurniture(result.data.items);
        }
      } catch (error) {
        console.error('Failed to load furniture:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFurniture();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const result = await apiService.updateFurnitureItem(editingItem.id, {
          quantity: formData.quantity,
          condition: formData.condition,
        });
        if (result.success) {
          toast.success('Furniture item updated successfully');
          setFurniture(furniture.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
        }
      } else {
        const result = await apiService.addFurnitureItem(formData);
        if (result.success && result.data) {
          toast.success('Furniture item added successfully');
          setFurniture([...furniture, result.data]);
        }
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ roomId: '', itemName: 'Bed', quantity: 1, condition: 'Good' });
    } catch (error) {
      toast.error(editingItem ? 'Failed to update furniture' : 'Failed to add furniture');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this furniture item?')) {
      try {
        const result = await apiService.updateFurnitureItem(id, { quantity: 0, condition: 'Missing' });
        if (result.success) {
          toast.success('Furniture item updated');
          setFurniture(furniture.filter(item => item.id !== id));
        }
      } catch (error) {
        toast.error('Failed to delete furniture item');
      }
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
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" /> Inventory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track furniture, linen, and keys</p>
      </div>

      <Tabs defaultValue="furniture" className="space-y-4">
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

        <TabsContent value="furniture">
          <Card className="glass rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Furniture Inventory</CardTitle>
              <Button size="sm" className="h-8 text-xs" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
                <Plus className="w-3 h-3 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Room</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Item</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Quantity</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Condition</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {furniture.map((item) => (
                      <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3 text-sm font-mono text-primary">{item.roomId}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{item.itemName}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{item.quantity}</td>
                        <td className="px-5 py-3">
                          <Badge variant="outline" className={cn("text-[10px]",
                            item.condition === 'Good' ? 'border-success/30 text-success' :
                            item.condition === 'Fair' ? 'border-warning/30 text-warning' :
                            item.condition === 'Damaged' ? 'border-destructive/30 text-destructive' :
                            'border-muted-foreground/30 text-muted-foreground'
                          )}>
                            {item.condition}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10" onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linen">
          <Card className="glass rounded-xl p-8 text-center">
            <Shirt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Linen tracking records will appear here</p>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card className="glass rounded-xl p-8 text-center">
            <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Key tracking records will appear here</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Furniture Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingItem ? 'Edit Furniture Item' : 'Add Furniture Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Room ID</Label>
              <Input value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} placeholder="Enter room ID" className="bg-secondary/40 border-white/5" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Item Name</Label>
              <Select value={formData.itemName} onValueChange={(val) => setFormData({ ...formData, itemName: val })}>
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
                <Input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Condition</Label>
                <Select value={formData.condition} onValueChange={(val) => setFormData({ ...formData, condition: val })}>
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
