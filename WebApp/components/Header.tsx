
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, AlertCircle, Info, CheckCircle2, X, Trash2 } from 'lucide-react';
import { Notification } from '../App';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewTicket: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onNewTicket,
  notifications,
  onMarkRead,
  onClear
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <AlertCircle size={14} className="text-rose-500" />;
      case 'success': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return <Info size={14} className="text-indigo-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-50 relative z-50">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets, IDs, clients..."
          className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none transition-all placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-2xl transition-all duration-300 ${showNotifications ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100'
              }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-orange-50/10">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">You have {unreadCount} unread alerts</p>
                </div>
                <button
                  onClick={onClear}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkRead(n.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onMarkRead(n.id)}
                      className={`p-6 border-b border-slate-50 last:border-none cursor-pointer transition-colors relative group hover:bg-indigo-50/50 focus:ring-2 focus:ring-indigo-500 focus:ring-inset outline-none ${n.isRead ? 'bg-white opacity-60' : 'bg-indigo-50/30'
                        }`}
                    >
                      {!n.isRead && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      )}
                      <div className="flex gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? 'bg-rose-50' : n.type === 'success' ? 'bg-emerald-50' : 'bg-indigo-50'
                          }`}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">{n.title}</h4>
                            <span className="text-[9px] font-black text-slate-500 uppercase whitespace-nowrap">{getTimeAgo(n.timestamp)}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-300">
                    <Bell size={40} className="mx-auto mb-4 opacity-10" />
                    <p className="text-xs font-black uppercase tracking-widest">Inbox Zero</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">No new notifications</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 bg-slate-50 text-center">
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                    View All Activity
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onNewTicket}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          NEW TICKET
        </button>
      </div>
    </header>
  );
};

export default Header;
