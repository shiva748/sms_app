import React from 'react';
import {
    User, Phone, Mail, Calendar, ShieldAlert, BookOpen, FileEdit, GraduationCap, Flag
} from 'lucide-react';
import { FILE_BASE_URL } from '../config/api';
interface StudentDetailViewProps {
    student: any;
    onClose: () => void;
    onEdit: () => void;
    onAssignClass: () => void;
    onUpdateStatus: () => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
    student,
    onClose,
    onEdit,
    onAssignClass,
    onUpdateStatus
}) => {
    if (!student) return null;

    return (
        <div className="flex flex-col bg-white pb-10">
            {/* Top Section: Avatar & Identity */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg flex-shrink-0 ${student.avatarColor || 'bg-indigo-500'}`}>
                    <img className={"w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center "} src={`${FILE_BASE_URL}/${student.photo}`} alt={student.name.charAt(0)} srcset="" />
                </div>

                <div className="flex-1 space-y-2 pt-2 text-center sm:text-left w-full">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{student.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">Admission No: <span className="text-slate-700">{student.admissionNumber ? student.admissionNumber : "N/A"}</span></p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                        ${student.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                student.status === 'INACTIVE' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-red-50 text-red-700 border-red-100'}
                    `}>
                            {student.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <button
                    onClick={onEdit}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-100 transition-all group"
                >
                    <FileEdit className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-sm">Edit Profile</span>
                </button>
                <button
                    onClick={onAssignClass}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-100 transition-all group"
                >
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-sm">Enroll / Class</span>
                </button>
                <button
                    onClick={onUpdateStatus}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-100 transition-all group"
                >
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-sm">Update Status</span>
                </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">

                {/* Academic Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 mb-3">Academic Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">Current Class</span>
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                                <GraduationCap className="w-4 h-4 text-indigo-500" />
                                {student.grade ? `Class ${student.grade}` : 'N/A'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">Section</span>
                            <div className="font-bold text-slate-800">
                                {student.section || '-'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">Roll Number</span>
                            <div className="font-bold text-slate-800">
                                {student.rollNumber || '-'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">Year</span>
                            <div className="font-bold text-slate-800">
                                {student.session || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 mb-3">Personal Information</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Date of Birth</p>
                                <p className="text-sm font-semibold text-slate-800">{student.dateOfBirth || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guardian Info */}
                <div className="lg:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Guardian Contact</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Guardian Name Tile */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 flex-shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-slate-800 text-sm truncate">{student.primaryContactName}</p>
                                <p className="text-xs text-slate-500">Primary Guardian</p>
                            </div>
                        </div>

                        {/* Phone Tile */}
                        <a href={`tel:${student.primaryContactPhone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{student.primaryContactPhone}</p>
                                <p className="text-xs text-slate-500">Phone Number</p>
                            </div>
                        </a>

                        {/* Email Tile */}
                        {student.primaryContactEmail && (
                            <a href={`mailto:${student.primaryContactEmail}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors sm:col-span-2 lg:col-span-1">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="font-bold text-slate-800 text-sm truncate" title={student.primaryContactEmail}>{student.primaryContactEmail}</p>
                                    <p className="text-xs text-slate-500">Email Address</p>
                                </div>
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};