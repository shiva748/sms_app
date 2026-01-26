import React, { useState } from 'react';
import { ShieldAlert, Save, AlertCircle, ChevronDown, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

interface UpdateStudentStatusFormProps {
  studentName: string;
  currentStatus: string;
  onSuccess?: () => void;
  onCancel: () => void;
}

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
  studentName, 
  currentStatus,
  onSuccess, 
  onCancel 
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!reason) {
        setError('Please select a reason for this status change.');
        return;
    }
    if (reason === 'Other' && !remarks.trim()) {
        setError('Please provide detailed remarks when selecting "Other".');
        return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
        console.log("Update Status Payload:", { 
            studentName, 
            newStatus: status, 
            reason, 
            remarks 
        });
        if (onSuccess) onSuccess();
        setIsLoading(false);
    }, 1000);
  };

  const isDestructive = status === 'Suspended' || status === 'Expelled' || status === 'Inactive';

  return (
    <form onSubmit={handleSubmit} className="w-full">
        <div className={`border rounded-xl p-4 mb-6 flex gap-3 ${isDestructive ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
            <div className={`p-2 rounded-lg h-fit ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
                <h4 className={`text-sm font-bold mb-1 ${isDestructive ? 'text-red-800' : 'text-slate-800'}`}>Update Student Status</h4>
                <p className={`text-xs leading-relaxed ${isDestructive ? 'text-red-600' : 'text-slate-500'}`}>
                    Changing the status for <strong>{studentName}</strong> will affect their access to the portal and attendance records.
                </p>
            </div>
        </div>

        {/* Status Selection */}
        <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                New Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Active', 'Inactive', 'Suspended', 'Alumni', 'Transfer'].map((opt) => (
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

        {/* Reason Dropdown */}
        <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Reason for Change <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <select
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        setError('');
                    }}
                    className={`
                        w-full px-3 py-2.5 rounded-xl text-sm shadow-sm border appearance-none cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500
                        ${error && !reason ? 'border-red-500' : 'border-slate-300'}
                    `}
                >
                    <option value="" disabled>Select a reason...</option>
                    {REASON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>

        {/* Detailed Remarks */}
        <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Additional Remarks
            </label>
            <div className="relative">
                <textarea
                    rows={3}
                    className="w-full px-3 py-3 pl-10 rounded-xl text-sm shadow-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all resize-none"
                    placeholder="Provide specific details about this change (optional)..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
                <div className="absolute top-3 left-3 text-slate-400">
                    <FileText className="w-4 h-4" />
                </div>
            </div>
            {error && <p className="mt-2 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {error}</p>}
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