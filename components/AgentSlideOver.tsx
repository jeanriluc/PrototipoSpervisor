
import React from 'react';
import { Agent, Ticket } from '../types';
import { X, UserCheck, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import AgentSelector from './AgentSelector';

interface AgentSlideOverProps {
  agent: Agent;
  tickets: Ticket[];
  agents: Agent[];
  onClose: () => void;
  onReassign: (ticketId: string, agentId: string | null) => void;
  onViewTicket: (ticketId: string) => void;
}

const AgentSlideOver: React.FC<AgentSlideOverProps> = ({ agent, tickets, agents, onClose, onReassign, onViewTicket }) => {
  const agentTickets = tickets.filter(t => agent.assignedTickets.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-50 bg-indigo-50/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <img src={agent.avatar} alt="" className="w-12 h-12 rounded-2xl shadow-sm" />
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">{agent.name}</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Active Queue: {agentTickets.length} Cases</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-6 no-scrollbar bg-orange-50/10">
          {agentTickets.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
              <UserCheck size={48} className="mb-4 opacity-10" />
              <p className="font-medium">Queue is empty. Agent is ready for tasks.</p>
            </div>
          ) : (
            agentTickets.map(ticket => (
              <div key={ticket.id} className="p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-visible relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-100 text-[10px] font-black font-mono text-indigo-600">
                    {ticket.id}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <Clock size={12} className="text-slate-300" />
                    SLA: {new Date(ticket.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <h3 className="font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                <p className="text-xs text-slate-500 mb-6 font-medium">{ticket.client}</p>

                <div className="flex items-center gap-4">
                  <div className="flex-1 overflow-visible">
                    <AgentSelector 
                      agents={agents}
                      selectedAgentId={ticket.assignedAgentId}
                      onSelect={(id) => onReassign(ticket.id, id)}
                      variant="form"
                      placeholder="Move ticket to..."
                    />
                  </div>
                  <button 
                    onClick={() => onViewTicket(ticket.id)}
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center group/btn"
                    title="View Ticket in Inbox"
                  >
                    <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
          >
            CLOSE MANAGER
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSlideOver;
