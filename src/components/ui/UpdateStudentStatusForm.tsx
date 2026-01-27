import React, { useState } from 'react';
import { ShieldAlert, Save, AlertCircle, ChevronDown, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { API_BASE_URL as API } from '../config/api';
import { notify } from '../../services/utils';
interface UpdateStudentStatusFormProps {
    studentName: string;
    currentStatus: string;
    onSuccess?: () => void;
    onCancel: () => void;
}
import { useAppSelector } from '../../store/hooks';
// Predefined reasons based on status context
const REASON_OPTIONS = [
    "Academic Performance",
    "Disciplinary Action",
    "Fee Default",
    "Medical Leave",
    "Transfer / Relocation",
    "Graduated",
    "Parent Request",
    "Administrative Error",
    "Other"
];

export const UpdateStudentStatusForm: React.FC<UpdateStudentStatusFormProps> = ({
    student,
    onSuccess,
    onCancel
}) => {
    const { school } = useAppSelector(state => state.auth)
    const [status, setStatus] = useState(student.status);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const req = await fetch(`${API}/schools/${school.id}/students/status`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "X-School-Id": school.id,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: student.id,
                    status
                }),
            })
            const res = await req.json();
            if (res.success) {
                onSuccess(res.data);
            }
            notify(res.message)

        } catch (error) {
            console.error("Admission failed:", error);
            alert("Failed to admit student. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const isDestructive = status === 'INACTIVE' || status === 'TRANSFERRED' || status === 'ALUMNI';

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`border rounded-xl p-4 mb-6 flex gap-3 ${isDestructive ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`p-2 rounded-lg h-fit ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                    <h4 className={`text-sm font-bold mb-1 ${isDestructive ? 'text-red-800' : 'text-slate-800'}`}>Update Student Status</h4>
                    <p className={`text-xs leading-relaxed ${isDestructive ? 'text-red-600' : 'text-slate-500'}`}>
                        Changing the status for <strong>{student.name}</strong> will affect their access to the portal and attendance records.
                    </p>
                </div>
            </div>

            {/* Status Selection */}
            <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    New Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRANSFERRED', 'ALUMNI'].map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setStatus(opt)}
                            className={`
                            px-3 py-2 rounded-lg text-xs font-semibold border transition-all
                            ${status === opt
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }
                        `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                    className={`${isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'} text-white min-w-[120px] shadow-lg border-none`}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
};