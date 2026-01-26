import React, { useState } from 'react';
import { Save, ChevronDown, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Toast } from '@capacitor/toast';
import { setSchoolData } from '../../store/slices/authSlice';

// Grade Enum Mapping
const GRADE_OPTIONS = [
    { value: 'PRE_NURSERY', label: 'Pre Nursery' },
    { value: 'NURSERY', label: 'Nursery' },
    { value: 'LKG', label: 'LKG' },
    { value: 'UKG', label: 'UKG' },
    { value: 'GRADE_1', label: 'Grade 1' },
    { value: 'GRADE_2', label: 'Grade 2' },
    { value: 'GRADE_3', label: 'Grade 3' },
    { value: 'GRADE_4', label: 'Grade 4' },
    { value: 'GRADE_5', label: 'Grade 5' },
    { value: 'GRADE_6', label: 'Grade 6' },
    { value: 'GRADE_7', label: 'Grade 7' },
    { value: 'GRADE_8', label: 'Grade 8' },
    { value: 'GRADE_9', label: 'Grade 9' },
    { value: 'GRADE_10', label: 'Grade 10' },
    { value: 'GRADE_11', label: 'Grade 11' },
    { value: 'GRADE_12', label: 'Grade 12' },
];

interface AddSchoolGradeFormProps {
    onSuccess?: () => void;
    onCancel: () => void;
}

export const AddSchoolGradeForm: React.FC<AddSchoolGradeFormProps> = ({ onSuccess, onCancel }) => {
    const dispatch = useAppDispatch();
    const { school, schoolData } = useAppSelector(state => state.auth);
    const [grade, setGrade] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(schoolData);
        e.preventDefault();
        if (!grade) {
            setError('Please select a grade to add');
            return;
        } else if (schoolData.grades.some((element) => element.grade === grade)) {
            await Toast.show({
                text: "Grade already exists.",
                position: "bottom",
                duration: "short"
            })
        }
        else {
            setIsLoading(true);
            try {
                const req = await fetch(`${API}/schools/${school.id}/grades`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-School-Id": school.id,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ grade }),
                })
                const res = await req.json();
                if (res.success) {
                    dispatch(setSchoolData({ ...schoolData, grades: [...schoolData.grades, res.data] }))
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
                    text: "Failed to add Grade!",
                    position: "bottom",
                    duration: "short"
                })
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg h-fit">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">Add New Grade Level</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Select a grade to add to your school's academic structure. You can later assign sections and subjects to this grade.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Select Grade <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                    <select
                        value={grade}
                        onChange={(e) => {
                            setGrade(e.target.value);
                            setError('');
                        }}
                        className={`
                        w-full px-4 py-3 pr-10 rounded-xl text-sm shadow-sm border appearance-none cursor-pointer bg-white transition-all
                        focus:outline-none focus:ring-2 focus:ring-offset-0
                        ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }
                    `}
                    >
                        <option value="" disabled>Choose a grade level...</option>
                        {GRADE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-500 flex items-center animate-pulse">{error}</p>}
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Create Grade
                </Button>
            </div>
        </form>
    );
};