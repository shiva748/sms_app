import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    GraduationCap, ArrowRight
} from 'lucide-react';

export const Entry: React.FC = () => {
    const navigate = useNavigate();

    // Set Light Theme Background
    useEffect(() => {
        document.body.style.backgroundColor = '#f8fafc'; // slate-50
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-[380px] relative z-10 flex flex-col items-center">

                {/* Main Card */}
                <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 relative overflow-visible">

                    <div className="px-8 pt-12 pb-16 flex flex-col items-center text-center">

                        {/* Logo/Icon Container */}
                        <div className="relative mb-8 group cursor-default">
                            <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] transform rotate-6 group-hover:rotate-12 transition-transform duration-500 ease-out"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2rem] shadow-lg shadow-indigo-100 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
                                <GraduationCap className="w-12 h-12 text-indigo-600" />
                            </div>

                            {/* Decorative floating dots */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-bounce" style={{ animationDuration: '2s' }}></div>
                            <div className="absolute top-1/2 -left-3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Typography */}
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            EduSphere
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto mb-6">
                            Your complete digital campus solution. Manage students, classes, and grades with ease.
                        </p>

                        {/* Secondary Action Text */}
                        <div className="mt-4">
                            <span className="text-xs text-slate-400 font-medium">Already have an account?</span>
                            <Link to="/login" className="block text-sm font-bold text-indigo-600 hover:text-indigo-700 mt-1 transition-colors">
                                Sign In Here
                            </Link>
                        </div>

                    </div>

                    {/* Floating Action Button */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white"
                            aria-label="Get Started"
                        >
                            <ArrowRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Footer/Social Proof or Branding */}
                <div className="mt-16 flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Trusted by best institutions</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};