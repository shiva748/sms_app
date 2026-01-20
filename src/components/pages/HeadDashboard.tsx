import React, { useState, useEffect } from 'react';
import {
  Users, GraduationCap, Banknote, FileBarChart, Plus, Wallet, Calendar,
  ArrowUpRight, ArrowDownRight, MoreVertical, Bell
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Sidebar } from '../ui/Sidebar';
import { TopBar } from '../ui/TopBar';
import { Modal } from '../ui/Modal';
import { StudentAdmissionForm } from '../ui/StudentAdmissionForm';
import { useAppSelector } from '../../store/hooks';

export const HeadDashboard: React.FC = () => {
  const { school } = useAppSelector((state) => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal State
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset body background style when entering this dashboard
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc'; // slate-50
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleAdmissionSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API Call
    console.log("Submitting Admission Data:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowAdmissionModal(false);
      alert("Student admitted successfully!");
    }, 2000);
  };

  const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, color }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{value}</h3>
        <div className="flex items-center gap-2">
          <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trendValue}
          </span>
          <span className="text-slate-400 text-xs">{subtext}</span>
        </div>
      </div>
    </div>
  );

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
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          title={school.name}
          subtitle={`${school.city}, ${school.state}`}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">

          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Good morning! Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl px-4 py-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-700" />
                <span className="text-slate-700">View Calendar</span>
              </Button>

              <Button
                onClick={() => setShowAdmissionModal(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 rounded-xl px-5 py-2.5 font-semibold flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Admission
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value="2,543"
              subtext="vs last month"
              trend="up"
              trendValue="12%"
              icon={GraduationCap}
              color="bg-blue-500 text-blue-600"
            />
            <StatCard
              title="Total Staff"
              value="145"
              subtext="vs last month"
              trend="up"
              trendValue="4%"
              icon={Users}
              color="bg-purple-500 text-purple-600"
            />
            <StatCard
              title="Fee Collection"
              value="₹ 4.2L"
              subtext="Today's collection"
              trend="down"
              trendValue="2.5%"
              icon={Wallet}
              color="bg-emerald-500 text-emerald-600"
            />
            <StatCard
              title="Pending Dues"
              value="₹ 12.5L"
              subtext="Total outstanding"
              trend="down"
              trendValue="8%"
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
                    { label: 'Add Staff', icon: Users, color: 'bg-pink-50 text-pink-600', onClick: () => { } },
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

              {/* Financial Chart Placeholder */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Fee Collection Analytics</h3>
                    <p className="text-sm text-slate-500">Monthly revenue breakdown</p>
                  </div>
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                </div>

                {/* Dummy Chart Visual */}
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden">
                      <div
                        style={{ height: `${h}%` }}
                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-400 px-2 font-medium">
                  <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                  <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                </div>
              </div>
            </div>

            {/* Right Column (Activity/Notices) */}
            <div className="space-y-8">

              {/* Recent Admissions */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Recent Admissions</h3>
                  <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {['S', 'A', 'R', 'M'][i - 1]}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-800">Student Name {i}</h4>
                        <p className="text-xs text-slate-500">Class {8 + i} - A</p>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Presence */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Staff Presence</h3>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-500">Present</span>
                  <span className="font-bold text-slate-900">132 / 145</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-emerald-500 w-[91%]"></div>
                </div>

                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-500">On Leave</span>
                  <span className="font-bold text-slate-900">8</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-amber-500 w-[6%]"></div>
                </div>

                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-500">Absent</span>
                  <span className="font-bold text-slate-900">5</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[3%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Student Admission Modal */}
      <Modal
        isOpen={showAdmissionModal}
        onClose={() => !isSubmitting && setShowAdmissionModal(false)}
        title="New Student Admission"
        maxWidth="4xl"
      >
        <StudentAdmissionForm
          onSubmit={handleAdmissionSubmit}
          onCancel={() => setShowAdmissionModal(false)}
          isLoading={isSubmitting}
        />
      </Modal>

    </div>
  );
};