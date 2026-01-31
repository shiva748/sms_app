import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Plus, CheckCircle2, Clock, Ban, ArrowRight, MapPin,
    UserSquare2, School, Check, X, Building
} from 'lucide-react';
import { FILE_BASE_URL, API_BASE_URL as API } from '../config/api';
import { Button } from '../ui/Button';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { notify } from '../../services/utils';
import { Modal } from '../ui/Modal';
import { setUser } from '../../store/slices/authSlice';

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
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        } else if (profile.status === 'PENDING') {
            setSelectedInvitation(profile);
        } else {
            notify(`Cannot access account (${profile.status})`)
        }
    };
    const handleInvitationResponse = async (action: 'ACCEPT' | 'REJECT') => {
        setIsLoading(true);
        // Simulate API call
        try {
            const accepted = action == "ACCEPT";
            let req = await fetch(`${API}/user/invitation/teacher`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedInvitation.id, accepted }),
            })
            let res = await req.json();
            if (res.success) {
                let profileReq = await fetch(`${API}/user/me`, {
                    method: "GET",
                    credentials: "include",
                })
                let profileData = await profileReq.json();
                dispatch(setUser(profileData.data));
                setSelectedInvitation(null);
            }
            notify(res.message);
        } catch (error) {
            alert(error)
        }
        setIsLoading(false);
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
            {/* Invitation Response Modal */}
            <Modal
                isOpen={!!selectedInvitation}
                onClose={() => !isLoading && setSelectedInvitation(null)}
                title="School Invitation"
                maxWidth="sm"
            >
                {selectedInvitation && (
                    <div className="flex flex-col items-center text-center pb-2">

                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                            <School className="w-10 h-10 text-indigo-600" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                            {selectedInvitation.school.name}
                        </h3>

                        <p className="text-slate-500 text-sm mb-6 leading-relaxed px-4">
                            You have been invited to join the faculty as a <strong>Teacher</strong>.
                        </p>

                        <div className="bg-slate-50 rounded-xl p-4 w-full mb-8 border border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                </div>
                                <span className="font-medium text-left">{selectedInvitation.school.city}, {selectedInvitation.school.state}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Building className="w-4 h-4 text-pink-500" />
                                </div>
                                <span className="font-medium text-left">Role: Teaching Staff</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => handleInvitationResponse('REJECT')}
                                disabled={isLoading}
                                className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 h-12"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                fullWidth
                                onClick={() => handleInvitationResponse('ACCEPT')}
                                isLoading={isLoading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 shadow-lg shadow-emerald-500/20"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};