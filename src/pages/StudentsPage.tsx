import { mockStudents } from '@/lib/mock-data';
import { Users, Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const StudentsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = mockStudents.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> Student Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{mockStudents.length} registered students</p>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID or department..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/30 border-border/30 h-9 text-sm" />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Student</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">ID</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Department</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Year</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Gender</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.studentId} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {s.fullName.split(' ').map(n => n[0]).join('')}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
