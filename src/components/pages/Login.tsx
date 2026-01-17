import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft,
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { StudentAvatar } from '../ui/StudentAvatar';

// Background Icons Configuration
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

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Handle body background color to prevent white bars during mobile scroll/overscroll
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0e17';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setAuth(prev => ({ ...prev, isLoading: true, error: null }));

    setTimeout(() => {
      // Simulate successful login
      setAuth(prev => ({ ...prev, isLoading: false, isAuthenticated: true }));
      console.log("Login Successful");
      navigate('/role-selection');
    }, 1500);
  };

  return (
    // Fixed inset-0 ensures full viewport height handling
    // overflow-hidden prevents the outer container from scrolling, enforcing the internal scroll
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] font-sans overflow-hidden">
      
      {/* CSS for floating animation */}
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
        {/* Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[80%] w-[20%] h-[20%] bg-purple-900/20 rounded-full blur-[80px]" />

        {/* Floating Icons */}
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

      {/* Back Button */}
      <div className="absolute top-8 left-4 z-50">
        <button 
          onClick={() => navigate('/')}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Scrollable Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
        <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-md flex flex-col items-center m-auto p-3 xs:p-4 sm:p-6 pb-8">
          
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-8 w-full mt-2">
            <h3 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-2 sm:mb-4">Student Portal</h3>
            
            <StudentAvatar 
              emailLength={formData.email.length} 
              isPasswordFocused={isPasswordFocused}
              isEmailFocused={isEmailFocused}
            />

            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-1">EduSphere</h1>
            <p className="text-xs xs:text-sm text-slate-400">Secure Academic Login</p>
          </div>

          {/* Login Card */}
          <div className="w-full bg-[#131620]/80 border border-slate-800/60 rounded-2xl p-4 xs:p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5" noValidate>
              <div>
                <Input
                  variant="dark"
                  label="Academic Email"
                  name="email"
                  type="email"
                  placeholder="student@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                  error={errors.email}
                  required
                />
              </div>

              <div>
                <Input
                  variant="dark"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  error={errors.password}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <div className="flex justify-end -mt-1">
                <a href="#" className="text-[10px] xs:text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Credentials?
                </a>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                isLoading={auth.isLoading}
                className="h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-none shadow-lg shadow-indigo-500/25 text-white font-semibold text-xs xs:text-sm sm:text-base rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  {auth.isLoading ? 'Authenticating...' : 'Sign In'}
                  {!auth.isLoading && <ArrowRight className="w-4 h-4" />}
                </span>
              </Button>
            </form>

            {/* Quick Auth Divider */}
            <div className="relative mt-4 xs:mt-6 sm:mt-8 mb-3 xs:mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] xs:text-xs">
                <span className="px-3 py-1 bg-[#131620] text-slate-500 font-bold tracking-wider uppercase rounded-full">Quick Auth</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-3 xs:gap-4">
              {/* Google Button */}
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-colors border border-transparent shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              
              {/* Apple Button */}
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black hover:bg-slate-900 flex items-center justify-center transition-colors border border-transparent shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.77.08 2.6.76 3.16 1.48-2.66 1.34-2.14 5.39.46 6.55-.54 1.73-1.38 3.55-3.07 5.74zm-2.19-14.7c.6-1.54 2.58-2.43 2.52-4.48-2.06.1-4.04 1.25-4.52 2.87-.43 1.48 1.4 4.54 2 1.61z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-4 xs:mt-6">
            <p className="text-slate-500 text-[10px] xs:text-xs sm:text-sm">
              New Student?{' '}
              <Link to="/register" className="text-white font-bold hover:underline">
                Register Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};