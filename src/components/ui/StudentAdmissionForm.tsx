import React, { useState, useRef } from 'react';
import {
  User, Calendar, Hash, Image as ImageIcon, Phone, Mail,
  X, Upload, Save, UserCheck, Smartphone, CheckCircle2
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector } from '../../store/hooks';
import { notify } from '../../services/utils';

export interface StudentFormData {
  name: string;
  dateOfBirth: string;
  admissionNumber: string;
  photo: File | null;
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
}

interface StudentAdmissionFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  initialData?: Partial<StudentFormData>;
}

export const StudentAdmissionForm: React.FC<StudentAdmissionFormProps> = ({
  onSuccess,
  onCancel,
  initialData
}) => {
  const { school } = useAppSelector(state => state.auth)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<StudentFormData>({
    name: initialData?.name || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    admissionNumber: initialData?.admissionNumber || '',
    photo: initialData?.photo || null,
    primaryContactName: initialData?.primaryContactName || '',
    primaryContactPhone: initialData?.primaryContactPhone || '',
    primaryContactEmail: initialData?.primaryContactEmail || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Personal Info Validation
    if (!formData.name.trim()) newErrors.name = "Student name is required";
    if (!formData.photo) newErrors.photo = "Student photo is required";

    // Although dateOfBirth is optional in DB entity, it's usually good practice to require it
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    // Contact Validation
    if (!formData.primaryContactName.trim()) newErrors.primaryContactName = "Guardian name is required";

    // Phone Validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.primaryContactPhone.trim()) {
      newErrors.primaryContactPhone = "Phone number is required";
    } else if (!phoneRegex.test(formData.primaryContactPhone)) {
      newErrors.primaryContactPhone = "Invalid phone number";
    }

    // Email Validation (Optional but must be valid if provided)
    if (formData.primaryContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = "Invalid email format";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, photo: "File size should be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);

      if (errors.photo) {
        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.photo;
          return newErr;
        });
      }
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);

      // Create FormData object for file upload support
      const submitData = new FormData();
      submitData.append("photo", formData.photo);
      submitData.append("data", JSON.stringify({ ...formData, photo: null }));
      try {
        const req = await fetch(`${API}/schools/${school.id}/students`, {
          method: "POST",
          credentials: "include",
          headers: {
            "X-School-Id": school.id
          },
          body: submitData,
        })
        const res = await req.json();
        if (res.success) {
          onSuccess();
        } else {
          notify(res.message)
          setErrors({ ...errors, ...res.data, dateOfBirth: res.dateOfBirth || res.isStudentAgeValid })
        }
      } catch (error) {
        console.error("Admission failed:", error);
        notify("Failed to admit student. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getMaxDOB = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  };

  const getMinDOB = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 24);  // 24 years
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Photo & Personal Basic */}
        <div className="lg:col-span-4 space-y-6">
          {/* Photo Upload Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Student Photo <span className="text-red-500">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                aspect-[3/4] w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group bg-white
                ${errors.photo ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
              `}
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Click to upload</p>
                  <p className="text-[10px] text-slate-400">JPG, PNG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {errors.photo && <p className="text-xs text-red-500 mt-2">{errors.photo}</p>}
          </div>
        </div>

        {/* Right Column: Details Inputs */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section: Personal Info */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Aarav Patel"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
                min={getMinDOB()}
                max={getMaxDOB()}
              />

              <Input
                label="Admission Number"
                name="admissionNumber"
                placeholder="e.g. sc-1452"
                value={formData.admissionNumber}
                onChange={handleChange}
                icon={<Hash className="w-4 h-4" />}
                rightElement={
                  <div className="pr-3 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Optional
                  </div>
                }
              />
            </div>
          </div>

          {/* Section: Guardian Info */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              Guardian Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Primary Contact Name"
                  name="primaryContactName"
                  placeholder="Parent / Guardian Name"
                  value={formData.primaryContactName}
                  onChange={handleChange}
                  error={errors.primaryContactName}
                  icon={<User className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Phone Number"
                name="primaryContactPhone"
                type="tel"
                placeholder="9876543210"
                value={formData.primaryContactPhone}
                onChange={handleChange}
                error={errors.primaryContactPhone}
                icon={<Phone className="w-4 h-4" />}
                required
              />

              <Input
                label="Email Address"
                name="primaryContactEmail"
                type="email"
                placeholder="guardian@example.com"
                value={formData.primaryContactEmail}
                onChange={handleChange}
                error={errors.primaryContactEmail}
                icon={<Mail className="w-4 h-4" />}
                rightElement={
                  <div className="pr-3 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Optional
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
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
          <Save className="w-4 h-4 mr-2" />
          Admit Student
        </Button>
      </div>
    </form>
  );
};