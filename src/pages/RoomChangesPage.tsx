import { mockRoomChangeRequests } from '@/lib/mock-data';
import { ArrowRightLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const RoomChangesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'dorm_admin' || user?.role === 'system_admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-primary" /> Room Changes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? 'Review and manage room change requests' : 'Track your room change requests'}
          </p>
        </div>
        {!isAdmin && (
          <Button className="gradient-primary text-primary-foreground h-9 text-sm">
            Request Room Change
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {mockRoomChangeRequests.map((req) => (
          <div key={req.id} className="glass rounded-xl p-5 animate-slide-up hover:shadow-glow transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                  req.status === 'approved' ? 'bg-success/10' : req.status === 'rejected' ? 'bg-destructive/10' : 'bg-warning/10'
                )}>
                  {req.status === 'approved' ? <CheckCircle2 className="w-5 h-5 text-success" /> :
                   req.status === 'rejected' ? <XCircle className="w-5 h-5 text-destructive" /> :
                   <Clock className="w-5 h-5 text-warning" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{req.student.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{req.student.department} • Year {req.student.year}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded-md text-foreground">{req.currentRoom.roomId}</span>
                    <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground italic">Pending assignment</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{req.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Submitted {new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className={cn("text-[10px]",
                  req.status === 'approved' ? 'border-success/30 text-success' :
                  req.status === 'rejected' ? 'border-destructive/30 text-destructive' :
                  'border-warning/30 text-warning'
                )}>
                  {req.status}
                </Badge>
                <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground capitalize">{req.reason}</Badge>
                {isAdmin && req.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs border-success/30 text-success hover:bg-success/10">Approve</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10">Reject</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomChangesPage;
