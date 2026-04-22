import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiService } from '@/lib/api';
import { CheckCircle2, XCircle, Clock, Eye, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExitRequest {
  id: string;
  studentId: string;
  studentName: string;
  dormBlockId: string;
  roomId: string;
  items: string[];
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Verified';
  verificationCode?: string;
  verificationCodeStatus?: 'Active' | 'Used';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface ExitRequestApprovalProps {
  refreshTrigger?: number;
}

export function ExitRequestApproval({ refreshTrigger = 0 }: ExitRequestApprovalProps) {
  const [requests, setRequests] = useState<ExitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ExitRequest | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[EXIT APPROVAL] Loading pending requests...');
      
      const response = await apiService.getPendingExitRequests();
      console.log('[EXIT APPROVAL] API Response:', response);
      
      if (response.success && response.data?.requests) {
        setRequests(response.data.requests as unknown as ExitRequest[]);
        console.log('[EXIT APPROVAL] Loaded requests:', response.data.requests.length);
      } else {
        console.error('[EXIT APPROVAL] Failed to load requests:', response.error);
        setError(response.error || 'Failed to load requests');
      }
    } catch (error: unknown) {
      console.error('[EXIT APPROVAL] Error loading requests:', error);
      setError((error as Error)?.message || 'Network error');
      toast({
        title: 'Error',
        description: (error as Error)?.message || 'Failed to load exit requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRequests();
  }, [refreshTrigger, loadRequests]);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!processing && !loading) {
        console.log('[EXIT APPROVAL] Auto-refreshing requests...');
        loadRequests();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [processing, loading, loadRequests]);

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      console.log('[EXIT APPROVAL] Approving request:', selectedRequest.id);
      
      const response = await apiService.approveExitRequest(selectedRequest.id);
      console.log('[EXIT APPROVAL] Approve response:', response);
      
      if (response.success) {
        toast({
          title: 'Request Approved',
          description: 'Exit request approved successfully.',
        });
        setShowApproveDialog(false);
        setSelectedRequest(null);
        loadRequests(); // Refresh the list
      } else {
        throw new Error(response.error || 'Failed to approve request');
      }
    } catch (error: unknown) {
      console.error('[EXIT APPROVAL] Approve error:', error);
      toast({
        title: 'Error',
        description: (error as Error)?.message || 'Failed to approve request',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      console.log('[EXIT APPROVAL] Rejecting request:', selectedRequest.id, 'Reason:', rejectionReason);
      
      const response = await apiService.rejectExitRequest(selectedRequest.id, rejectionReason);
      console.log('[EXIT APPROVAL] Reject response:', response);
      
      if (response.success) {
        toast({
          title: 'Request Rejected',
          description: 'Exit request has been rejected',
        });
        setShowRejectDialog(false);
        setSelectedRequest(null);
        setRejectionReason('');
        loadRequests(); // Refresh the list
      } else {
        throw new Error(response.error || 'Failed to reject request');
      }
    } catch (error: unknown) {
      console.error('[EXIT APPROVAL] Reject error:', error);
      toast({
        title: 'Error',
        description: (error as Error)?.message || 'Failed to reject request',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: 'Copied',
      description: 'Verification code copied to clipboard',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'border-warning/30 text-warning bg-warning/10';
      case 'Approved':
        return 'border-success/30 text-success bg-success/10';
      case 'Rejected':
        return 'border-destructive/30 text-destructive bg-destructive/10';
      case 'Verified':
        return 'border-primary/30 text-primary bg-primary/10';
      default:
        return 'border-muted/30 text-muted-foreground bg-muted/10';
    }
  };

  if (loading) {
    return (
      <Card className="glass border-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning animate-spin" /> Loading Exit Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading pending requests...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-destructive" /> Exit Requests Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-3">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadRequests}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="glass border-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Exit Requests
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadRequests}
              className="ml-auto h-6 w-6 p-0 hover:bg-primary/10"
              title="Refresh"
            >
              <Clock className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            No pending exit requests
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass border-warning/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" /> Pending Exit Requests
            <Badge className="bg-warning text-warning-foreground text-[9px] px-1.5">
              {requests.length}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadRequests}
              disabled={loading}
              className="ml-auto h-6 w-6 p-0 hover:bg-primary/10"
              title="Refresh"
            >
              <Clock className={cn("w-3 h-3", loading && "animate-spin")} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-3 rounded-xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{request.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    Room: {request.roomId} • {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={cn('text-[9px] shrink-0', getStatusColor(request.status))}>
                  {request.status}
                </Badge>
              </div>

              {request.reason && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  Reason: {request.reason}
                </p>
              )}

              {request.items && request.items.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {request.items.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
                    >
                      {item}
                    </span>
                  ))}
                  {request.items.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/10 border border-muted/20 text-muted-foreground">
                      +{request.items.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs flex-1 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetailsDialog(true);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" /> Details
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs flex-1 bg-success hover:bg-success/90 text-white"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowApproveDialog(true);
                  }}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowRejectDialog(true);
                  }}
                >
                  <XCircle className="w-3 h-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Exit Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this exit request? A verification code will be generated.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedRequest.studentName}</p>
                <p className="text-xs text-muted-foreground">Room: {selectedRequest.roomId}</p>
              </div>
              {selectedRequest.reason && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Reason:</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.reason}</p>
                </div>
              )}
              {selectedRequest.items && selectedRequest.items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Items:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedRequest.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-white"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? 'Approving...' : 'Approve Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Exit Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this exit request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedRequest.studentName}</p>
                <p className="text-xs text-muted-foreground">Room: {selectedRequest.roomId}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Rejection Reason *
                </label>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Student</p>
                  <p className="text-sm text-foreground">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Status</p>
                  <Badge className={cn('text-[9px]', getStatusColor(selectedRequest.status))}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Room</p>
                  <p className="text-sm text-foreground">{selectedRequest.roomId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Dorm Block</p>
                  <p className="text-sm text-foreground">{selectedRequest.dormBlockId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Submitted</p>
                  <p className="text-sm text-foreground">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedRequest.reason && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm text-foreground">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.items && selectedRequest.items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Items Carrying</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.verificationCode && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-xs font-semibold text-success mb-2">Verification Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-lg font-mono font-bold text-success">
                      {selectedRequest.verificationCode}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-success/30 text-success hover:bg-success/10"
                      onClick={() => copyToClipboard(selectedRequest.verificationCode!)}
                    >
                      {copiedCode === selectedRequest.verificationCode ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-semibold text-destructive mb-1">Rejection Reason</p>
                  <p className="text-sm text-destructive">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
