import React, { useEffect } from 'react';
import { 
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library, Loader2
} from 'lucide-react';

// Background Icons Configuration (Consistent with other auth screens)
const bgIcons = [
  { Icon: Book, top: '10%', left: '10%', size: 48, delay: '0s', duration: '15s', rot: '12deg' },
  { Icon: PenTool, top: '20%', right: '15%', size: 32, delay: '2s', duration: '12s', rot: '-15deg' },
  { Icon: GraduationCap, bottom: '15%', left: '20%', size: 64, delay: '1s', duration: '18s', rot: '5deg' },
  { Icon: Calculator, top: '40%', left: '5%', size: 40, delay: '3s', duration: '20s', rot: '-10deg' },
  { Icon: Ruler, bottom: '30%', right: '10%', size: 44, delay: '4s', duration: '16s', rot: '45deg' },
  { Icon: Globe, top: '15%', left: '50%', size: 36, delay: '5s', duration: '22s', rot: '0deg' },
  { Icon: Microscope, bottom: '10%', left: '80%', size: 52, delay: '2s', duration: '19s', rot: '10deg' },
  { Icon: Backpack, top: '60%', right: '25%', size: 48, delay: '1s', duration: '14s', rot: '-5deg' },
  { Icon: Library, bottom: '40%', left: '85%', size: 38, delay: '3s', duration: '17s', rot: '0deg' }
];

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'dark' | 'light';
  type?: 'default' | 'simple';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  fullScreen = true,
  variant = 'dark',
  type = 'default'
}) => {
  const isDark = variant === 'dark';
  
  // Lock body scroll if full screen
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [fullScreen]);

  const baseClasses = `
    ${fullScreen ? 'fixed inset-0 z-[100]' : 'absolute inset-0 z-50 rounded-inherit'}
    flex flex-col items-center justify-center 
    ${isDark ? 'bg-[#0a0e17] text-white' : 'bg-slate-50 text-slate-900'}
    overflow-hidden transition-colors duration-300 font-sans
  `;

  // Simple Loader Variant
  if (type === 'simple') {
    return (
      <div className={baseClasses}>
        <div className="flex flex-col items-center justify-center gap-4">
           <div className={`p-3 rounded-full ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm border border-slate-100'}`}>
             <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
           </div>
           {message && (
             <p className={`text-sm font-medium animate-pulse ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
               {message}
             </p>
           )}
        </div>
      </div>
    );
  }

  // Default 'Immersive' Loader with Floating Icons
  return (
    <div className={baseClasses}>
      
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(var(--rot)); }
            50% { transform: translateY(-20px) rotate(calc(var(--rot) + 10deg)); }
          }
        `}
      </style>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradients */}
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-300 ${isDark ? 'bg-indigo-900/20' : 'bg-blue-200/40'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-300 ${isDark ? 'bg-blue-900/20' : 'bg-indigo-200/40'}`} />
        
        {bgIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ${isDark ? 'text-slate-700/10' : 'text-slate-300/40'}`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              animation: `float ${item.duration} ease-in-out infinite`,
              animationDelay: item.delay,
              '--rot': item.rot,
            } as React.CSSProperties}
          >
            <item.Icon size={item.size} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Central Loader Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings Container */}
        <div className="relative w-24 h-24 mb-6">
           {/* Ring 1 */}
           <div className={`absolute inset-0 rounded-full border-t-2 animate-spin ${isDark ? 'border-indigo-500' : 'border-indigo-600'}`} style={{ animationDuration: '1s' }}></div>
           {/* Ring 2 */}
           <div className={`absolute inset-2 rounded-full border-r-2 animate-spin ${isDark ? 'border-blue-500' : 'border-blue-500'}`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
           {/* Ring 3 */}
           <div className={`absolute inset-4 rounded-full border-b-2 animate-spin ${isDark ? 'border-purple-500' : 'border-purple-500'}`} style={{ animationDuration: '2s' }}></div>
           
           {/* Center Icon */}
           <div className="absolute inset-0 flex items-center justify-center">
             <GraduationCap className={`w-8 h-8 ${isDark ? 'text-white/90' : 'text-indigo-600'} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
           </div>
           
           {/* Subtle Glow */}
           <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
        </div>

        {/* Branding */}
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400' : 'text-slate-800'}`}>
          EduSphere
        </h2>
        
        {/* Loading Message */}
        <div className="flex items-center gap-1 h-5">
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>
          <span className="flex gap-0.5 mt-2">
            <span className={`w-1 h-1 rounded-full animate-bounce ${isDark ? 'bg-slate-400' : 'bg-slate-400'}`} style={{ animationDelay: '0s' }}></span>
            <span className={`w-1 h-1 rounded-full animate-bounce ${isDark ? 'bg-slate-400' : 'bg-slate-400'}`} style={{ animationDelay: '0.15s' }}></span>
            <span className={`w-1 h-1 rounded-full animate-bounce ${isDark ? 'bg-slate-400' : 'bg-slate-400'}`} style={{ animationDelay: '0.3s' }}></span>
          </span>
        </div>
      </div>
    </div>
  );
};