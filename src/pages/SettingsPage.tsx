import { useEffect, useState } from 'react';
import { Settings, Save, Shield, Bell, DoorOpen, Wrench, Users, RefreshCw, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiService } from '@/lib/api';
import type { SystemSettings } from '@/lib/api';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      'relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none',
      checked ? 'bg-primary shadow-glow' : 'bg-secondary border border-border/50'
    )}
  >
    <span className={cn(
      'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300',
      checked ? 'translate-x-5' : 'translate-x-0'
    )} />
  </button>
);

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="glass border-white/5">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">{children}</CardContent>
  </Card>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <Label className="text-sm text-foreground flex-1">{label}</Label>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: '',
    adminEmail: '',
    sessionTimeout: 30,
    allowStudentRoomChange: true,
    requireApprovalForMaintenance: false,
    maxRoomChangeRequestsPerStudent: 2,
    notificationsEnabled: true,
    maintenanceAutoAssign: false,
    theme: 'dark',
    language: 'en',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await apiService.getSettings();
      if (result.success && result.data) {
        setSettings(result.data);
      }
    };

    load();
  }, []);

  const set = (key: string, value: any) => setSettings((s: any) => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaving(true);
    apiService.saveSettings(settings).then((result) => {
      if (result.success) {
        toast.success('Settings saved successfully.');
      } else {
        toast.error(result.error || 'Failed to save settings.');
      }
      setSaving(false);
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset system settings to defaults? This cannot be undone.')) {
      const defaults = {
        systemName: 'OBU Dormitory Management System',
        adminEmail: 'admin@obu.edu.et',
        sessionTimeout: 30,
        allowStudentRoomChange: true,
        requireApprovalForMaintenance: false,
        maxRoomChangeRequestsPerStudent: 2,
        notificationsEnabled: true,
        maintenanceAutoAssign: false,
        theme: 'dark',
        language: 'en',
      } satisfies SystemSettings;

      setSettings(defaults);
      apiService.saveSettings(defaults);
      toast.success('Settings reset to defaults.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> System Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configure system behaviour and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground shadow-glow h-9">
          {saving ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Save Changes
        </Button>
      </div>

      {/* General */}
      <Section icon={Globe} title="General">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">System Name</Label>
          <Input value={settings.systemName} onChange={e => set('systemName', e.target.value)} className="bg-secondary/40 border-white/5" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Admin Email</Label>
          <Input type="email" value={settings.adminEmail} onChange={e => set('adminEmail', e.target.value)} className="bg-secondary/40 border-white/5" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Language</Label>
          <Select value={settings.language} onValueChange={v => set('language', v)}>
            <SelectTrigger className="bg-secondary/40 border-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
              <SelectItem value="om">Afan Oromo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security & Sessions">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Session Timeout (minutes)</Label>
          <Input type="number" min={5} max={120} value={settings.sessionTimeout} onChange={e => set('sessionTimeout', parseInt(e.target.value))} className="bg-secondary/40 border-white/5 w-32" />
        </div>
      </Section>

      {/* Room Changes */}
      <Section icon={DoorOpen} title="Room Change Requests">
        <Field label="Allow students to submit room change requests">
          <Toggle checked={settings.allowStudentRoomChange} onChange={v => set('allowStudentRoomChange', v)} />
        </Field>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Max requests per student per semester</Label>
          <Input type="number" min={1} max={10} value={settings.maxRoomChangeRequestsPerStudent} onChange={e => set('maxRoomChangeRequestsPerStudent', parseInt(e.target.value))} className="bg-secondary/40 border-white/5 w-32" />
        </div>
      </Section>

      {/* Maintenance */}
      <Section icon={Wrench} title="Maintenance">
        <Field label="Require admin approval before assigning maintenance">
          <Toggle checked={settings.requireApprovalForMaintenance} onChange={v => set('requireApprovalForMaintenance', v)} />
        </Field>
        <Field label="Auto-assign maintenance to available staff">
          <Toggle checked={settings.maintenanceAutoAssign} onChange={v => set('maintenanceAutoAssign', v)} />
        </Field>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <Field label="Enable in-app notifications">
          <Toggle checked={settings.notificationsEnabled} onChange={v => set('notificationsEnabled', v)} />
        </Field>
      </Section>

      {/* Danger Zone */}
      <Section icon={Database} title="Data Management">
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-3">
          <p className="text-sm font-semibold text-destructive">Danger Zone</p>
            <p className="text-xs text-muted-foreground">Reset the persisted system settings back to defaults. This action cannot be undone.</p>
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 h-9 text-sm" onClick={handleReset}>
            Reset All Local Data
          </Button>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-foreground">Storage Mode: Backend</p>
            <p className="text-[10px] text-muted-foreground">System preferences are read from and saved to the backend via <code className="text-primary">VITE_API_URL</code>.</p>
          </div>
          <Badge variant="outline" className="ml-auto border-emerald-400/30 text-emerald-400 text-[10px]">LIVE</Badge>
        </div>
      </Section>
    </div>
  );
}
