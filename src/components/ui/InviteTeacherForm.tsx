import React, { useState } from 'react';
import { 
  Mail, Phone, AlertTriangle, Send
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toast } from '@capacitor/toast';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector } from '../../store/hooks';

interface InviteTeacherFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export const InviteTeacherForm: React.FC<InviteTeacherFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const { school } = useAppSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email must be a valid email address";
    }

    // Phone Validation (Indian format: 6-9 followed by 9 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be a valid 10-digit Indian mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (validate()) {
      setIsLoading(true);
      try {
        const req = await fetch(`${API}/schools/${school.id}/teachers`, {
          method: "POST",
          credentials: "include",
          headers: {
            "X-School-Id": school.id,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData),
        })
        const res = await req.json();
        if (res.success) {
          onSuccess();
        } else {
          await Toast.show({
            text: res.message,
            position: "bottom",
            duration: "short"
          })
          setErrors({ ...errors, ...res.data, dateOfBirth: res.dateOfBirth || res.isStudentAgeValid })
        }
      } catch (error) {
        alert("Failed to invite teacher. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      
      {/* Warning / Instruction Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-800 mb-1">Important Requirement</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            The teacher you are inviting <strong>must already be registered</strong> on the EduSphere app with the email and phone number provided below.
          </p>
          <p className="text-xs text-amber-600 mt-2 font-medium">
            If they haven't registered yet, please ask them to create an account first.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Teacher's Email Address"
          name="email"
          type="email"
          placeholder="teacher@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Teacher's Phone Number"
          name="phone"
          type="tel"
          placeholder="9876543210"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={<Phone className="w-4 h-4" />}
          required
        />
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Invitation
        </Button>
      </div>
    </form>
  );
};