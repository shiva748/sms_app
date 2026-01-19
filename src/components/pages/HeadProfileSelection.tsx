import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ChevronLeft, Plus, CheckCircle2, Clock, Ban, ArrowRight, MapPin, 
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library, School
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppSelector } from '../../store/hooks';
import { API_BASE_URL } from '../config/api';

// Background Icons
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


// Helper to determine gradient based on index (since API doesn't return color)
const getGradient = (index: number) => {
  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-600 to-pink-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600"
  ];
  return gradients[index % gradients.length];
};

export const HeadProfileSelection: React.FC = () => {
  const {user} = useAppSelector((state)=> state.auth);
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
      console.log("Selected Profile:", profile.school.name);
      navigate('/dashboard');
    } else {
      alert(`Cannot access ${profile.school.name} account. Status: ${profile.status}`);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] overflow-hidden font-sans">
      
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

      {/* Header with Back Button */}
      <div className="absolute top-7 left-0 right-0 p-4 z-50 flex items-center w-full max-w-lg mx-auto">
        <button 
          onClick={() => navigate('/role-selection')}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="ml-2 text-white font-semibold text-sm tracking-wide">Select Institution</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10 pt-16">
        <div className="w-full max-w-lg flex flex-col m-auto p-4 sm:p-6 pb-20">
          
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">School Head Profiles</h1>
            <p className="text-slate-400 text-sm">Select an organization to manage</p>
          </div>
          {user.schoolHeads.length > 0 ? (
            <div className="space-y-4">
              {user.schoolHeads.map((profile, index) => {
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
                      group relative w-full p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer
                      flex items-center gap-4
                      ${isInactive ? 'bg-[#131620]/40 border-slate-800/40 opacity-70' : 'bg-[#131620]/80 border-slate-800/60 hover:border-slate-600 hover:bg-[#1a1f2e] hover:shadow-xl hover:scale-[1.01]'}
                    `}
                  >
                    {/* Left: School Logo/Avatar */}
                    <div className={`
                      flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient}
                      flex items-center justify-center text-white font-bold text-xl shadow-lg
                      group-hover:shadow-indigo-500/20 transition-shadow
                    `}>
                      {profile.school.logo?<img src={`${API_BASE_URL}/files/${profile.school.logo}`}/>:initial}
                    </div>
                    {/* Center: Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-white font-bold text-sm sm:text-base truncate pr-2">
                          {school.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-slate-400 text-xs mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{school.city}, {school.state}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <div className={`
                          inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                          ${isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isPending
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }
                        `}>
                          {isActive && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {isPending && <Clock className="w-3 h-3 mr-1" />}
                          {isInactive && <Ban className="w-3 h-3 mr-1" />}
                          {profile.status}
                        </div>

                        <span className="text-slate-600 text-[10px] border-l border-slate-700 pl-2">
                          {profile.designation}
                        </span>
                      </div>
                    </div>

                    {/* Right: Action Arrow */}
                    <div className="flex-shrink-0 text-slate-600 group-hover:text-indigo-400 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-[#131620]/40 border border-slate-800/40 border-dashed backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4 shadow-inner">
                <School className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No Profiles Found</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed mb-1">
                You aren't linked to any schools as a head yet.
              </p>
              <p className="text-slate-500 text-xs">
                Register a new school to get started.
              </p>
            </div>
          )}

          {/* Add New Button */}
          <div className="mt-8">
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => navigate('/school-registration')}
              className={`
                h-12 border-dashed border-slate-700 text-slate-400 hover:text-white hover:bg-white/5 hover:border-slate-500 rounded-xl group
                ${user.schoolHeads.length === 0 ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20 hover:border-indigo-400 hover:text-indigo-200' : ''}
              `}
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