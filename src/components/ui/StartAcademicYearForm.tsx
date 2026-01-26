import React, { useState } from 'react';
import { Calendar, AlertTriangle, Save } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSchoolData } from '../../store/slices/authSlice';
import { Toast } from '@capacitor/toast';
interface StartAcademicYearFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export const StartAcademicYearForm: React.FC<StartAcademicYearFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { school, schoolData } = useAppSelector((state) => state.auth)
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim()) {
      setError('Academic year is required (e.g. 2025-26)');
      return;
    }

    setIsLoading(true);
    try {
      const req = await fetch(`${API}/schools/${school.id}/academicyear`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-School-Id": school.id,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ year }),
      })
      const res = await req.json();
      if (res.success) {
        dispatch(setSchoolData({ ...schoolData, academicYear: res.data }))
        onSuccess();
      } else {
        await Toast.show({
          text: res.message,
          position: "bottom",
          duration: "short"
        })
      }
    } catch (error) {
      await Toast.show({
        text: "Failed to start Academic session!",
        position: "bottom",
        duration: "short"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-800 mb-1">Important Prerequisite</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Before starting a new academic year, please ensure that any <strong>currently active academic year is closed</strong>.
            Transitioning to a new session without closing the previous one may affect data integrity.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">New Academic Session</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Define the label for the new school year (e.g., "2025-2026"). This will be used across all student records, fee cycles, and reports.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          label="Academic Year Label"
          name="year"
          placeholder="e.g. 2025-26"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            if (error) setError('');
          }}
          error={error}
          icon={<Calendar className="w-4 h-4" />}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-6">
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
        >
          <Save className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>
    </form>
  );
};