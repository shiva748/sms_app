import React, { useState } from 'react';
import { Calendar, Save, Power, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSchoolData } from '../../store/slices/authSlice';
import { notify } from '../../services/utils';

interface UpdateAcademicYearRequest {
    year?: string;
    active?: boolean;
}

interface UpdateAcademicYearFormProps {
    initialData?: UpdateAcademicYearRequest;
    onSuccess?: () => void;
    onCancel: () => void;
}

export const UpdateAcademicYearForm: React.FC<UpdateAcademicYearFormProps> = ({
    onSuccess,
    onCancel
}) => {
    const dispatch = useAppDispatch();
    const { school, schoolData } = useAppSelector((state) => state.auth)
    if (!schoolData || !schoolData.academicYear) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">No Active Academic Year</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                    There is no active academic session found. Please create a new session using the
                    <span className="font-medium"> "Start Session" </span>action on the dashboard.
                </p>
                <Button variant="ghost" onClick={onCancel} className="bg-slate-100 hover:bg-slate-200">
                    Close
                </Button>
            </div>
        );
    }
    const [year, setYear] = useState(schoolData.academicYear ? { year: schoolData.academicYear.year, active: schoolData.academicYear.active, id: schoolData.academicYear.id } : {});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const req = await fetch(`${API}/schools/${school.id}/academicyear`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "X-School-Id": school.id,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(year),
            })
            const res = await req.json();
            if (res.success) {
                dispatch(setSchoolData({ ...schoolData, academicYear: res.data.active ? res.data : null }))
                onSuccess();
            } else {
                notify(res.message)
            }
        } catch (error) {
            notify("Failed to update Academic session!")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Context Banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 flex gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg h-fit">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Update Academic Session</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Modify the academic year label or change its system status.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <Input
                    label="Academic Year Label"
                    name="year"
                    value={year.year}
                    onChange={(e) => setYear({ ...year, [e.target.name]: e.target.value })}
                    icon={<Calendar className="w-4 h-4" />}
                    placeholder="e.g. 2025-26"
                />

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition-all hover:border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${year.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Power className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 cursor-pointer" htmlFor="active-toggle">
                                    Session Status
                                </label>
                                <p className="text-xs text-slate-500">
                                    {year.active ? 'This session is currently active.' : 'This session is inactive.'}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                id="active-toggle"
                                type="checkbox"
                                name="active"
                                className="sr-only peer"
                                checked={year.active}
                                onChange={(e) => setYear({ ...year, [e.target.name]: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {!year.active && (
                        <div className="mt-3 flex items-start gap-2 text-amber-600 text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>Warning: Deactivating the current session will restrict data entry and modification for this academic year.</p>
                        </div>
                    )}
                </div>
            </div>

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
                    Update Changes
                </Button>
            </div>
        </form>
    );
};