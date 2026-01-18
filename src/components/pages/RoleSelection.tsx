import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from "@capacitor/dialog";
import { 
  School, BookOpen, Users, ArrowRight, ChevronLeft,
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library, Briefcase
} from 'lucide-react';
import { Toast } from '@capacitor/toast';   // optional, but nice UX
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { API_BASE_URL as API } from '../config/api';
import { LogoutModal } from '../ui/LogoutModal';

// Background Icons Configuration (Same as others for consistency)
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
    className="w-full group relative p-4 sm:p-5 rounded-2xl bg-[#131620]/80 border border-slate-800/60 hover:border-slate-600 transition-all duration-300 backdrop-blur-md text-left shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-4 mb-4"
  >
    {/* Icon Container with Gradient */}
    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300`}>
      {icon}
    </div>
    
    {/* Text Content */}
    <div className="flex-1">
      <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-wide">{title}</h3>
      <p className="text-slate-400 text-xs sm:text-sm font-medium">{description}</p>
    </div>

    {/* Arrow Indicator */}
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300 group-hover:translate-x-1">
      <ArrowRight className="w-4 h-4" />
    </div>
  </button>
);

export const RoleSelection: React.FC = () => {
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

    await Toast.show({
      text: "Logged out",
      duration: "short",
      position: "bottom",
    });

    navigate('/login'); // go to Entry screen

  } catch (error) {
    dispatch(logout());
    console.error("Logout failed:", error);
    navigate('/login'); // still go back even if API fails
  }
};

  // Handle body background color
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0e17';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleRoleSelect = (role: string) => {
    if(role === "head"){
      navigate("/head/select-profile");
    }else if(role === "teacher"){
      navigate("/teacher/select-profile")
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] overflow-hidden font-sans">
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
      {/* Animation Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(var(--rot)); }
            50% { transform: translateY(-20px) rotate(calc(var(--rot) + 10deg)); }
          }
        `}
      </style>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
        
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

      {/* Navigation Bar */}
      <div className="absolute top-8 left-4 z-50 p-2 flex justify-between items-center max-w-md mx-auto w-full">
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-slate-500 text-xs font-bold tracking-widest uppercase">Select Profile</div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
        <div className="w-full max-w-md flex flex-col m-auto p-6 py-20">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Who are you?</h1>
            <p className="text-slate-400 text-sm">Choose your role to access the portal.</p>
          </div>

          <div className="space-y-4">
            <RoleCard 
              title="School Head"
              description="Access administration & analytics"
              icon={<Briefcase className="w-6 h-6" />}
              gradientFrom="from-purple-600"
              gradientTo="to-indigo-600"
              onClick={() => handleRoleSelect('head')}
            />
            
            <RoleCard 
              title="Teacher"
              description="Manage classes, grades & attendance"
              icon={<BookOpen className="w-6 h-6" />}
              gradientFrom="from-blue-600"
              gradientTo="to-cyan-600"
              onClick={() => handleRoleSelect('teacher')}
            />
            
            <RoleCard 
              title="Parent / Guardian"
              description="View progress & communicate"
              icon={<Users className="w-6 h-6" />}
              gradientFrom="from-emerald-500"
              gradientTo="to-teal-600"
              onClick={() => handleRoleSelect('parent')}
            />
          </div>

          {/* School Registration Link */}
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-slate-600 text-[10px] xs:text-xs font-medium mb-2 uppercase tracking-wide">
              Administrator?
            </p>
            <button 
              onClick={() => navigate('/school-registration')}
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm font-semibold transition-colors group"
            >
              <School className="w-4 h-4" />
              <span>Register your school</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};