import { useState } from "react";
import { Plus, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ExitRequestFormProps {
  onSuccess?: () => void;
}

export function ExitRequestForm({ onSuccess }: ExitRequestFormProps) {
  const [items, setItems] = useState<string[]>([""]);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter(item => item.trim() !== "");
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for exit",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.submitExitRequest({
        items: validItems,
        reason: reason.trim(),
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Exit request submitted successfully",
        });
        setItems([""]);
        setReason("");
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to submit exit request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <LogOut className="w-4 h-4 text-primary" /> Request Exit Clearance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">
              Items Carrying
            </label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder="e.g., Laptop, Backpack, Books"
                    className="flex-1"
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="mt-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Item
            </Button>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">
              Reason for Exit
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for leaving the dormitory..."
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Exit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
