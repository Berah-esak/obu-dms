import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Users, Plus, Search, Shield, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'dorm_admin',
    studentId: '',
    tempPassword: true,
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await apiService.getUsers();
        if (result.success && result.data?.users) {
          setUsers(result.data.users);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filtered = users.filter(u => {
    if (search && !u.fullName?.toLowerCase().includes(search.toLowerCase()) && !u.username?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const result = await apiService.updateUser(editingUser.id, formData);
        if (result.success) {
          toast.success('User updated successfully');
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        }
      } else {
        const result = await apiService.createUser({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          studentId: formData.studentId || undefined,
          tempPassword: formData.tempPassword,
        });
        if (result.success && result.data) {
          toast.success('User created successfully');
          setUsers([...users, result.data]);
        }
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', role: 'dorm_admin', studentId: '', tempPassword: true });
    } catch (error) {
      toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const result = await apiService.deactivateUser(id);
      if (result.success) {
        toast.success('User deactivated successfully');
        setUsers(users.map(u => u.id === id ? { ...u, status: 'inactive' } : u));
      }
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      const result = await apiService.reactivateUser(id);
      if (result.success) {
        toast.success('User reactivated successfully');
        setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
      }
    } catch (error) {
      toast.error('Failed to reactivate user');
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const result = await apiService.resetUserPassword(id);
      if (result.success) {
        toast.success('Password reset link sent');
      }
    } catch (error) {
      toast.error('Failed to send password reset link');
    }
  };

  const roleColors: Record<string, string> = {
    system_admin: 'border-destructive/30 text-destructive',
    dorm_admin: 'border-primary/30 text-primary',
    maintenance: 'border-warning/30 text-warning',
    management: 'border-info/30 text-info',
    student: 'border-success/30 text-success',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
        </div>
        <Button className="gradient-primary text-primary-foreground h-9 text-sm" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-secondary/30 border-border/30 h-9 text-sm">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="dorm_admin">Dorm Admin</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="system_admin">System Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border/30 h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Username</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Last Login</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {u.fullName?.split(' ').map(n => n[0]).join('')}
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
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10" onClick={() => { setEditingUser(u); setFormData(u); setIsModalOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {u.status === 'active' ? (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-warning hover:bg-warning/10" onClick={() => handleDeactivate(u.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-success hover:bg-success/10" onClick={() => handleReactivate(u.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/10" onClick={() => handleResetPassword(u.id)}>
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Full Name</Label>
              <Input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required className="bg-secondary/40 border-white/5" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="bg-secondary/40 border-white/5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Role</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="dorm_admin">Dorm Admin</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="system_admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Student ID (Optional)</Label>
                <Input value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="tempPassword" checked={formData.tempPassword} onChange={e => setFormData({ ...formData, tempPassword: e.target.checked })} className="rounded border-border/30 bg-secondary/30" />
              <Label htmlFor="tempPassword" className="text-sm text-muted-foreground">Generate temporary password</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="gradient-primary text-primary-foreground">Save User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
