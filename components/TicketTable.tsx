
import React, { useState, useMemo } from 'react';
import { Ticket, Agent, Priority } from '../types';
import { 
  Clock, 
  MoreVertical, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  BookOpen, 
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import AgentSelector from './AgentSelector';

interface TicketTableProps {
  tickets: Ticket[];
  agents: Agent[];
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  onAssign: (ticketId: string, agentId: string | null) => void;
}

type SortField = 'client' | 'priority' | 'slaDeadline' | null;
type SortOrder = 'asc' | 'desc';

const TicketTable: React.FC<TicketTableProps> = ({ tickets, agents, selectedTicketId, setSelectedTicketId, onAssign }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const priorityWeight = {
    'Urgent': 3,
    'High': 2,
    'Low': 1
  };

  const sortedTickets = useMemo(() => {
    if (!sortField) return tickets;

    return [...tickets].sort((a, b) => {
      let valA: any = a[sortField as keyof Ticket];
      let valB: any = b[sortField as keyof Ticket];

      if (sortField === 'priority') {
        valA = priorityWeight[a.priority];
        valB = priorityWeight[b.priority];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tickets, sortField, sortOrder]);

  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const remaining = new Date(deadline).getTime() - new Date().getTime();
    if (remaining < 0) return { label: 'Expired', color: 'text-rose-500', isExpired: true };
    
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return { label: `${hours}h ${minutes % 60}m`, color: hours < 2 ? 'text-orange-500' : 'text-slate-400', isExpired: false };
    return { label: `${minutes}m`, color: 'text-rose-500 font-bold', isExpired: false };
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex-1">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white border-b border-slate-50">
              <th className="w-10 px-4 py-5"></th>
              <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">ID</th>
              <th 
                className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 group whitespace-nowrap"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center gap-1.5">
                  Client Info
                  <SortIcon field="client" />
                </div>
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Ticket Subject</th>
              <th 
                className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 group whitespace-nowrap"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-1.5">
                  Priority
                  <SortIcon field="priority" />
                </div>
              </th>
              <th 
                className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-900 group whitespace-nowrap"
                onClick={() => handleSort('slaDeadline')}
              >
                <div className="flex items-center gap-1.5">
                  SLA
                  <SortIcon field="slaDeadline" />
                </div>
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Assignee</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedTickets.map((ticket) => {
              const time = getTimeRemaining(ticket.slaDeadline);
              const isSelected = selectedTicketId === ticket.id;
              const isExpanded = expandedRows.has(ticket.id);
              const isClosed = ticket.status === 'Closed';

              return (
                <React.Fragment key={ticket.id}>
                  <tr 
                    className={`group cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'} ${!isClosed && time.isExpired ? 'bg-rose-50/10' : ''}`}
                    onClick={() => setSelectedTicketId(ticket.id)}
                  >
                    <td className="px-4 py-5 text-center">
                      <button 
                        onClick={(e) => toggleRow(ticket.id, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100/50 inline-block align-middle">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col min-w-[120px]">
                        <span className="text-sm font-black text-slate-900 leading-tight">{ticket.client}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Mail size={12} className="text-indigo-400 shrink-0" />
                          <span className="text-[11px] font-bold text-indigo-500/80 truncate max-w-[150px]">{ticket.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-[200px]">
                        <span className="text-sm font-semibold text-slate-700 block truncate group-hover:text-slate-900 transition-colors">
                          {ticket.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tight whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {isClosed ? (
                        <div className="flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl border border-emerald-100 bg-emerald-50/50 transition-all">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-black text-emerald-600">SLA MET</span>
                        </div>
                      ) : (
                        <div 
                          className={`group/sla relative flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl border transition-all ${time.isExpired ? 'bg-rose-100/50 border-rose-200 animate-pulse' : 'border-transparent'}`}
                        >
                          {time.isExpired ? (
                            <>
                              <AlertTriangle size={14} className="text-rose-500" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest leading-relaxed rounded-2xl opacity-0 group-hover/sla:opacity-100 pointer-events-none transition-opacity shadow-xl z-10">
                                <div className="flex items-center gap-2 mb-1 text-rose-400">
                                  <AlertCircle size={12} />
                                  Deadline Passed
                                </div>
                                Immediate action needed to resolve compliance breach.
                              </div>
                            </>
                          ) : (
                            <Clock size={14} className={time.color} />
                          )}
                          <span className={`text-xs font-black ${time.color}`}>{time.label}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <AgentSelector 
                        agents={agents}
                        selectedAgentId={ticket.assignedAgentId}
                        onSelect={(id) => onAssign(ticket.id, id)}
                        placeholder="Unassigned"
                      />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50/30 border-t border-slate-50 shadow-inner">
                      <td colSpan={8} className="px-10 py-6">
                        <div className="flex gap-12 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <BookOpen size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Case Summary</span>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                              {ticket.subject}. Customer has been waiting for {Math.floor((new Date().getTime() - new Date(ticket.createdAt).getTime()) / 60000)} minutes since initial contact. 
                              {!isClosed && time.isExpired && <span className="text-rose-600 font-black block mt-2">Critical: SLA Deadline reached. Immediate action required.</span>}
                              {isClosed && <span className="text-emerald-600 font-black block mt-2">Resolved: This case is completed.</span>}
                            </p>
                          </div>
                          <div className="w-80 space-y-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Internal Thread</span>
                            </div>
                            <div className="space-y-3">
                              {ticket.internalNotes.length > 0 ? (
                                ticket.internalNotes.map(note => (
                                  <div key={note.id} className="text-xs bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-black text-indigo-600">{note.author}</span>
                                      <span className="text-slate-300">{new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-slate-500 font-medium">{note.content}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[11px] text-slate-400 italic bg-white p-4 rounded-3xl border border-slate-100 border-dashed text-center">
                                  No internal notes yet.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {tickets.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300">
          <AlertCircle size={56} className="mb-6 opacity-20" />
          <p className="font-black text-lg tracking-tight">Zero matches found</p>
          <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Adjust your search parameters</p>
        </div>
      )}
    </div>
  );
};

export default TicketTable;
