import React, { useEffect } from 'react';
import { 
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library
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
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  fullScreen = true 
}) => {
  
  // Lock body scroll if full screen
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [fullScreen]);

  return (
    <div className={`
      ${fullScreen ? 'fixed inset-0 z-[100]' : 'absolute inset-0 z-50 rounded-inherit'}
      flex flex-col items-center justify-center 
      bg-[#0a0e17] text-white overflow-hidden
    `}>
      
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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
        
        {bgIcons.map((item, index) => (
          <div
            key={index}
            className="absolute text-slate-700/10 transition-all duration-1000"
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
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" style={{ animationDuration: '1s' }}></div>
           {/* Ring 2 */}
           <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
           {/* Ring 3 */}
           <div className="absolute inset-4 rounded-full border-b-2 border-purple-500 animate-spin" style={{ animationDuration: '2s' }}></div>
           
           {/* Center Icon */}
           <div className="absolute inset-0 flex items-center justify-center">
             <GraduationCap className="w-8 h-8 text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
           </div>
           
           {/* Subtle Glow */}
           <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
        </div>

        {/* Branding */}
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
          EduSphere
        </h2>
        
        {/* Loading Message */}
        <div className="flex items-center gap-1 h-5">
          <p className="text-sm text-slate-400 font-medium">{message}</p>
          <span className="flex gap-0.5 mt-2">
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
          </span>
        </div>
      </div>
    </div>
  );
};