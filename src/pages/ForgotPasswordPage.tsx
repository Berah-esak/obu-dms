import { useState } from 'react';
import { ArrowLeft, Building2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { apiService } from '@/lib/api';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await apiService.forgotPassword(identifier.trim());
    setLoading(false);

    if (result.success) {
      setMessage(result.data?.message || 'If the account exists, a reset link has been sent.');
      return;
    }

    setError(result.error || 'Failed to send reset link.');
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
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your university email or phone number to request a reset link.</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-foreground/80 text-sm">University Email or Phone</Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name.surname@odu.edu.et or +251..."
                  className="pl-3 bg-secondary/50 border-border/50 focus:border-primary/50 h-11"
                  required
                />
              </div>
            </div>

            {message && <p className="text-success text-sm">{message}</p>}
            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" disabled={loading || !identifier} className="w-full h-11 gradient-primary text-primary-foreground font-semibold">
              {loading ? 'Submitting...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
