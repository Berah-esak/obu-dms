import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Building2, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { apiService } from '@/lib/api';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    gender: 'M',
    department: '',
    year: 1,
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await apiService.registerStudent({
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      email: regForm.email,
      phone: regForm.phone,
      studentId: regForm.studentId,
      gender: regForm.gender,
      department: regForm.department,
      year: Number(regForm.year),
      password: regForm.password,
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Registration successful! You can now log in.");
      setIsRegistering(false);
      setUsername(regForm.email.split('@')[0]);
      setPassword('');
      setRegForm({
        firstName: '', lastName: '', email: '', phone: '', studentId: '',
        gender: 'M', department: '', year: 1, password: '', confirmPassword: ''
      });
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const demoAccounts = [
    { label: 'Admin', user: 'admin', pass: 'admin' },
    { label: 'Dorm Admin', user: 'dormadmin', pass: 'admin' },
    { label: 'Student', user: 'student', pass: 'student' },
    { label: 'Maintenance', user: 'maintenance', pass: 'maint' },
    { label: 'Management', user: 'management', pass: 'mgmt' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden animate-scanline transition-colors duration-500 py-10">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-info/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="absolute top-6 left-6 z-10 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="absolute top-6 right-6 z-10 animate-fade-in">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-xl px-4 animate-scale-in z-20">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex-shrink-0 w-16 h-16 mb-4 mx-auto">
            <img src="/logo.png" alt="OBU Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">OBU Dormitory</h1>
          <p className="text-muted-foreground text-sm mt-1">Management System</p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl shadow-card overflow-hidden transition-all duration-500">
          <div className="flex">
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isRegistering ? 'gradient-primary text-primary-foreground' : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => { setIsRegistering(false); setError(''); setSuccessMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${isRegistering ? 'gradient-primary text-primary-foreground' : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }}
            >
              Student Register
            </button>
          </div>

          <div className="p-8">
            {!isRegistering ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                {successMsg && <p className="text-success text-sm bg-success/10 p-2 rounded-lg text-center font-medium border border-success/20">{successMsg}</p>}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground/80 text-sm">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/80 text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-sm animate-fade-in">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="w-full h-11 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <button type="button" onClick={() => navigate('/forgot-password')} className="text-primary/70 hover:text-primary text-sm transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">First Name</Label>
                    <Input value={regForm.firstName} onChange={e => setRegForm({ ...regForm, firstName: e.target.value })} className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Last Name</Label>
                    <Input value={regForm.lastName} onChange={e => setRegForm({ ...regForm, lastName: e.target.value })} className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">University Email</Label>
                    <Input type="email" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder="name@odu.edu.et" className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Phone Number</Label>
                    <Input type="tel" value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} placeholder="09..." className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Student ID</Label>
                    <Input value={regForm.studentId} onChange={e => setRegForm({ ...regForm, studentId: e.target.value })} className="bg-secondary/50 h-10 text-sm uppercase" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Department</Label>
                    <Input value={regForm.department} onChange={e => setRegForm({ ...regForm, department: e.target.value })} className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Gender</Label>
                    <Select value={regForm.gender} onValueChange={v => setRegForm({ ...regForm, gender: v })}>
                      <SelectTrigger className="bg-secondary/50 h-10 text-sm border-border/50">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Year of Study</Label>
                    <Input type="number" min="1" max="6" value={regForm.year} onChange={e => setRegForm({ ...regForm, year: parseInt(e.target.value) || 1 })} className="bg-secondary/50 h-10 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Password</Label>
                    <Input type="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} className="bg-secondary/50 h-10 text-sm" required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground/80">Confirm Password</Label>
                    <Input type="password" value={regForm.confirmPassword} onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })} className="bg-secondary/50 h-10 text-sm" required minLength={6} />
                  </div>
                </div>

                {error && <p className="text-destructive text-sm animate-fade-in mt-2">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Create Student Account
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>



      </div>
    </div>
  );
};

export default LoginPage;
