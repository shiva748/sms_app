import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Plus, CheckCircle2, Clock, Ban, ArrowRight, MapPin,
    UserSquare2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppSelector } from '../../store/hooks';
import { notify } from '../../services/utils';

// Helper to determine gradient based on index
const getGradient = (index: number) => {
    const gradients = [
        "from-emerald-500 to-teal-600",
        "from-blue-500 to-indigo-600",
        "from-purple-500 to-pink-600",
        "from-orange-500 to-red-600",
        "from-cyan-500 to-blue-600"
    ];
    return gradients[index % gradients.length];
};

export const TeacherProfileSelection: React.FC = ({ back }) => {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    // Handle body background color
    useEffect(() => {
        document.body.style.backgroundColor = '#0a0e17';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleSelectProfile = (profile: any) => {
        if (profile.status === 'ACTIVE') {
            navigate('/dashboard');
        } else {
            notify(`Cannot access account (${profile.status})`)
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={() => navigate(back)}
                    className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-lg relative z-10 flex flex-col items-center">

                {/* Header Text */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Teacher Profiles</h1>
                    <p className="text-slate-500 text-sm">Select a school to access your dashboard</p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-8 border border-white">

                    {user.teachers.length > 0 ? (
                        <div className="space-y-4">
                            {user.teachers.map((profile, index) => {
                                const school = profile.school;
                                const isActive = profile.status === 'ACTIVE';
                                const isPending = profile.status === 'PENDING';
                                const isInactive = profile.status === 'INACTIVE';
                                const initial = school.name ? school.name.charAt(0).toUpperCase() : 'S';
                                const gradient = getGradient(index);

                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => handleSelectProfile(profile)}
                                        className={`
                      group relative w-full p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 bg-white
                      ${isInactive
                                                ? 'border-slate-100 opacity-60'
                                                : 'border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5'
                                            }
                    `}
                                    >
                                        {/* Left: School Logo/Avatar */}
                                        <div className={`
                      flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient}
                      flex items-center justify-center text-white font-bold text-xl shadow-md
                      group-hover:shadow-lg transition-shadow duration-300
                    `}>
                                            {initial}
                                        </div>

                                        {/* Center: Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-slate-900 font-bold text-sm sm:text-base truncate pr-2 group-hover:text-indigo-700 transition-colors">
                                                    {school.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center text-slate-400 text-xs mb-2">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                <span className="truncate">{school.city}, {school.state}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Status Badge */}
                                                <div className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                          ${isActive
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : isPending
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'bg-red-50 text-red-600'
                                                    }
                        `}>
                                                    {isActive && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                    {isPending && <Clock className="w-3 h-3 mr-1" />}
                                                    {isInactive && <Ban className="w-3 h-3 mr-1" />}
                                                    {profile.status}
                                                </div>

                                                {profile.employeeCode && (
                                                    <span className="text-slate-500 text-[10px] border-l border-slate-200 pl-2 font-mono font-medium">
                                                        {profile.employeeCode}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Action Arrow */}
                                        <div className="flex-shrink-0 text-slate-300 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-50 border border-slate-100 border-dashed">
                            <div className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                                <UserSquare2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg mb-1">No Teacher Profiles</h3>
                            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto mb-1">
                                You haven't been added as a teacher to any schools yet.
                            </p>
                        </div>
                    )}

                    {/* Add New Button (Placeholder action) */}
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => alert("Feature: 'Join School with Code' coming soon.")}
                            className="h-12 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl group"
                        >
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                            Join New School
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};