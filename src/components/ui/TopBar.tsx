import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Check, Info, AlertTriangle, UserPlus, FileText } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  subtitle,
}) => {
  const { school } = useAppSelector(state => state.auth)
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock Notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'New Student Admitted',
      message: 'Rahul Sharma (Class 8-A) enrollment complete.',
      time: '2 min ago',
      icon: UserPlus,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Fee Payment Overdue',
      message: '15 students pending fees for Term 2.',
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: 3,
      type: 'info',
      title: 'Staff Meeting',
      message: 'Monthly staff meeting scheduled at 2:00 PM.',
      time: '3 hours ago',
      icon: Info,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      id: 4,
      type: 'system',
      title: 'Report Generated',
      message: 'Attendance report for Jan 2026 is ready.',
      time: 'Yesterday',
      icon: FileText,
      color: 'text-purple-500 bg-purple-50'
    }
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:flex flex-col">
          <h2 className="text-xl font-bold text-slate-800">{school.name}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-slate-400"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-full relative transition-all duration-200 ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-700">Mark all read</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                      <notif.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-xs font-semibold text-slate-600 hover:text-slate-900">View All Activity</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};