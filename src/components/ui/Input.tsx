import React from 'react';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  rightElement,
  variant = 'light',
  className = '', 
  ...props 
}) => {
  const isDark = variant === 'dark';
  
  return (
    <div className="w-full mb-3 sm:mb-4">
      <label className={`block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-brand-600'}`}>
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2.5 sm:py-3 rounded-xl text-xs xs:text-sm shadow-sm border
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${isDark 
              ? 'bg-[#1e293b]/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-600' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-200 hover:border-slate-400'}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : ''}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[10px] xs:text-xs text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};