import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, Mail, Phone, MapPin, Building, Calendar, 
  Upload, X, Check, ArrowRight, ChevronLeft, Image as ImageIcon,
  Book, PenTool, GraduationCap, Calculator, Ruler, Globe, Microscope, Backpack, Library, ChevronDown
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

// Background Icons (Consistent with other auth screens)
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

// Helper component for Select inputs to match the UI theme
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  options: string[];
  error?: string;
}

const SelectInput: React.FC<SelectProps> = ({ label, icon, options, error, className = '', ...props }) => {
  return (
    <div className="w-full mb-3 sm:mb-4">
      <label className={`block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 ${error ? 'text-red-500' : 'text-slate-400'}`}>
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${error ? 'text-red-400' : 'text-slate-500 group-focus-within:text-indigo-400'}`}>
            {icon}
          </div>
        )}
        <select
          className={`
            w-full px-3 py-2.5 sm:py-3 rounded-xl text-xs xs:text-sm shadow-sm border appearance-none
            transition-all duration-200 ease-in-out cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            bg-[#1e293b]/50 text-white placeholder-slate-500 hover:border-slate-600
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="bg-[#1e293b] text-slate-500">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt} className="bg-[#1e293b] text-white">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-[10px] xs:text-xs text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export const SchoolRegistration: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    board: '',
    medium: '',
    establishedYear: '',
    logo: null as File | null
  });

  // Handle body background
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0e17';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Logo Validation
    if (!formData.logo) {
      newErrors.logo = "School logo is required";
    }

    // Basic Info Validation
    if (!formData.name.trim()) newErrors.name = "School name is required";
    
    // Email Validation
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
    }

    // Phone Validation (Indian number: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Enter valid 10-digit Indian mobile (e.g., 9876543210)";
    }

    // Address Validation
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    // Pincode Validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid Pincode (6 digits)";
    }

    // Academic Validation
    if (!formData.board) newErrors.board = "Please select a board";
    if (!formData.medium) newErrors.medium = "Please select a medium";
    
    // Year Validation
    if (!formData.establishedYear) {
      newErrors.establishedYear = "Year is required";
    } else {
        const year = parseInt(formData.establishedYear);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
            newErrors.establishedYear = `Enter valid year (1800-${currentYear})`;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      
      // Clear logo error
      if (errors.logo) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.logo;
          return newErrors;
        });
      }
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        // Scroll to top or first error if needed, for now just block submit
        return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      console.log("School Registration Payload:", {
        ...formData,
        logo: formData.logo ? formData.logo.name : 'No logo uploaded'
      });
      alert("School Registration Submitted Successfully!");
      setIsLoading(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] flex flex-col bg-[#0a0e17] font-sans">
      
      {/* Animations */}
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

      {/* Header Section (Flex Item) */}
      <div className="flex-none z-50 w-full bg-[#0a0e17]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10">
        <div className="w-full max-w-xl mx-auto px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="ml-2">
             <h1 className="text-white font-bold text-lg leading-none">Register School</h1>
             <p className="text-slate-500 text-xs">Create new institution profile</p>
          </div>
        </div>
      </div>

      {/* Main Content (Flex Scrollable Area) */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth">
        <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8 pb-12">
          
          <form onSubmit={handleSubmit} className="w-full bg-[#131620]/80 border border-slate-800/60 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-6" noValidate>
            
            {/* Logo Upload Section */}
            <div>
              <label className={`block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-2 ${errors.logo ? 'text-red-500' : 'text-slate-400'}`}>
                School Logo
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                  ${logoPreview ? 'border-indigo-500/50 bg-indigo-500/5' : errors.logo ? 'border-red-500/50 bg-red-500/5' : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800/50'}
                `}
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain p-4" />
                    <button 
                      onClick={removeLogo}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`p-3 rounded-full mb-2 group-hover:scale-110 transition-transform shadow-lg ${errors.logo ? 'bg-red-500/10' : 'bg-slate-800'}`}>
                      <ImageIcon className={`w-5 h-5 ${errors.logo ? 'text-red-400' : 'text-indigo-400'}`} />
                    </div>
                    <p className={`text-xs font-medium ${errors.logo ? 'text-red-400' : 'text-slate-400'}`}>
                      {errors.logo ? 'Logo Required' : 'Tap to upload logo'}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Basic Details</span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              <Input
                variant="dark"
                label="School Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. St. Xavier's High School"
                icon={<School className="w-4 h-4" />}
                error={errors.name}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  variant="dark"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@school.edu"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email}
                />
                <Input
                  variant="dark"
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Location</span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              <Input
                variant="dark"
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Education Lane"
                icon={<MapPin className="w-4 h-4" />}
                error={errors.address}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <Input
                  variant="dark"
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  error={errors.city}
                />
                <Input
                  variant="dark"
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  error={errors.state}
                />
                <Input
                  variant="dark"
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="sm:col-span-1 col-span-2"
                  error={errors.pincode}
                />
              </div>
            </div>

            {/* Academic Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Academic Profile</span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectInput
                  label="Board Affiliation"
                  name="board"
                  value={formData.board}
                  onChange={handleInputChange}
                  options={['CBSE', 'ICSE', 'State Board', 'International (IB/IGCSE)', 'Other']}
                  icon={<Building className="w-4 h-4" />}
                  error={errors.board}
                />
                
                <SelectInput
                  label="Medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleInputChange}
                  options={['English', 'Hindi', 'Bilingual (English + Hindi)']}
                  icon={<Book className="w-4 h-4" />}
                  error={errors.medium}
                />
              </div>
              
              <Input
                variant="dark"
                label="Established Year"
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleInputChange}
                placeholder="YYYY"
                icon={<Calendar className="w-4 h-4" />}
                error={errors.establishedYear}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
                className="h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-none shadow-lg shadow-indigo-500/25 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  {isLoading ? 'Registering...' : 'Register School'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </span>
              </Button>
            </div>

          </form>

          <div className="text-center mt-6 mb-8">
            <p className="text-slate-500 text-xs">
              By registering, you agree to EduSphere's <span className="text-indigo-400 cursor-pointer hover:underline">Terms</span> & <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};