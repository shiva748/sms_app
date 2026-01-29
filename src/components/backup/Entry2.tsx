import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, Book, PenTool, Calculator, 
  Ruler, Globe, Microscope, Backpack, Library, Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';

// Background Icons Configuration (Same as Login/Register for seamless feel)
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

export const Entry: React.FC = () => {
  // Handle body background color
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0e17';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] overflow-hidden font-sans">
      
      {/* CSS for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(var(--rot)); }
            50% { transform: translateY(-20px) rotate(calc(var(--rot) + 10deg)); }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px]" />
        
        {bgIcons.map((item, index) => (
          <div
            key={index}
            className="absolute text-slate-700/10 dark:text-slate-600/5 transition-all duration-1000"
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

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 xs:p-8 sm:p-12 max-w-md mx-auto">
        
        {/* Top Spacer */}
        <div className="flex-none h-4"></div>

        {/* Center Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
          
          {/* Animated Logo Container */}
          <div className="relative mb-8 sm:mb-12 group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 bg-gradient-to-tr from-[#1e293b] to-[#0f172a] rounded-[2rem] border border-slate-700/50 shadow-2xl shadow-indigo-500/10 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <GraduationCap className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 text-indigo-400 drop-shadow-lg" strokeWidth={1.5} />
              
              {/* Decorative floating elements around logo */}
              <div className="absolute -top-3 -right-3 p-2 bg-blue-600 rounded-xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 p-2 bg-indigo-600 rounded-xl shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <Book className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 max-w-xs mx-auto">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">
              EduSphere
            </h1>
            <p className="text-sm xs:text-base text-slate-400 leading-relaxed font-light">
              Your academic journey, simplified. <br className="hidden xs:block"/> 
              Manage grades, schedules, and more in one secure portal.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex-none space-y-3 sm:space-y-4 w-full pt-8">
          <Link to="/register" className="block" replace>
            <Button 
              fullWidth 
              className="h-12 xs:h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-none shadow-lg shadow-indigo-500/25 text-white font-bold text-sm xs:text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>

          <Link to="/login" className="block" replace>
            <Button 
              variant="secondary"
              fullWidth 
              className="h-12 xs:h-14 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-slate-700/50 text-slate-200 font-semibold text-sm xs:text-base rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              I have an account
            </Button>
          </Link>

          <p className="text-center text-[10px] xs:text-xs text-slate-600 pt-4">
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
};