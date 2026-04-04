import { mockFurniture, mockRooms } from '@/lib/mock-data';
import { Package, Armchair, Key, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InventoryPage = () => {
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
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Room</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Item</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Quantity</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Condition</th>
                </tr>
              </thead>
              <tbody>
                {mockFurniture.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-primary">{item.roomId}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{item.itemName}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{item.quantity}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={cn("text-[10px]",
                        item.condition === 'Good' ? 'border-success/30 text-success' :
                        item.condition === 'Fair' ? 'border-warning/30 text-warning' :
                        'border-destructive/30 text-destructive'
                      )}>
                        {item.condition}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="linen">
          <div className="glass rounded-xl p-8 text-center">
            <Shirt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Linen tracking records will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="keys">
          <div className="glass rounded-xl p-8 text-center">
            <Key className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Key tracking records will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
