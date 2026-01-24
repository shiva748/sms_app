import React, { useState, useEffect } from 'react';
import {
  Users, GraduationCap, Banknote, FileBarChart, Plus, Wallet, Calendar,
  ArrowUpRight, ArrowDownRight, MoreVertical, Bell
} from 'lucide-react';
import StatCard from "../ui/Statcard";
import { Button } from '../ui/Button';
import { Sidebar } from '../ui/Sidebar';
import { TopBar } from '../ui/TopBar';
import { Modal } from '../ui/Modal';
import { StudentAdmissionForm } from '../ui/StudentAdmissionForm';
import { Toast } from '@capacitor/toast';
import { InviteTeacherForm } from '../ui/InviteTeacherForm';
import { LoadingScreen } from '../ui/LoadingScreen';
import { API_BASE_URL as API } from '../config/api';
import { useAppSelector } from '../../store/hooks';
export const HeadDashboard: React.FC = () => {
  const { school } = useAppSelector(state => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  // Modal State
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [data, setData] = useState({ teachers: "Loading...", students: "Loading..." })
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
    await Toast.show({
      text: "Student admitted successfully.",
      duration: "short",
      position: "bottom",
    })
  };

  const handleInviteTeacherSuccess = async () => {
    setShowInviteTeacherModal(false);
    await Toast.show({
      text: "Teacher invitation sent successfully!",
      duration: "short",
      position: "bottom",
    })
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
      setData(res.data);
      Toast.show({
        text: res.message,
        duration: "short",
        position: "bottom"
      })
    }
    setIsLoading(false)
  }
  useEffect(() => {
    fetchDashboard()
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden">

        {/* Reusable TopBar Component */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

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
              title="Total Students"
              value={data.students}
              icon={GraduationCap}
              color="bg-blue-500 text-blue-600"
            />
            <StatCard
              title="Total Staff"
              value={data.teachers}
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

          {/* Content Split: Main + Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column (Charts/Tables) */}
            <div className="lg:col-span-2 space-y-8">

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Add Student', icon: Plus, color: 'bg-indigo-50 text-indigo-600', onClick: () => setShowAdmissionModal(true) },
                    { label: 'Collect Fee', icon: Banknote, color: 'bg-emerald-50 text-emerald-600', onClick: () => { } },
                    { label: 'Send Notice', icon: Bell, color: 'bg-amber-50 text-amber-600', onClick: () => { } },
                    { label: 'Add Staff', icon: Users, color: 'bg-pink-50 text-pink-600', onClick: () => setShowInviteTeacherModal(true) },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className={`p-3 rounded-full ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
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

    </div>
  );
};