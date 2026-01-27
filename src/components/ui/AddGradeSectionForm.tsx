import React, { useState } from 'react';
import { Save, ChevronDown, Layers, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { notify, gradeOrderMap, formatGrade } from '../../services/utils';
import { setSchoolData } from '../../store/slices/authSlice';
import { API_BASE_URL as API } from '../config/api';

interface AddGradeSectionFormProps {
    onSuccess?: () => void;
    onCancel: () => void;
}

export const AddGradeSectionForm: React.FC<AddGradeSectionFormProps> = ({ onSuccess, onCancel }) => {
    const dispatch = useAppDispatch();
    const { school, schoolData } = useAppSelector(state => state.auth)
    const [gradeId, setGradeId] = useState<string>('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!gradeId) {
            newErrors.gradeId = "Please select a grade";
        }

        if (!name.trim()) {
            newErrors.name = "Section name is required";
        }
        else if (name.length > 10) {
            newErrors.name = "Section name must be 10 characters or less";
        }
        else if (!/^[A-Za-z0-9 ]+$/.test(name)) {
            newErrors.name = "Only letters, numbers, and spaces allowed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            const req = await fetch(`${API}/schools/${school.id}/grade/sections`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-School-Id": school.id,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ gradeId, name }),
            })
            const res = await req.json();
            if (res.success) {
                dispatch(setSchoolData({ ...schoolData, sections: [...schoolData.sections, res.data] }))
                onSuccess();
            } else {
                notify(res.message);
            }
        } catch (error) {

        }
    };
    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Header Info */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg h-fit">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">Add New Section</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Create a new section (e.g., "A", "Blue", "Science") and assign it to an existing grade level.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {/* Grade Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Select Grade <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                        <select
                            value={gradeId}
                            onChange={(e) => {
                                setGradeId(e.target.value);
                                if (errors.gradeId) setErrors(prev => ({ ...prev, gradeId: '' }));
                            }}
                            className={`
                            w-full px-4 py-3 pr-10 rounded-xl text-sm shadow-sm border appearance-none cursor-pointer bg-white transition-all
                            focus:outline-none focus:ring-2 focus:ring-offset-0
                            ${errors.gradeId
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                    : 'border-slate-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                                }
                        `}
                        >
                            <option value="" disabled>Choose a grade level...</option>
                            {schoolData.grades
                                .slice() // prevent redux/state mutation
                                .sort((a, b) => gradeOrderMap[a.grade] - gradeOrderMap[b.grade])
                                .map((element) => (
                                    <option key={element.id} value={element.id}>
                                        {formatGrade(element.grade)}
                                    </option>
                                ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                    {errors.gradeId && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1" /> {errors.gradeId}
                        </p>
                    )}
                </div>

                {/* Section Name Input */}
                <div>
                    <Input
                        label="Section Name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        placeholder="e.g. A, B, Science, Commerce"
                        error={errors.name}
                        required
                    />
                    <p className="text-[10px] text-slate-400 mt-1 pl-1">
                        Max 10 characters. Alphanumeric only.
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
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
                    Create Section
                </Button>
            </div>
        </form>
    );
};