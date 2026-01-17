import React from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-brand-700">
               <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
               <span className="text-xl font-bold hidden sm:block">EduSphere</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center px-3 py-2 bg-slate-100 rounded-lg w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search students, classes..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-medium text-sm">
              {userEmail.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation (Desktop) */}
          <nav className="hidden lg:block space-y-1">
            {[
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Overview', active: true },
              { icon: <Users className="w-5 h-5" />, label: 'Students', active: false },
              { icon: <Users className="w-5 h-5" />, label: 'Teachers', active: false },
              { icon: <BookOpen className="w-5 h-5" />, label: 'Courses', active: false },
              { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', active: false },
              { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-slate-200">
               <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
               >
                 <LogOut className="w-5 h-5" />
                 Sign Out
               </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back, Administrator!</h2>
              <p className="text-slate-500">Here's what's happening in your school today.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-brand-100 rounded-lg text-brand-600"><Users className="w-5 h-5" /></div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">1,234</div>
                  <div className="text-sm text-slate-500">Total Students</div>
                </div>

                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><BookOpen className="w-5 h-5" /></div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">42</div>
                  <div className="text-sm text-slate-500">Active Courses</div>
                </div>

                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Clock className="w-5 h-5" /></div>
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Pending</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">18</div>
                  <div className="text-sm text-slate-500">Approvals Needed</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                     <div className="flex-1">
                       <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                       <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                     </div>
                     <div className="text-xs text-slate-400">2h ago</div>
                   </div>
                 ))}
               </div>
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};