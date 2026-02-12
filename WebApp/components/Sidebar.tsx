
import React from 'react';
import { Inbox, Users, Settings, BarChart3, LayoutDashboard } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  activeTab: View;
  setActiveTab: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'workload', label: 'Team Load', icon: Users },
    { id: 'sla', label: 'SLA Rules', icon: Settings },
    { id: 'report', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-72 flex flex-col py-8 px-6 bg-[#FDFCF9]">
      <div className="flex items-center gap-3 px-4 mb-12">
        <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-100">
          <LayoutDashboard className="text-white" size={24} />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-900">ServiceFlow</span>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as View)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-200 group focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none active:scale-95 ${isActive
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                  : 'text-slate-600 hover:bg-orange-100/40 hover:text-slate-900'
                }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-500'} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-6 bg-orange-100/30 rounded-[2rem] border border-orange-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white overflow-hidden">
            <img src="https://picsum.photos/seed/supervisor/100" alt="Avatar" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none">Alex Supervisor</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">Level 4 Admin</p>
          </div>
        </div>
        <button className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none rounded-lg py-2">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
