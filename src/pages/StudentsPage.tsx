import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Users, Search, GraduationCap, Plus, Filter, Download, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: 'M',
    department: 'Computer Science',
    year: 1,
    phone: '',
    email: '',
  });

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const result = await apiService.getStudentDirectoryReport();
        if (result.success && result.data?.students) {
          setStudents(result.data.students);
        }
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const filtered = students.filter(s =>
    s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (departmentFilter !== 'all' && filtered.filter(s => s.department === departmentFilter).length > 0) {
    return filtered.filter(s => s.department === departmentFilter);
  }
  if (yearFilter !== 'all' && filtered.filter(s => s.year === parseInt(yearFilter)).length > 0) {
    return filtered.filter(s => s.year === parseInt(yearFilter));
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const result = await apiService.updateUser(editingStudent.id, formData);
        if (result.success) {
          toast.success('Student updated successfully');
          setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
        }
      } else {
        const result = await apiService.createUser({
          fullName: formData.fullName,
          email: formData.email,
          role: 'student',
          studentId: formData.studentId,
        });
        if (result.success && result.data) {
          toast.success('Student created successfully');
          setStudents([...students, result.data]);
        }
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ studentId: '', fullName: '', gender: 'M', department: 'Computer Science', year: 1, phone: '', email: '' });
    } catch (error) {
      toast.error(editingStudent ? 'Failed to update student' : 'Failed to create student');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const result = await apiService.deactivateUser(id);
        if (result.success) {
          toast.success('Student deactivated successfully');
          setStudents(students.filter(s => s.id !== id));
        }
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleExport = async () => {
    try {
      const result = await apiService.exportReport('student_directory', 'xlsx', {
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
      });
      if (result.success && result.data?.fileUrl) {
        toast.success('Report exported successfully');
        window.open(result.data.fileUrl, '_blank');
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const departments = Array.from(new Set(students.map(s => s.department))).sort();

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
            <Users className="w-6 h-6 text-primary" /> Student Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{students.length} registered students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/10" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button className="gradient-primary text-primary-foreground h-9 text-sm" onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Student
          </Button>
        </div>
      </div>

      <Card className="glass rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID or department..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48 bg-secondary/30 border-border/30 h-9 text-sm">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border/30 h-9 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {[1, 2, 3, 4, 5].map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Department</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Year</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Gender</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id || s.studentId} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {s.fullName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{s.studentId}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-foreground">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      {s.department}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">Year {s.year}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{s.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{s.phone}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10" onClick={() => { setEditingStudent(s); setFormData(s); setIsModalOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Student Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Student ID</Label>
                <Input value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} required className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Full Name</Label>
                <Input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Gender</Label>
                <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Year</Label>
                <Select value={formData.year.toString()} onValueChange={(val) => setFormData({ ...formData, year: parseInt(val) })}>
                  <SelectTrigger className="bg-secondary/40 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Department</Label>
              <Input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="bg-secondary/40 border-white/5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="bg-secondary/40 border-white/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-secondary/40 border-white/5" />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="gradient-primary text-primary-foreground">Save Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
