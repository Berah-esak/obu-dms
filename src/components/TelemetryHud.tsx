// import { Activity, Cpu, Globe, Zap } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useTheme } from "next-themes";

// export function TelemetryHud() {
//   const { theme } = useTheme();
//   const [latency, setLatency] = useState(4);
//   const [activeNodes, setActiveNodes] = useState(124);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLatency(prev => Math.max(2, Math.min(10, prev + (Math.random() - 0.5))));
//       setActiveNodes(prev => Math.max(120, Math.min(130, prev + (Math.random() > 0.5 ? 1 : -1))));
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   if (theme !== "light") return null;

//   return (
//     <div className="hidden lg:flex absolute left-[-160px] top-1/2 -translate-y-1/2 flex-col gap-4 w-64 animate-fade-in pointer-events-none select-none z-20">
//       <div className="glass p-4 rounded-xl border-primary/20 shadow-glow relative overflow-hidden group">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
//         <div className="flex items-center gap-2 mb-3">
//           <Activity className="w-4 h-4 text-primary animate-pulse" />
//           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">System Telemetry</span>
//         </div>
        
//         {/* Animated Waveform */}
//         <div className="h-16 flex items-end gap-[2px] mb-4 overflow-hidden border-b border-primary/10 pb-1">
//           {Array.from({ length: 32 }).map((_, i) => (
//             <div
//               key={i}
//               className="w-[3px] bg-primary/40 rounded-full animate-bounce"
//               style={{
//                 height: `${20 + Math.random() * 80}%`,
//                 animationDelay: `${i * 0.05}s`,
//                 animationDuration: `${1 + Math.random()}s`
//               }}
//             ></div>
//           ))}
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div className="flex flex-col">
//             <span className="text-[8px] text-muted-foreground uppercase">Latency</span>
//             <span className="text-xs font-mono font-bold text-primary">{latency.toFixed(1)}ms</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-[8px] text-muted-foreground uppercase">Nodes</span>
//             <span className="text-xs font-mono font-bold text-primary">{activeNodes}</span>
//           </div>
//         </div>
//       </div>

//       <div className="glass p-3 rounded-xl border-info/20 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
//         <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
//             <Globe className="w-4 h-4 text-info animate-spin" style={{ animationDuration: '10s' }} />
//         </div>
//         <div>
//            <p className="text-[10px] font-bold text-foreground">NETWORK CORE</p>
//            <p className="text-[8px] text-muted-foreground uppercase">Global Sync Active</p>
//         </div>
//       </div>
      
//       <div className="glass p-3 rounded-xl border-purple-500/20 flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
//         <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
//             <Cpu className="w-4 h-4 text-purple-500" />
//         </div>
//         <div className="flex-1">
//            <div className="flex justify-between items-center mb-1">
//              <span className="text-[8px] font-bold text-foreground">AI MATRIX</span>
//              <span className="text-[8px] text-purple-500 font-bold">98%</span>
//            </div>
//            <div className="h-1 bg-secondary rounded-full overflow-hidden">
//              <div className="h-full bg-purple-500 w-[98%] animate-pulse"></div>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }
