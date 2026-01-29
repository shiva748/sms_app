import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, CheckCircle2, Clock, Ban, ArrowRight, MapPin,
    School, Plus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { API_BASE_URL, FILE_BASE_URL } from '../config/api';
import { setProfile, setRole, setSchool } from '../../store/slices/authSlice';
import { notify } from '../../services/utils';

const getGradient = (index: number) => {
    const gradients = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-purple-500 to-pink-600",
        "from-orange-500 to-red-600",
        "from-cyan-500 to-blue-600"
    ];
    return gradients[index % gradients.length];
};

export const HeadProfileSelection: React.FC = ({ back }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    // Set Light Theme Background
    useEffect(() => {
        document.body.style.backgroundColor = '#f8fafc'; // slate-50
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleSelectProfile = async (profile: any) => {
        if (profile.status === 'ACTIVE') {
            if (profile.school.status !== 'ACTIVE') {
                notify(`School is not ACTIVE`)
                return;
            }
            dispatch(setRole("SCHOOL_HEAD"));
            dispatch(setSchool(profile.school));
            dispatch(setProfile(profile))
            navigate('/');
        } else {
            notify(`Cannot access account (${profile.status})`)
        }
    };


    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Institution</h1>
                    <p className="text-slate-500 text-sm">Choose an organization to manage</p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-8 border border-white">

                    {user.schoolHeads.length > 0 ? (
                        <div className="space-y-4">
                            {user.schoolHeads.map((profile, index) => {
                                const school = profile.school;
                                const isActive = profile.status === 'ACTIVE';
                                const isPending = profile.status === 'PENDING';
                                const isInactive = profile.status === 'INACTIVE';
                                const isSchoolActive = profile.school.status === 'ACTIVE';
                                const isSchoolPending = profile.school.status === 'PENDING';
                                const isSchoolInactive = profile.school.status === 'INACTIVE';
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
                                            {profile.school.logo ? (
                                                <img
                                                    src={`${FILE_BASE_URL}/${profile.school.logo}`}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                    alt="school logo"
                                                />
                                            ) : (
                                                initial
                                            )}
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

                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px]">

                                                    {/* Role */}
                                                    <span className="text-slate-500 font-medium">
                                                        {profile.designation}
                                                    </span>

                                                    {/* Owner Status */}
                                                    <div className={`
    inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
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

                                                    </div>

                                                    {/* Divider (only on large screens) */}
                                                    <span className="hidden sm:inline text-slate-300 mx-1">•</span>

                                                    {/* School Label */}
                                                    <span className="text-slate-500 font-medium">
                                                        School
                                                    </span>

                                                    {/* School Status */}
                                                    <div className={`
    inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
    ${isSchoolActive
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : isSchoolPending
                                                                ? 'bg-amber-50 text-amber-600'
                                                                : 'bg-red-50 text-red-600'
                                                        }
  `}>
                                                        {isSchoolActive && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                        {isSchoolPending && <Clock className="w-3 h-3 mr-1" />}
                                                        {isSchoolInactive && <Ban className="w-3 h-3 mr-1" />}

                                                    </div>

                                                </div>
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
                                <School className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg mb-1">No Profiles Found</h3>
                            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto mb-1">
                                You aren't linked to any schools as a head yet.
                            </p>
                        </div>
                    )}

                    {/* Add New Button */}
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => navigate('/school-registration')}
                            className="h-12 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl group"
                        >
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                            Link Another School
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};