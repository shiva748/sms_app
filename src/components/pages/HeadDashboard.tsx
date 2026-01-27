import React, { useState, useEffect } from 'react';
import {
  Users, GraduationCap, FileBarChart, Plus, Wallet, Bell, BookOpen, Clock, Edit3, Layers
} from 'lucide-react';
import StatCard from "../ui/StatCard";
import { Button } from '../ui/Button';
import { Sidebar } from '../ui/Sidebar';
import { TopBar } from '../ui/TopBar';
import { Modal } from '../ui/Modal';
import { StudentAdmissionForm } from '../ui/StudentAdmissionForm';
import { InviteTeacherForm } from '../ui/InviteTeacherForm';
import { LoadingScreen } from '../ui/LoadingScreen';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSchoolData } from "../../store/slices/authSlice"
import { AddSchoolGradeForm } from '../ui/AddSchoolGradeForm';
import { StartAcademicYearForm } from '../ui/StartAcademicYearForm';
import { UpdateAcademicYearForm } from '../ui/UpdateAcademicYear';
import { AddGradeSectionForm } from '../ui/AddGradeSectionForm';
import { notify } from '../../services/utils';
export const HeadDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { school, schoolData } = useAppSelector(state => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showStartAcademicYearModal, setShowStartAcademicYearModal] = useState(false);
  const [showUpdateYearModal, setShowUpdateYearModal] = useState(false);
  // Modal State
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showInviteTeacherModal, setShowInviteTeacherModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset body background style when entering this dashboard
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc'; // slate-50
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleAdmissionSuccess = async () => {
    setShowAdmissionModal(false);
    // In a real app, you would likely trigger a data refresh here
    notify("Student admitted successfully.")
  };

  const handleInviteTeacherSuccess = async () => {
    setShowInviteTeacherModal(false);
    notify("Teacher invitation sent successfully!")
  }
  const handleAddGradeSuccess = async () => {
    setShowAddGradeModal(false);
    notify("Grade added successfully!")
  }
  const handleStartYearSuccess = async () => {
    setShowStartAcademicYearModal(false);
    notify("Academic year started!")
  }

  const handleUpdateYearSuccess = async () => {
    setShowUpdateYearModal(false);
    notify("Academic year modified!")
  }
  const handleAddSectionSuccess = async () => {
    setShowAddSectionModal(false);
    notify("Section added successfully!")
  }
  const fetchDashboard = async () => {
    setIsLoading(true)
    const req = await fetch(`${API}/schoolhead/dashboard`, {
      method: "GET",
      credentials: "include",
      headers: { "X-School-Id": school.id }
    });
    const res = await req.json();
    if (res.success) {
      dispatch(setSchoolData(res.data));
      notify(res.message)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    if (schoolData == null) {
      fetchDashboard();
    }
  }, [])


  if (isLoading) {
    return <LoadingScreen variant="light" message="Loading Dashboard" type="simple" />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* Reusable Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab="dashboard"
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden">

        {/* Reusable TopBar Component */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} subtitle={"Dashboard"} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 pb-24">

          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Good morning! Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowInviteTeacherModal(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl px-4 py-2 flex items-center">
                <Plus className="w-4 h-4 mr-2 text-slate-700" />
                <span className="text-slate-700">Add Teacher</span>
              </Button>

              <Button
                onClick={() => setShowAdmissionModal(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 rounded-xl px-5 py-2.5 font-semibold flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Students"
              value={schoolData != null ? schoolData.students : "loading..."}
              icon={GraduationCap}
              color="bg-blue-500 text-blue-600"
            />
            <StatCard
              title="Total Staff"
              value={schoolData != null ? schoolData.teachers : "loading..."}
              icon={Users}
              color="bg-purple-500 text-purple-600"
            />
            <StatCard
              title="Fee Collection"
              value="₹ 4.2L"
              icon={Wallet}
              color="bg-emerald-500 text-emerald-600"
            />
            <StatCard
              title="Pending Dues"
              value="₹ 12.5L"
              icon={FileBarChart}
              color="bg-orange-500 text-orange-600"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { label: 'Start Session', icon: Clock, color: 'bg-blue-50 text-blue-600', onClick: () => setShowStartAcademicYearModal(true) },
                { label: 'Update Session', icon: Edit3, color: 'bg-cyan-50 text-cyan-600', onClick: () => setShowUpdateYearModal(true) },
                { label: 'Add Staff', icon: Users, color: 'bg-pink-50 text-pink-600', onClick: () => setShowInviteTeacherModal(true) },
                { label: 'Add Student', icon: Plus, color: 'bg-indigo-50 text-indigo-600', onClick: () => setShowAdmissionModal(true) },
                { label: 'Add Grade', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600', onClick: () => setShowAddGradeModal(true) },
                { label: 'Add Section', icon: Layers, color: 'bg-pink-50 text-pink-600', onClick: () => setShowAddSectionModal(true) },
                { label: 'Send Notice', icon: Bell, color: 'bg-amber-50 text-amber-600', onClick: () => { } },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className={`p-3 rounded-full ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 whitespace-nowrap">{action.label}</span>
                </button>
              ))}
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

      {/* Invite Teacher Modal */}
      <Modal
        isOpen={showInviteTeacherModal}
        onClose={() => setShowInviteTeacherModal(false)}
        title="Invite Teacher"
        maxWidth="md"
      >
        <InviteTeacherForm
          onSuccess={handleInviteTeacherSuccess}
          onCancel={() => setShowInviteTeacherModal(false)}
        />
      </Modal>
      <Modal
        isOpen={showAddGradeModal}
        onClose={() => setShowAddGradeModal(false)}
        title="Add School Grade"
        maxWidth="md"
      >
        <AddSchoolGradeForm
          onSuccess={handleAddGradeSuccess}
          onCancel={() => setShowAddGradeModal(false)}
        />
      </Modal>
      {/* Start Academic Year Modal */}
      <Modal
        isOpen={showStartAcademicYearModal}
        onClose={() => setShowStartAcademicYearModal(false)}
        title="Start Academic Year"
        maxWidth="md"
      >
        <StartAcademicYearForm
          onSuccess={handleStartYearSuccess}
          onCancel={() => setShowStartAcademicYearModal(false)}
        />
      </Modal>
      {/* Update Academic Year Modal */}
      <Modal
        isOpen={showUpdateYearModal}
        onClose={() => setShowUpdateYearModal(false)}
        title="Update Academic Year"
        maxWidth="md"
      >
        <UpdateAcademicYearForm
          onSuccess={handleUpdateYearSuccess}
          onCancel={() => setShowUpdateYearModal(false)}
        />
      </Modal>
      <Modal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        title="Add Grade Section"
        maxWidth="md"
      >
        <AddGradeSectionForm
          onSuccess={handleAddSectionSuccess}
          onCancel={() => setShowAddSectionModal(false)}
        />
      </Modal>
    </div>
  );
};