
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Ticket, Agent, Priority } from '../types';
import { X, History, MessageSquare, ExternalLink, ShieldCheck, Send, Tag, Users, AlertCircle, Clock, Activity, ArrowLeft, Edit3, Check, User } from 'lucide-react';
import AgentSelector from './AgentSelector';

interface Customer360Props {
  ticket: Ticket;
  allTickets: Ticket[];
  agents: Agent[];
  onClose: () => void;
  onStatusUpdate: (id: string) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onAddNote: (ticketId: string, content: string, newStatus?: Ticket['status']) => void;
  onSelectTicket?: (id: string) => void;
  rootTicketId?: string | null;
}

const Customer360: React.FC<Customer360Props> = ({ 
  ticket, 
  allTickets, 
  agents, 
  onClose, 
  onStatusUpdate, 
  onUpdateTicket, 
  onAddNote, 
  onSelectTicket,
  rootTicketId
}) => {
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Ticket['status']>(ticket.status);
  const [showConfirmResolve, setShowConfirmResolve] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(ticket.subject);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setSelectedStatus(ticket.status);
  }, [ticket.id, ticket.status]);

  useEffect(() => {
    setEditedTitle(ticket.subject);
  }, [ticket.subject]);

  const customerHistory = allTickets.filter(t => t.email === ticket.email && t.id !== ticket.id);
  
  const handleSaveNote = () => {
    if (newNote.trim()) {
      onAddNote(ticket.id, newNote, selectedStatus);
      setNewNote('');
    }
  };

  const handleResolve = () => {
    onStatusUpdate(ticket.id);
    setShowConfirmResolve(false);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== ticket.subject) {
      onUpdateTicket(ticket.id, { subject: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const getStatusStyles = (status: Ticket['status']) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const timelineEvents = useMemo(() => {
    const events = [
      ...ticket.internalNotes.map(note => ({
        type: 'note' as const,
        id: note.id,
        timestamp: note.timestamp,
        author: note.author,
        content: note.content
      })),
      {
        type: 'system' as const,
        id: 'created',
        timestamp: ticket.createdAt,
        author: 'System',
        content: `Case ${ticket.id} initiated via inbound channel.`
      }
    ];

    if (ticket.status === 'Closed') {
      events.push({
        type: 'system' as const,
        id: 'closed',
        timestamp: new Date().toISOString(),
        author: 'System',
        content: `Ticket status transitioned to CLOSED.`
      });
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [ticket.internalNotes, ticket.createdAt, ticket.status, ticket.id]);

  const isClosing = selectedStatus === 'Closed';
  const isNavigatedInHistory = rootTicketId && ticket.id !== rootTicketId;

  return (
    <>
      <div className="h-full flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            {isNavigatedInHistory && (
              <button 
                onClick={() => onSelectTicket?.(rootTicketId!)}
                className="p-1.5 -ml-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                title="Back to original ticket"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Case View</h2>
            <span className={`px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors ${getStatusStyles(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
          {/* Main Ticket Header Section - Primary Hierarchy */}
          <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full shadow-lg shadow-indigo-200">
                {ticket.id}
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ticket Title</span>
            </div>

            <div className="group relative">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    autoFocus
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    className="w-full bg-white border-2 border-indigo-300 rounded-xl px-3 py-2 text-lg font-black text-slate-900 outline-none shadow-inner"
                  />
                  <button 
                    onClick={handleSaveTitle}
                    className="p-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {ticket.subject}
                  </h3>
                  <button 
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors shrink-0"
                    title="Edit Title"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Secondary: Client Info (Small/Compact) */}
            <div className="flex items-center gap-3 pt-3 border-t border-orange-100/50">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <User size={14} />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-black text-slate-700 truncate">{ticket.client}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{ticket.email}</p>
              </div>
            </div>
          </div>

          {/* Priority & Team Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Tag size={12} />
                Priority
              </label>
              <select 
                value={ticket.priority}
                onChange={(e) => onUpdateTicket(ticket.id, { priority: e.target.value as Priority })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
              >
                <option value="Urgent">URGENT</option>
                <option value="High">HIGH</option>
                <option value="Low">LOW</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Users size={12} />
                Assignee
              </label>
              <AgentSelector 
                agents={agents}
                selectedAgentId={ticket.assignedAgentId}
                onSelect={(id) => onUpdateTicket(ticket.id, { assignedAgentId: id })}
                variant="form"
              />
            </div>
          </div>

          {/* Dedicated Case Timeline Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Case Timeline</h4>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Chronological View</span>
            </div>

            <div className="space-y-6 relative ml-2">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-100" />
              
              {timelineEvents.map((event, idx) => (
                <div key={`${event.id}-${idx}`} className="relative pl-10">
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-lg border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                    event.type === 'system' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {event.type === 'system' ? <Clock size={10} strokeWidth={3} /> : <MessageSquare size={10} strokeWidth={3} />}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {event.author} • {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300">{new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed border text-left ${
                      event.type === 'system' 
                        ? 'bg-slate-50/50 text-slate-500 border-slate-100 italic' 
                        : 'bg-white text-slate-700 border-slate-100 shadow-sm'
                    }`}>
                      {event.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Note Input Area */}
            <div className="mt-8 space-y-4 bg-indigo-50/20 p-5 rounded-3xl border border-indigo-100/50">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Timeline & Status</label>
                {!isClosing ? (
                  <span className="text-[9px] font-bold text-indigo-500 uppercase px-2 py-0.5 bg-indigo-50 rounded-lg whitespace-nowrap">Auto-Refreshes SLA</span>
                ) : (
                  <span className="text-[9px] font-bold text-rose-500 uppercase px-2 py-0.5 bg-rose-50 rounded-lg whitespace-nowrap">SLA Clock Stops</span>
                )}
              </div>

              {/* Status Toggle Inside Note Area */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Transition Ticket to:</p>
                <div className="flex bg-white/50 p-1 rounded-2xl border border-slate-200 shadow-sm">
                  {(['Open', 'Pending', 'Closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                        selectedStatus === status 
                          ? status === 'Closed' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Type your timeline update or internal note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition-all min-h-[100px] shadow-sm"
              />
              <button 
                onClick={handleSaveNote}
                disabled={!newNote.trim()}
                className={`w-full py-3 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isClosing 
                    ? 'bg-rose-600 shadow-rose-100 hover:bg-rose-700' 
                    : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none'
                }`}
              >
                <Send size={14} />
                {isClosing ? 'APPEND & CLOSE CASE' : 'APPEND & UPDATE CASE'}
              </button>
            </div>
          </div>

          {/* Historical Other Tickets from same Client */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-indigo-600" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Client History</h4>
            </div>
            <div className="space-y-3">
              {customerHistory.length > 0 ? (
                customerHistory.map(h => (
                  <div 
                    key={h.id} 
                    onClick={() => onSelectTicket?.(h.id)}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-indigo-300 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-600">{h.id}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={10} className="text-indigo-400" />
                        </div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${h.status === 'Closed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {h.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{h.subject}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                      Opened {new Date(h.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No other ticket history found for this account.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          {ticket.status !== 'Closed' && (
            <button 
              onClick={() => setShowConfirmResolve(true)}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              QUICK RESOLVE
            </button>
          )}
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            <ExternalLink size={20} />
          </button>
        </div>
      </div>

      {showConfirmResolve && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-amber-500">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Resolve Case?</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                This will mark <span className="font-bold text-indigo-600">{ticket.id}</span> as closed and remove it from the active queue.
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-50 flex gap-3">
              <button 
                onClick={() => setShowConfirmResolve(false)}
                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleResolve}
                className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
              >
                CONFIRM & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customer360;
