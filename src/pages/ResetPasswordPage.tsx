import { useMemo, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { apiService } from '@/lib/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token.trim()) {
      setError('Reset token is required.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await apiService.resetPassword(token.trim(), newPassword);
    setLoading(false);

    if (result.success) {
      setMessage(result.data?.message || 'Password reset successful. You can sign in now.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    setError(result.error || 'Failed to reset password.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" onClick={() => navigate('/login')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-3">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Provide your reset token and new password.</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-foreground/80 text-sm">Reset Token</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste reset token"
                className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground/80 text-sm">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {message && <p className="text-success text-sm">{message}</p>}
            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" disabled={loading || !token || !newPassword} className="w-full h-11 gradient-primary text-primary-foreground font-semibold">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
