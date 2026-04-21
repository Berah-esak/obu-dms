import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, Shield, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ExitRequest {
  id: string;
  items: string[];
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Verified";
  verificationCode?: string;
  rejectionReason?: string;
  submittedAt: string;
  approvedAt?: string;
  verifiedAt?: string;
}

interface ExitRequestListProps {
  refreshTrigger?: number;
}

export function ExitRequestList({ refreshTrigger }: ExitRequestListProps) {
  const [requests, setRequests] = useState<ExitRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getMyExitRequests({ limit: 10 });
      if (response.success && response.data) {
        setRequests(response.data.requests || []);
      }
    } catch (error) {
      console.error("Failed to load exit requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [refreshTrigger]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Verification code copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="border-warning/30 text-warning text-[9px]">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge variant="outline" className="border-success/30 text-success text-[9px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="outline" className="border-destructive/30 text-destructive text-[9px]">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      case "Verified":
        return (
          <Badge variant="outline" className="border-primary/30 text-primary text-[9px]">
            <Shield className="w-3 h-3 mr-1" /> Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="glass border-white/5">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Loading exit requests...
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="glass border-white/5">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          No exit requests yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/5">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> My Exit Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className="p-3 rounded-xl bg-secondary/30 border border-white/5 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {new Date(request.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-foreground mt-1">
                  <span className="font-semibold">Items:</span> {request.items.join(", ")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {request.reason}
                </p>
              </div>
              {getStatusBadge(request.status)}
            </div>

            {/* Verification Code Display */}
            {request.status === "Approved" && request.verificationCode && (
              <div className="mt-2 p-2 rounded-lg bg-success/10 border border-success/20">
                <p className="text-[10px] text-success font-semibold uppercase tracking-wider mb-1">
                  Verification Code
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-success tracking-widest">
                    {request.verificationCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(request.verificationCode!)}
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Show this code at the gate
                </p>
              </div>
            )}

            {/* Rejection Reason */}
            {request.status === "Rejected" && request.rejectionReason && (
              <div className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-[10px] text-destructive font-semibold uppercase tracking-wider mb-1">
                  Rejection Reason
                </p>
                <p className="text-xs text-destructive">{request.rejectionReason}</p>
              </div>
            )}

            {/* Verified Status */}
            {request.status === "Verified" && request.verifiedAt && (
              <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-[10px] text-primary font-semibold">
                  ✓ Verified on {new Date(request.verifiedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
