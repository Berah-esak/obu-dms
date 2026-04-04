import { mockUsers } from '@/lib/mock-data';
import { Users, Plus, Search, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const UserManagementPage = () => {
  const [search, setSearch] = useState('');
  const filtered = mockUsers.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    system_admin: 'border-destructive/30 text-destructive',
    dorm_admin: 'border-primary/30 text-primary',
    maintenance: 'border-warning/30 text-warning',
    management: 'border-info/30 text-info',
    student: 'border-success/30 text-success',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{mockUsers.length} registered users</p>
        </div>
        <Button className="gradient-primary text-primary-foreground h-9 text-sm">
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">User</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Username</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Role</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {u.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.fullName}</p>
                      <p className="text-[10px] text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{u.username}</td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px] capitalize", roleColors[u.role] || '')}>
                    {u.role.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={cn("text-[10px]",
                    u.status === 'active' ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'
                  )}>
                    {u.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
