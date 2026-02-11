
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Agent, Ticket } from '../types';
import { ArrowUpRight, Filter, ChevronDown, Check } from 'lucide-react';

interface AgentWorkloadProps {
  agents: Agent[];
  tickets: Ticket[];
  onViewDetails: (id: string) => void;
}

const AgentWorkload: React.FC<AgentWorkloadProps> = ({ agents, tickets, onViewDetails }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Teams specifically requested: RA, PROCON
  const teams = useMemo(() => {
    const uniqueTeams = Array.from(new Set(agents.map(a => a.team)));
    // Ensure "RA" and "PROCON" are conceptually present even if data is empty (though data is updated now)
    const baseTeams = ['RA', 'PROCON'];
    const otherTeams = uniqueTeams.filter(t => !baseTeams.includes(t));
    return ['All', ...baseTeams, ...otherTeams.sort()];
  }, [agents]);

  const filteredAgents = useMemo(() => {
    if (selectedTeam === 'All') return agents;
    return agents.filter(a => a.team === selectedTeam);
  }, [agents, selectedTeam]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Team Workload</h1>
          <p className="text-slate-500 mt-2 font-black uppercase text-[10px] tracking-[0.2em]">Capacity Management monitor</p>
        </div>

        {/* Team Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Filter by Department</label>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-4 px-6 py-3.5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all min-w-[200px]"
          >
            <div className="flex items-center gap-3">
              <Filter size={14} className="text-indigo-600" />
              <span className="text-xs font-black text-slate-700">{selectedTeam.toUpperCase()}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-slate-50 rounded-[1.5rem] shadow-2xl z-[50] py-2 animate-in zoom-in-95 duration-200">
              {teams.map((team) => (
                <button
                  key={team}
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-3 hover:bg-indigo-50/50 transition-colors group"
                >
                  <span className={`text-xs font-black ${selectedTeam === team ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {team.toUpperCase()}
                  </span>
                  {selectedTeam === team && <Check size={14} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredAgents.map(agent => {
            const count = agent.assignedTickets.length;
            const capacity = Math.min((count / 10) * 100, 100);

            return (
              <div 
                key={agent.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                <div className={`absolute top-5 right-5 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                  agent.status === 'Online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {agent.status}
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-slate-50 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 text-center truncate w-full px-2 leading-none">{agent.name}</h3>
                  <div className="mt-3 flex justify-center">
                    <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.1em] bg-indigo-50 px-4 py-1.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {agent.team}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 mt-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Load Capacity</span>
                      <span className={`text-[10px] font-black ${capacity > 80 ? 'text-rose-500' : 'text-slate-600'}`}>{Math.round(capacity)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${
                          capacity > 80 ? 'bg-rose-500' : capacity > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${capacity}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-slate-50/80 rounded-3xl py-4 border border-slate-100/50">
                    <span className="text-3xl font-black text-slate-900 leading-none">{count}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Active Tickets</span>
                  </div>

                  <button 
                    onClick={() => onViewDetails(agent.id)}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    VIEW QUEUE
                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-slate-300 bg-white rounded-[3rem] border border-slate-100 border-dashed">
          <Filter size={56} className="mb-6 opacity-20" />
          <p className="font-black text-lg tracking-tight text-slate-400">No agents in {selectedTeam}</p>
          <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Try selecting another department</p>
        </div>
      )}
    </div>
  );
};

export default AgentWorkload;
