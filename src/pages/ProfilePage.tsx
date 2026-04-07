import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  User, Mail, Phone, Building, GraduationCap, 
  Camera, ShieldCheck, MapPin, Calendar, 
  Cpu, Activity, Globe, Save, Fingerprint,
  Lock, BookOpen, HeartPulse, Wrench, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // READ ONLY (UNIVERSITY CORE)
    fullName: user?.fullName || 'Alemu Bekele',
    email: user?.email || 'alemu.bekele@obu.edu.et',
    phone: '0912345678',
    department: 'Computer Science',
    year: '3',
    studentId: 'OBU/1024/15',
    gender: 'Male',
    dormBlock: 'Block A',
    roomNumber: '402',
    
    // CUSTOMIZABLE (STUDENT CONTROLLED)
    bio: 'Pioneering new ways to bridge the gap between dorm life and academic excellence. Cyber-core enthusiast.',
    emergencyContactName: 'Mulugeta Bekele',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '0987654321',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        toast.success('Biometric profile updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Syncing with central core...',
        success: 'Profile custom data encrypted and saved.',
        error: 'Data transmission failed.',
      }
    );
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Column: Visual Identity & Maintenance Shortcut */}
        <div className="w-full xl:w-96 space-y-6">
          <div className="glass rounded-3xl p-8 border border-primary/20 relative overflow-hidden group shadow-glow">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all"></div>
            
            {/* Profile Picture */}
            <div className="relative mx-auto w-40 h-40 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '12s' }}></div>
              <div className="absolute inset-2 rounded-full border border-primary/10 ring-1 ring-primary/20"></div>
              
              <div className="absolute inset-4 rounded-full overflow-hidden bg-secondary/50 border border-primary/10 group/img flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                ) : (
                  <User className="w-16 h-16 text-primary/40" />
                )}
                
                <div 
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Update</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight">{formData.fullName}</h2>
              <p className="text-primary font-mono text-xs uppercase tracking-[0.2em]">{formData.studentId}</p>
              <div className="flex justify-center gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">Resident</Badge>
                <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> System Verified
                </Badge>
              </div>
            </div>

            {/* Micro HUD */}
            <div className="mt-8 pt-6 border-t border-primary/10 grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Core Status</p>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-mono text-foreground font-bold italic">HEALTHY</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Security Pin</p>
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono text-foreground font-bold">SHA-256</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Maintenance Quick Action Tool */}
          <div className="glass p-6 rounded-3xl border border-warning/10 relative overflow-hidden group cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/maintenance')}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors"></div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="p-3 rounded-2xl bg-warning/10 border border-warning/20">
                  <Wrench className="w-6 h-6 text-warning" />
               </div>
               <div className="flex-1">
                  <h3 className="text-sm font-bold leading-tight">Operational Support</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Report Room Anomaly</p>
               </div>
               <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-warning group-hover:translate-x-1 transition-all" />
            </div>
          </div>
          
          {/* HUD Info Box */}
          <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Core Sync Telemetry
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">University Core Link</span>
                 <span className="text-emerald-400 font-mono font-bold tracking-tighter uppercase">ESTABLISHED</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 w-[94%] animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identity Modules */}
        <div className="flex-1 space-y-6 w-full">
          <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Globe className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold">Oda Bultum Identity Core</h2>
                    <p className="text-xs text-muted-foreground">Central database synchronization & personal customization</p>
                 </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "border-primary/20 hover:bg-primary/10 transition-all font-bold uppercase tracking-widest text-[10px] h-10 px-6",
                  isEditing ? "bg-primary/20 text-primary" : "text-muted-foreground"
                )}
              >
                {isEditing ? 'Cancel Edit' : 'Personalize Identity'}
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-10">
              {/* SECTION: Locked Academic Core */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                   <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                     <GraduationCap className="w-4 h-4" /> University Core Records (Locked)
                   </h3>
                   <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                      <Lock className="w-3 h-3" /> Synced from ODE-BASE
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Full Identity Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input 
                        disabled
                        value={formData.fullName} 
                        className="pl-10 bg-secondary/10 border-white/5 h-11 cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Assigned Department</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input 
                          disabled
                          value={formData.department} 
                          className="pl-10 bg-secondary/10 border-white/5 h-11 cursor-not-allowed text-muted-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Current Level (Year)</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input 
                          disabled
                          value={formData.year} 
                          className="pl-10 bg-secondary/10 border-white/5 h-11 cursor-not-allowed text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Protocol Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input 
                        disabled
                        value={formData.email} 
                        className="pl-10 bg-secondary/10 border-white/5 h-11 cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Mobile Link (University System)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input 
                        disabled
                        value={formData.phone} 
                        className="pl-10 bg-secondary/10 border-white/5 h-11 cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Student Controlled HUD */}
              <div className="space-y-8 pt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* PERSONAL HUD */}
                    <div className="space-y-6">
                       <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                         <BookOpen className="w-4 h-4" /> Personal Narrative HUD
                       </h3>
                       <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Identity Statement (Bio)</Label>
                          <Textarea 
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                            className="bg-secondary/30 border-white/5 min-h-[120px] focus:border-emerald-500/40 focus:ring-emerald-500/10 transition-all resize-none italic"
                            placeholder="State your operational goals..."
                          />
                       </div>
                    </div>

                    {/* EMERGENCY NODE */}
                    <div className="space-y-6">
                       <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2 border-b border-primary/10 pb-2">
                         <HeartPulse className="w-4 h-4" /> Life-Support Liaison (Emergency)
                       </h3>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Emergency Liaison Name</Label>
                            <Input 
                              disabled={!isEditing}
                              value={formData.emergencyContactName}
                              onChange={e => setFormData({...formData, emergencyContactName: e.target.value})}
                              className="bg-secondary/30 border-white/5 h-11 focus:border-primary/40 focus:ring-primary/10 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Relationship</Label>
                                <Input 
                                  disabled={!isEditing}
                                  value={formData.emergencyContactRelation}
                                  onChange={e => setFormData({...formData, emergencyContactRelation: e.target.value})}
                                  className="bg-secondary/30 border-white/5 h-11 focus:border-primary/40 focus:ring-primary/10 transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Emergency Comms Link</Label>
                                <Input 
                                  disabled={!isEditing}
                                  value={formData.emergencyContactPhone}
                                  onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})}
                                  className="bg-secondary/30 border-white/5 h-11 focus:border-primary/40 focus:ring-primary/10 transition-all"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {isEditing && (
                <div className="pt-8 flex justify-center animate-slide-up">
                  <Button type="submit" className="gradient-primary px-12 h-14 shadow-glow text-primary-foreground font-bold uppercase tracking-[0.2em] gap-3">
                    <Save className="w-6 h-6" /> Commit Protocol Synchronization
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


const Badge = ({ children, variant = "default", className }: { children: React.ReactNode, variant?: "default" | "outline", className?: string }) => (
  <span className={cn(
    "px-2 py-0.5 rounded text-[10px] font-bold border",
    variant === "outline" ? "border-primary/20 text-primary" : "bg-primary text-white",
    className
  )}>
    {children}
  </span>
);
