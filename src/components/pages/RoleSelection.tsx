import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    School, BookOpen, Users, ArrowRight, ChevronLeft, Briefcase
} from 'lucide-react';
import { LogoutModal } from '../ui/LogoutModal';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { API_BASE_URL as API } from '../config/api';
import { notify } from '../../services/utils';
interface RoleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    gradientFrom: string;
    gradientTo: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick, gradientFrom, gradientTo }) => (
    <button
        onClick={onClick}
        className="w-full group relative p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 flex items-center gap-4 mb-4"
    >
        {/* Icon Container with Gradient */}
        <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>

        {/* Text Content */}
        <div className="flex-1">
            <h3 className="text-slate-900 font-bold text-sm sm:text-base mb-0.5 tracking-wide group-hover:text-indigo-700 transition-colors">{title}</h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">{description}</p>
        </div>

        {/* Arrow Indicator */}
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300 group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4" />
        </div>
    </button>
);

export const RoleSelection: React.FC = ({ back }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        handleLogout()
    };
    const handleLogout = async () => {
        try {
            await fetch(`${API}/auth/logout`, {
                method: "GET",
                credentials: "include",
            });

            dispatch(logout()); // clear redux state

            notify("Logged Out!");

            navigate('/login'); // go to Entry screen

        } catch (error) {
            dispatch(logout());
            console.error("Logout failed:", error);
            navigate('/login'); // still go back even if API fails
        }
    };

    // Set Light Theme Background
    useEffect(() => {
        document.body.style.backgroundColor = '#f8fafc'; // slate-50
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleRoleSelect = (role: string) => {
        if (role === "head") {
            navigate("/head/select-profile");
        } else if (role === "teacher") {
            navigate("/teacher/select-profile")
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />

            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={() => { back ? navigate(back) : setShowLogoutModal(true) }}
                    className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">

                {/* Header Text */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Who are you?</h1>
                    <p className="text-slate-500 text-sm">Choose your role to access the portal.</p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-8 border border-white">

                    <div className="space-y-2">
                        <RoleCard
                            title="School Head"
                            description="Access administration & analytics"
                            icon={<Briefcase className="w-5 h-5" />}
                            gradientFrom="from-purple-600"
                            gradientTo="to-indigo-600"
                            onClick={() => handleRoleSelect('head')}
                        />

                        <RoleCard
                            title="Teacher"
                            description="Manage classes, grades & attendance"
                            icon={<BookOpen className="w-5 h-5" />}
                            gradientFrom="from-blue-600"
                            gradientTo="to-cyan-600"
                            onClick={() => handleRoleSelect('teacher')}
                        />

                        <RoleCard
                            title="Parent / Guardian"
                            description="View progress & communicate"
                            icon={<Users className="w-5 h-5" />}
                            gradientFrom="from-emerald-500"
                            gradientTo="to-teal-600"
                            onClick={() => handleRoleSelect('parent')}
                        />
                    </div>

                    {/* School Registration Link */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                            Administrator?
                        </p>
                        <button
                            onClick={() => navigate('/school-registration')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm font-bold transition-colors group border border-slate-100 hover:border-indigo-100"
                        >
                            <School className="w-4 h-4" />
                            <span>Register your school</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-indigo-400" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};