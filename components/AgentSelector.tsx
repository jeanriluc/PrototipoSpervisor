
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, UserPlus, Check, X, ChevronDown } from 'lucide-react';
import { Agent } from '../types';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelect: (agentId: string | null) => void;
  placeholder?: string;
  className?: string;
  variant?: 'table' | 'form';
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ 
  agents, 
  selectedAgentId, 
  onSelect, 
  placeholder = "Assign Agent...",
  className = "",
  variant = 'table'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedAgent = useMemo(() => 
    agents.find(a => a.id === selectedAgentId), 
  [agents, selectedAgentId]);

  const filteredAgents = useMemo(() => {
    return agents.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.team.toLowerCase().includes(search.toLowerCase())
    );
  }, [agents, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string | null) => {
    onSelect(id);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 transition-all duration-300 w-full ${
          variant === 'table' 
            ? `text-[11px] font-black py-2 px-3 rounded-xl border ${
                !selectedAgentId 
                  ? 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100' 
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-300'
              }`
            : 'w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-black text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedAgent ? (
            <>
              <img src={selectedAgent.avatar} className="w-4 h-4 rounded-md shrink-0" alt="" />
              <span className="truncate">{selectedAgent.name.toUpperCase()}</span>
            </>
          ) : (
            <span className="opacity-60">{placeholder.toUpperCase()}</span>
          )}
        </div>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 min-w-[220px]">
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-50 bg-orange-50/30">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search by name or team..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[240px] overflow-y-auto no-scrollbar">
            <button
              onClick={() => handleSelect(null)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-600">
                <X size={14} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unassigned</p>
              </div>
              {!selectedAgentId && <Check size={14} className="text-indigo-600" />}
            </button>

            {filteredAgents.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleSelect(agent.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50/50 transition-colors group ${
                  selectedAgentId === agent.id ? 'bg-indigo-50/30' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img src={agent.avatar} className="w-8 h-8 rounded-xl object-cover" alt="" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    agent.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-slate-900 truncate">{agent.name.toUpperCase()}</p>
                  <p className="text-[9px] font-bold text-indigo-500/60 uppercase tracking-tighter truncate">{agent.team}</p>
                </div>
                {selectedAgentId === agent.id && <Check size={14} className="text-indigo-600" />}
              </button>
            ))}

            {filteredAgents.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No agents found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSelector;
