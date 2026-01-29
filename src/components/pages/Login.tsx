import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail, Lock, ArrowRight, Eye, EyeOff, ChevronLeft
} from 'lucide-react';
import { notify } from '../../services/utils';
import { API_BASE_URL as API } from '../config/api';
import { Input } from '../ui/Input';
import { useAppDispatch } from '../../store/hooks';
import { setAuthenticated, setUser } from '../../store/slices/authSlice';

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setLoading] = useState(false);

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
        } else if (formData.password.length < 8) {
            newErrors.password = "Password to small";
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

        setLoading(true);
        try {
            let req = await fetch(`${API}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            let res = await req.json();
            if (res.success) {
                let profileReq = await fetch(`${API}/user/me`, {
                    method: "GET",
                    credentials: "include",
                })
                let profileData = await profileReq.json();
                notify("Login Successfull!")
                dispatch(setAuthenticated(true));
                dispatch(setUser(profileData.data));
                navigate('/', { replace: true });
            } else {
                setErrors({ ...errors, ...res.data })
                notify(res.message);
            }
        } catch (error) {
            alert(error)
        }
        setLoading(false);

    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-[380px] relative z-10 flex flex-col items-center">

                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h1>
                    <p className="text-slate-500 text-sm">Please sign in to your account</p>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 relative">

                    {/* Tabs */}
                    <div className="flex w-full px-8 pt-6 border-b border-slate-100">
                        <div className="relative pb-4 px-2 cursor-pointer mr-6">
                            <span className="text-indigo-600 font-bold text-base">Login</span>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]"></div>
                        </div>
                        <Link to="/register" className="pb-4 px-2 text-slate-400 hover:text-slate-600 font-medium text-base transition-colors">
                            Signup
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 pt-8 pb-16">
                        <div className="space-y-4">
                            <Input
                                variant="light"
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                icon={<Mail className="w-4 h-4" />}
                                error={errors.email}
                                required
                                className="bg-slate-50 border-transparent focus:bg-white"
                            />

                            <div className="space-y-2">
                                <Input
                                    variant="light"
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    icon={<Lock className="w-4 h-4" />}
                                    error={errors.password}
                                    required
                                    className="bg-slate-50 border-transparent focus:bg-white"
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
                                        <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium">Remember me</span>
                                    </label>
                                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot Password?</a>
                                </div>
                            </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Social Options */}
                <div className="mt-12 flex flex-col items-center gap-6 w-full relative z-10">
                    {/* Separator */}
                    <div className="flex items-center gap-3 w-full px-8 opacity-60">
                        <div className="h-px bg-slate-300 flex-1"></div>
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Or continue with</span>
                        <div className="h-px bg-slate-300 flex-1"></div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-center gap-5">
                        {/* Google */}
                        <button className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 group">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 group">
                            <svg className="w-7 h-7 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>

                        {/* Twitter/X */}
                        <button className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 group">
                            <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};