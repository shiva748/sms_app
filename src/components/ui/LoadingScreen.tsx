import React, { useEffect } from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'dark' | 'light';
  type?: 'default' | 'simple';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  fullScreen = true,
  variant = 'light',
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
    ${isDark ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}
    transition-colors duration-300 font-sans overflow-hidden
  `;

  // Simple Loader for inline contexts
  if (type === 'simple') {
    return (
      <div className={baseClasses}>
         <div className="flex flex-col items-center gap-3">
            <Loader2 className={`w-6 h-6 animate-spin ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            {message && <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>}
         </div>
      </div>
    );
  }

  // Default Full Branding Loader
  return (
    <div className={baseClasses}>
        
        {/* Subtle Background Blobs for Light Mode */}
        {!isDark && (
            <>
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />
            </>
        )}

        <div className="relative z-10 flex flex-col items-center">
            {/* Logo Box */}
            <div className={`
                relative w-20 h-20 rounded-2xl flex items-center justify-center mb-8
                ${isDark ? 'bg-slate-800' : 'bg-white shadow-xl shadow-indigo-100/50'}
            `}>
                {/* Ping Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                <GraduationCap className={`w-10 h-10 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>EduSphere</h1>
            
            {/* Loading Indicator */}
            <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`} style={{ animationDelay: '0s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} style={{ animationDelay: '0.15s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-indigo-300' : 'bg-indigo-400'}`} style={{ animationDelay: '0.3s' }}></div>
                </div>
                {message && (
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>
                )}
            </div>
        </div>
    </div>
  );
};