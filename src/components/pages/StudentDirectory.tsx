import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, FileEdit, Download, ChevronDown, User, SlidersHorizontal, X, Loader2, Calendar, Phone
} from 'lucide-react';
import { Sidebar } from '../ui/Sidebar';
import { TopBar } from '../ui/TopBar';
import { Modal } from '../ui/Modal';
import { StudentAdmissionForm } from '../ui/StudentAdmissionForm';
import { LoadingScreen } from '../ui/LoadingScreen';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAppSelector } from '../../store/hooks';

const gradeOrderMap = {
  PRE_NURSERY: 0,
  NURSERY: 1,
  LKG: 2,
  UKG: 3,
  GRADE_1: 4,
  GRADE_2: 5,
  GRADE_3: 6,
  GRADE_4: 7,
  GRADE_5: 8,
  GRADE_6: 9,
  GRADE_7: 10,
  GRADE_8: 11,
  GRADE_9: 12,
  GRADE_10: 13,
  GRADE_11: 14,
  GRADE_12: 15,
};

// Mock Data
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Aarav Patel",
    dateOfBirth: "2008-05-15",
    primaryContactName: "Rajesh Patel",
    primaryContactPhone: "9876543210",
    status: "Active",
    avatarColor: "bg-blue-100 text-blue-600",
    grade: "10",
    section: "A"
  },
  {
    id: 2,
    name: "Diya Sharma",
    dateOfBirth: "2008-08-22",
    primaryContactName: "Sunita Sharma",
    primaryContactPhone: "9876543211",
    status: "Active",
    avatarColor: "bg-purple-100 text-purple-600",
    grade: "10",
    section: "A"
  },
  {
    id: 3,
    name: "Rohan Gupta",
    dateOfBirth: "2009-02-10",
    primaryContactName: "Amit Gupta",
    primaryContactPhone: "9876543212",
    status: "Inactive",
    avatarColor: "bg-orange-100 text-orange-600",
    grade: "9",
    section: "B"
  },
  {
    id: 4,
    name: "Sanya Malhotra",
    dateOfBirth: "2008-11-05",
    primaryContactName: "Vikram Malhotra",
    primaryContactPhone: "9876543213",
    status: "Active",
    avatarColor: "bg-emerald-100 text-emerald-600",
    grade: "10",
    section: "B"
  },
  {
    id: 5,
    name: "Kabir Singh",
    dateOfBirth: "2006-07-18",
    primaryContactName: "Preeti Singh",
    primaryContactPhone: "9876543214",
    status: "Suspended",
    avatarColor: "bg-red-100 text-red-600",
    grade: "12",
    section: "Science"
  },
  {
    id: 6,
    name: "Ishaan Khatter",
    dateOfBirth: "2010-01-30",
    primaryContactName: "Neelima Azeem",
    primaryContactPhone: "9876543215",
    status: "Active",
    avatarColor: "bg-indigo-100 text-indigo-600",
    grade: "8",
    section: "C"
  },
];

export const StudentDirectory: React.FC = () => {
  const formatGrade = (grade) => {
    return grade
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const { schoolData } = useAppSelector((state) => state.auth)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Search State
  const [displayedStudents, setDisplayedStudents] = useState(MOCK_STUDENTS);
  const [isSearching, setIsSearching] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    grade: '',
    section: ''
  });

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'dashboard') navigate('/head/dashboard');
    if (tabId === 'students') navigate('/head/students');
    // Add other routes as needed
  };

  const handleAdmissionSuccess = () => {
    setShowAdmissionModal(false);
    alert("Student admitted successfully!");
  };

  // Filter Logic
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ name: '', status: '', grade: '', section: '' });
    setDisplayedStudents(MOCK_STUDENTS);
  };

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate API Call
    setTimeout(() => {
      const results = MOCK_STUDENTS.filter(student => {
        const matchName = student.name.toLowerCase().includes(filters.name.toLowerCase()) ||
          student.primaryContactName.toLowerCase().includes(filters.name.toLowerCase());
        const matchStatus = filters.status ? student.status === filters.status : true;
        const matchGrade = filters.grade ? student.grade === filters.grade : true;
        const matchSection = filters.section ? student.section === filters.section : true;

        return matchName && matchStatus && matchGrade && matchSection;
      });

      setDisplayedStudents(results);
      setIsSearching(false);
    }, 800); // 800ms delay to simulate API
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const SelectStyles = "w-full px-3 py-2.5 sm:py-3 rounded-xl text-xs xs:text-sm shadow-sm border border-slate-300 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 hover:border-slate-400 transition-all appearance-none cursor-pointer";

  if (isLoading) {
    return <LoadingScreen variant="light" type="simple" message="Loading Directory..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab="students"
        onTabChange={handleTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden">

        {/* TopBar Component */}
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          title="Student Management"
          subtitle="Directory"
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 pb-24">
          <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
                <p className="text-sm text-slate-500">Manage and search student records</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => setShowAdmissionModal(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            {/* Search & Filter Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-700">
                <Filter className="w-4 h-4 text-indigo-500" />
                Search Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onKeyDown={handleKeyDown}>
                {/* Name Search */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <Input
                    label="Search Student"
                    variant="light"
                    placeholder="Name or Guardian"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    className="mb-0"
                  />
                </div>

                {/* Grade Select */}
                <div>
                  <label className="block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-slate-700">
                    Grade / Class
                  </label>
                  <div className="relative">
                    <select
                      className={SelectStyles}
                      value={filters.grade}
                      onChange={(e) => handleFilterChange('grade', e.target.value)}
                    >
                      <option value="">All Grades</option>
                      {schoolData.grades
                        .slice() // prevent redux/state mutation
                        .sort((a, b) => gradeOrderMap[a.grade] - gradeOrderMap[b.grade])
                        .map((element) => (
                          <option key={element.id} value={element.id}>
                            {formatGrade(element.grade)}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Section Select */}
                <div>
                  <label className="block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-slate-700">
                    Section
                  </label>
                  <div className="relative">
                    <select
                      className={SelectStyles}
                      value={filters.section}
                      onChange={(e) => handleFilterChange('section', e.target.value)}
                    >
                      <option value="">All Sections</option>
                      {['A', 'B', 'C', 'D', 'Science', 'Commerce', 'Arts'].map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Select */}
                <div>
                  <label className="block text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-slate-700">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      className={SelectStyles}
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                {(filters.name || filters.status || filters.grade || filters.section) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors px-3 py-2"
                  >
                    <X className="w-3 h-3" />
                    Clear Filters
                  </button>
                )}

                <Button
                  onClick={handleSearch}
                  isLoading={isSearching}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                >
                  {!isSearching && <Search className="w-4 h-4 mr-2" />}
                  {isSearching ? 'Searching...' : 'Search Records'}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-700 text-sm">
                  Search Results <span className="ml-2 text-slate-400 font-normal">({displayedStudents.length})</span>
                </h3>
                <button className="text-slate-500 hover:text-indigo-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="relative min-h-[200px]">
                {/* Search Loading Overlay */}
                {isSearching && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                      <span className="text-sm font-medium text-slate-600">Fetching results...</span>
                    </div>
                  </div>
                )}

                {/* DESKTOP VIEW: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Date of Birth</th>
                        <th className="px-6 py-4">Guardian Name</th>
                        <th className="px-6 py-4">Guardian Phone</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedStudents.length > 0 ? (
                        displayedStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${student.avatarColor}`}>
                                  {student.name.charAt(0)}
                                </div>
                                <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-sm">{student.dateOfBirth}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-slate-700">{student.primaryContactName}</span>
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`tel:${student.primaryContactPhone}`}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group/phone"
                                title="Click to Call"
                              >
                                <Phone className="w-3.5 h-3.5 text-slate-400 group-hover/phone:text-indigo-500" />
                                <span className="text-sm font-medium">{student.primaryContactPhone}</span>
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  student.status === 'Inactive' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-red-50 text-red-700 border-red-100'}
                              `}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-emerald-500' :
                                  student.status === 'Inactive' ? 'bg-slate-400' :
                                    'bg-red-500'
                                  }`}></span>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Profile">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                  <FileEdit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-medium mb-1">No students found</h3>
                            <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE VIEW: Card List */}
                <div className="md:hidden bg-slate-50/50">
                  {displayedStudents.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {displayedStudents.map((student) => (
                        <div key={student.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${student.avatarColor}`}>
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                                  <Calendar className="w-3 h-3" />
                                  <span className="text-xs">{student.dateOfBirth}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border
                              ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                student.status === 'Inactive' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                  'bg-red-50 text-red-700 border-red-100'}
                            `}>
                              {student.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-1">
                              <span className="uppercase font-bold text-slate-400 text-[10px]">Guardian Name</span>
                              <span className="font-medium text-slate-700">{student.primaryContactName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="uppercase font-bold text-slate-400 text-[10px]">Guardian Phone</span>
                              <a
                                href={`tel:${student.primaryContactPhone}`}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors group/phone cursor-pointer"
                              >
                                <Phone className="w-3 h-3 text-slate-400 group-hover/phone:text-indigo-500" />
                                <span className="font-medium text-slate-700 group-hover/phone:text-indigo-700">{student.primaryContactPhone}</span>
                              </a>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-1">
                            <Button variant="outline" className="flex-1 h-9 text-xs justify-center bg-white border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View Profile
                            </Button>
                            <Button variant="outline" className="flex-1 h-9 text-xs justify-center bg-white border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200">
                              <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-medium mb-1 text-sm">No students found</h3>
                      <p className="text-slate-500 text-xs">Adjust filters to search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {displayedStudents.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span>Showing 1 to {displayedStudents.length} of {displayedStudents.length} entries</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Student Admission Modal */}
      <Modal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
        title="New Student Admission"
        maxWidth="4xl"
      >
        <StudentAdmissionForm
          onSuccess={handleAdmissionSuccess}
          onCancel={() => setShowAdmissionModal(false)}
        />
      </Modal>
    </div>
  );
};