import React, { useState } from 'react';
import { BookOpen, Save, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppSelector } from '../../store/hooks';
import { notify, formatGrade, gradeOrderMap } from '../../services/utils';
import { API_BASE_URL as API } from '../config/api';
interface AssignClassFormProps {
    studentName: string;
    currentGrade?: string;
    currentSection?: string;
    currentRollNumber?: string;
    onSuccess?: () => void;
    onCancel: () => void;
}

export const AssignClassForm: React.FC<AssignClassFormProps> = ({
    student,
    currentGrade = '',
    currentSection = '',
    currentRollNumber = '',
    onSuccess,
    onCancel
}) => {
    const formatGrade = (grade) => {
        return grade
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const { school, schoolData } = useAppSelector((state) => state.auth)
    const [grade, setGrade] = useState(currentGrade);
    const [section, setSection] = useState(currentSection);
    const [rollNumber, setRollNumber] = useState(currentRollNumber);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const req = await fetch(`${API}/schools/${school.id}/student/enroll`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-School-Id": school.id,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: student.id, gradeId: grade, sectionId: section, rollNumber
                }),
            })
            const res = await req.json();
            if (res.success) {
                onSuccess(res.data);
            }
            notify(res.message)

        } catch (error) {
            notify("Failed to enroll student. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const SelectStyles = "w-full px-3 py-2.5 sm:py-3 rounded-xl text-xs xs:text-sm shadow-sm border border-slate-300 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 hover:border-slate-400 transition-all appearance-none cursor-pointer";

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg h-fit">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">Class Enrollment</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Assigning <strong>{student.name}</strong> to a specific academic class and section.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Grade Select */}
                <div>
                    <label className="block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-slate-700">
                        Grade / Class <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={SelectStyles}
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Grade</option>
                        {schoolData.grades
                            .slice() // prevent redux/state mutation
                            .sort((a, b) => gradeOrderMap[a.grade] - gradeOrderMap[b.grade])
                            .map((element) => (
                                <option key={element.id} value={element.id}>
                                    {formatGrade(element.grade)}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Section Select */}
                <div>
                    <label className="block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-slate-700">
                        Section <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={SelectStyles}
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        required
                    >
                        {grade == '' ? <option value="">Select a grade first</option> : <><option value="">All Sections</option>
                            {schoolData.sections.filter((s) => s.gradeId == grade).map(sec => (
                                <option key={sec.id} value={sec.id}>{sec.name}</option>
                            ))}</>}
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    label="Roll Number"
                    placeholder="e.g. 24"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    icon={<Hash className="w-4 h-4" />}
                    rightElement={
                        <div className="pr-3 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Optional
                        </div>
                    }
                />
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Enrollment
                </Button>
            </div>
        </form>
    );
};