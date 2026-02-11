
import React, { useState } from 'react';
import { X, Send, User, Mail, Tag, FileText, StickyNote } from 'lucide-react';
import { Agent, Priority, Ticket } from '../types';
import AgentSelector from './AgentSelector';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ticket: Ticket) => void;
  agents: Agent[];
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onCreate, agents }) => {
  const [formData, setFormData] = useState({
    id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
    client: '',
    email: '',
    subject: '',
    priority: 'Low' as Priority,
    agentId: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slaHours = formData.priority === 'Urgent' ? 0.5 : 
                    formData.priority === 'High' ? 2 : 24;
    
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + slaHours);

    const newTicket: Ticket = {
      id: formData.id,
      client: formData.client,
      email: formData.email,
      subject: formData.subject,
      priority: formData.priority,
      slaDeadline: deadline.toISOString(),
      assignedAgentId: formData.agentId || null,
      internalNotes: formData.note ? [{
        id: Math.random().toString(36).substr(2, 9),
        author: 'Alex Supervisor',
        content: formData.note,
        timestamp: new Date().toISOString()
      }] : [],
      frustrationLevel: 3,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    onCreate(newTicket);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-orange-50/20">
          <div>
            <h2 className="text-2xl font-black text-slate-900">New Support Case</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Supervisor Portal • ID Generation</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl shadow-sm transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-10 space-y-8 no-scrollbar">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manual Ticket ID (Required)</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  value={formData.id}
                  onChange={e => setFormData({...formData, id: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 font-mono text-sm font-bold text-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold appearance-none focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  placeholder="e.g. John Doe"
                  value={formData.client}
                  onChange={e => setFormData({...formData, client: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <input 
              required
              placeholder="What is this case about?"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2 overflow-visible">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Expert</label>
              <AgentSelector 
                agents={agents}
                selectedAgentId={formData.agentId || null}
                onSelect={(id) => setFormData({...formData, agentId: id || ''})}
                variant="form"
                placeholder="Leave Unassigned"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Instructions</label>
              <div className="relative">
                <StickyNote className="absolute left-4 top-4 text-slate-300" size={18} />
                <textarea 
                  placeholder="Supervisor notes for the agent..."
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 pb-2">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Send size={18} />
              CREATE & DISPATCH CASE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;
