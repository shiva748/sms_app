import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ChevronLeft,
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toast } from '@capacitor/toast';
import { API_BASE_URL as API } from '../config/api';

// Reuse the same background configuration for consistency
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

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle body background color to prevent white bars during mobile scroll/overscroll
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0e17';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name Validation
    if (!formData.name.trim()) newErrors.name = "Full name is required";

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone Validation (Indian number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit Indian mobile";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    setIsLoading(true);
    try {
      let res = await fetch(`${API}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      let data = await res.json();
      if (data.success) {
        await Toast.show({
          text: data.message,
          duration: "short",
          position: "bottom",
        });
        navigate('/login', { replace: true });
      } else {
        await Toast.show({
          text: data.message,
          duration: "short",
          position: "bottom",
        });
      }
    } catch (error) {
      alert(error)
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] font-sans overflow-hidden">

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
        <div className="absolute top-[20%] left-[80%] w-[20%] h-[20%] bg-purple-900/20 rounded-full blur-[80px]" />

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

      {/* Scrollable Container */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
        <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-md flex flex-col items-center m-auto p-3 xs:p-4 sm:p-6 pb-8">

          <div className="text-center mb-4 sm:mb-6 w-full mt-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-xs xs:text-sm text-slate-400">Join EduSphere Today</p>
          </div>

          <div className="w-full bg-[#131620]/80 border border-slate-800/60 rounded-2xl p-4 xs:p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
              <Input
                variant="dark"
                label="Full Name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.name}
                required
              />

              <Input
                variant="dark"
                label="Email Address"
                name="email"
                type="email"
                placeholder="Type your email here"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.email}
                required
              />

              <Input
                variant="dark"
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.phone}
                required
              />

              <Input
                variant="dark"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="mt-2 h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-none shadow-lg shadow-indigo-500/25 text-white font-semibold text-xs xs:text-sm sm:text-base rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  {isLoading ? 'Creating Account...' : 'Register'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </span>
              </Button>
            </form>
          </div>

          <div className="text-center mt-4 xs:mt-6">
            <p className="text-slate-500 text-[10px] xs:text-xs sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};