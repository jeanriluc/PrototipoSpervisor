
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Inbox, 
  Users, 
  Settings, 
  BarChart3, 
  Plus, 
  Search, 
  Bell, 
  LayoutDashboard,
  Filter,
  CheckCircle2,
  ListFilter,
  User,
  X
} from 'lucide-react';
import { Ticket, Agent, SLAConfig, View, Priority, Note } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TicketTable from './components/TicketTable';
import Customer360 from './components/Customer360';
import AgentWorkload from './components/AgentWorkload';
import SLASettings from './components/SLASettings';
import ShiftReport from './components/ShiftReport';
import NewTicketModal from './components/NewTicketModal';
import AgentSlideOver from './components/AgentSlideOver';

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const INITIAL_SLA: SLAConfig[] = [
  { priority: 'Urgent', timeLimit: 1440 },
  { priority: 'High', timeLimit: 2880 },
  { priority: 'Low', timeLimit: 4320 },
];

const getRelativeDate = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

const INITIAL_TICKETS: Ticket[] = [
  // CLIENT 1: Alice Freeman (3 Tickets)
  { 
    id: 'TK-1001', client: 'Alice Freeman', email: 'alice@freeman.com', subject: 'CRITICAL: Database Connection Timeout', 
    priority: 'Urgent', slaDeadline: getRelativeDate(-2), assignedAgentId: 'a1', status: 'Open', frustrationLevel: 10, 
    internalNotes: [{ id: 'n1', author: 'System', content: 'SLA Breach detected.', timestamp: getRelativeDate(-2.5) }],
    createdAt: getRelativeDate(-26)
  },
  { 
    id: 'TK-1021', client: 'Alice Freeman', email: 'alice@freeman.com', subject: 'Previous: Login attempts failing on mobile', 
    priority: 'Low', slaDeadline: getRelativeDate(-50), assignedAgentId: null, status: 'Closed', frustrationLevel: 4, 
    internalNotes: [], createdAt: getRelativeDate(-72)
  },
  { 
    id: 'TK-1022', client: 'Alice Freeman', email: 'alice@freeman.com', subject: 'Account Upgrade Request', 
    priority: 'High', slaDeadline: getRelativeDate(-10), assignedAgentId: 'a11', status: 'Closed', frustrationLevel: 2, 
    internalNotes: [], createdAt: getRelativeDate(-15)
  },

  // CLIENT 2: Robert Downy (3 Tickets)
  { id: 'TK-1002', client: 'Robert Downy', email: 'rdj@stark.com', subject: 'API Integration Auth Error', priority: 'High', slaDeadline: getRelativeDate(46), assignedAgentId: 'a1', status: 'Open', frustrationLevel: 7, internalNotes: [], createdAt: getRelativeDate(-2) },
  { id: 'TK-1023', client: 'Robert Downy', email: 'rdj@stark.com', subject: 'Sandbox environment access', priority: 'Low', slaDeadline: getRelativeDate(-20), assignedAgentId: null, status: 'Closed', frustrationLevel: 3, internalNotes: [], createdAt: getRelativeDate(-30) },
  { id: 'TK-1030', client: 'Robert Downy', email: 'rdj@stark.com', subject: 'Legacy: Dashboard loading slow', priority: 'Low', slaDeadline: getRelativeDate(-500), assignedAgentId: 'a1', status: 'Closed', frustrationLevel: 5, internalNotes: [], createdAt: getRelativeDate(-600) },

  // CLIENT 3: Bruce Wayne (3 Tickets)
  { id: 'TK-1004', client: 'Bruce Wayne', email: 'bruce@wayne.com', subject: 'Batmobile part replacement', priority: 'Low', slaDeadline: getRelativeDate(70), assignedAgentId: 'a11', status: 'Open', frustrationLevel: 2, internalNotes: [], createdAt: getRelativeDate(-2) },
  { id: 'TK-1024', client: 'Bruce Wayne', email: 'bruce@wayne.com', subject: 'Armor plate recalibration', priority: 'High', slaDeadline: getRelativeDate(-5), assignedAgentId: null, status: 'Closed', frustrationLevel: 1, internalNotes: [], createdAt: getRelativeDate(-10) },
  { id: 'TK-1025', client: 'Bruce Wayne', email: 'bruce@wayne.com', subject: 'Batarang bulk order issue', priority: 'Low', slaDeadline: getRelativeDate(-100), assignedAgentId: null, status: 'Closed', frustrationLevel: 5, internalNotes: [], createdAt: getRelativeDate(-120) },

  { id: 'TK-1003', client: 'Sarah Connor', email: 'sarah@res.net', subject: 'Skynet login loop issues', priority: 'Urgent', slaDeadline: getRelativeDate(22), assignedAgentId: 'a2', status: 'Open', frustrationLevel: 8, internalNotes: [], createdAt: getRelativeDate(-1) },
  { id: 'TK-1005', client: 'Peter Parker', email: 'spidey@nyc.gov', subject: 'Web-fluid subscription renewal', priority: 'Low', slaDeadline: getRelativeDate(71), assignedAgentId: 'a11', status: 'Open', frustrationLevel: 4, internalNotes: [], createdAt: getRelativeDate(-1) },
  { id: 'TK-1006', client: 'Diana Prince', email: 'diana@themyscira.io', subject: 'Lasso of truth calibration', priority: 'High', slaDeadline: getRelativeDate(45), assignedAgentId: 'a12', status: 'Open', frustrationLevel: 3, internalNotes: [], createdAt: getRelativeDate(-3) },
  { id: 'TK-1007', client: 'Tony Stark', email: 'tony@stark.com', subject: 'Arc reactor humming noise', priority: 'Urgent', slaDeadline: getRelativeDate(20), assignedAgentId: 'a4', status: 'Pending', frustrationLevel: 5, internalNotes: [], createdAt: getRelativeDate(-4) },
  { id: 'TK-1008', client: 'Steve Rogers', email: 'cap@avengers.org', subject: 'Shield paint retouching', priority: 'Low', slaDeadline: getRelativeDate(68), assignedAgentId: 'a4', status: 'Open', frustrationLevel: 1, internalNotes: [], createdAt: getRelativeDate(-4) },
  { id: 'TK-1009', client: 'Natasha Romanoff', email: 'blackwidow@shield.gov', subject: 'Secure comms encrypted', priority: 'High', slaDeadline: getRelativeDate(40), assignedAgentId: 'a5', status: 'Open', frustrationLevel: 6, internalNotes: [], createdAt: getRelativeDate(-8) },
  { id: 'TK-1010', client: 'Wanda Maximoff', email: 'wanda@westview.com', subject: 'Reality distortion support', priority: 'Urgent', slaDeadline: getRelativeDate(18), assignedAgentId: 'a5', status: 'Open', frustrationLevel: 9, internalNotes: [], createdAt: getRelativeDate(-6) },
  { id: 'TK-1011', client: 'Thor Odinson', email: 'thor@asgard.com', subject: 'Mjolnir handle grip loose', priority: 'High', slaDeadline: getRelativeDate(42), assignedAgentId: 'a6', status: 'Open', frustrationLevel: 5, internalNotes: [], createdAt: getRelativeDate(-6) },
  { id: 'TK-1012', client: 'Clark Kent', email: 'clark@dailyplanet.com', subject: 'Glasses prescription update', priority: 'Low', slaDeadline: getRelativeDate(65), assignedAgentId: 'a7', status: 'Open', frustrationLevel: 2, internalNotes: [], createdAt: getRelativeDate(-7) },
  { id: 'TK-1013', client: 'Barry Allen', email: 'flash@centralcity.pd', subject: 'Treadmill friction high', priority: 'Urgent', slaDeadline: getRelativeDate(15), assignedAgentId: 'a7', status: 'Pending', frustrationLevel: 7, internalNotes: [], createdAt: getRelativeDate(-9) },
  { id: 'TK-1014', client: 'Arthur Curry', email: 'aquaman@atlantis.me', subject: 'Waterproof phone casing', priority: 'Low', slaDeadline: getRelativeDate(60), assignedAgentId: 'a8', status: 'Open', frustrationLevel: 3, internalNotes: [], createdAt: getRelativeDate(-12) },
  { id: 'TK-1015', client: 'Hal Jordan', email: 'green@lantern.corp', subject: 'Ring recharge port broken', priority: 'High', slaDeadline: getRelativeDate(35), assignedAgentId: 'a8', status: 'Open', frustrationLevel: 6, internalNotes: [], createdAt: getRelativeDate(-13) },
  { id: 'TK-1016', client: 'Victor Stone', email: 'cyborg@star.labs', subject: 'Firmware 4.2.1 sync error', priority: 'Urgent', slaDeadline: getRelativeDate(10), assignedAgentId: 'a9', status: 'Open', frustrationLevel: 8, internalNotes: [], createdAt: getRelativeDate(-14) },
  { id: 'TK-1017', client: 'Logan Howlett', email: 'wolverine@xmen.com', subject: 'Metal detection at airports', priority: 'Low', slaDeadline: getRelativeDate(55), assignedAgentId: 'a9', status: 'Open', frustrationLevel: 9, internalNotes: [], createdAt: getRelativeDate(-17) },
  { id: 'TK-1018', client: 'Scott Summers', email: 'cyclops@xmen.com', subject: 'Visor glass scratch', priority: 'High', slaDeadline: getRelativeDate(30), assignedAgentId: 'a10', status: 'Open', frustrationLevel: 4, internalNotes: [], createdAt: getRelativeDate(-18) },
  { id: 'TK-1019', client: 'Jean Grey', email: 'phoenix@xmen.com', subject: 'Mind reading blocking kit', priority: 'Urgent', slaDeadline: getRelativeDate(5), assignedAgentId: 'a10', status: 'Open', frustrationLevel: 10, internalNotes: [], createdAt: getRelativeDate(-19) },
  { id: 'TK-1020', client: 'Charles Xavier', email: 'prof@xavier.edu', subject: 'Cerebro maintenance request', priority: 'Low', slaDeadline: getRelativeDate(50), assignedAgentId: 'a10', status: 'Open', frustrationLevel: 1, internalNotes: [], createdAt: getRelativeDate(-22) },
];

const INITIAL_AGENTS: Agent[] = [
  { id: 'a1', name: 'Sofia Martinez', status: 'Online', assignedTickets: ['TK-1001', 'TK-1002', 'TK-1030'], avatar: 'https://picsum.photos/seed/sofia/100', team: 'RA' },
  { id: 'a2', name: 'James Wilson', status: 'Online', assignedTickets: ['TK-1003'], avatar: 'https://picsum.photos/seed/james/100', team: 'PROCON' },
  { id: 'a11', name: 'Lucas Silva', status: 'Online', assignedTickets: ['TK-1004', 'TK-1005', 'TK-1022'], avatar: 'https://picsum.photos/seed/lucas/100', team: 'RA' },
  { id: 'a12', name: 'Ana Oliveira', status: 'Busy', assignedTickets: ['TK-1006'], avatar: 'https://picsum.photos/seed/ana/100', team: 'PROCON' },
  { id: 'a3', name: 'Elena Rossi', status: 'Busy', assignedTickets: [], avatar: 'https://picsum.photos/seed/elena/100', team: 'L2' },
  { id: 'a4', name: 'Marcus Chen', status: 'Online', assignedTickets: ['TK-1007', 'TK-1008'], avatar: 'https://picsum.photos/seed/marcus/100', team: 'Chat' },
  { id: 'a5', name: 'Isabella Garcia', status: 'Online', assignedTickets: ['TK-1009', 'TK-1010'], avatar: 'https://picsum.photos/seed/isabella/100', team: 'Email' },
  { id: 'a6', name: 'Liam O\'Connor', status: 'Busy', assignedTickets: ['TK-1011'], avatar: 'https://picsum.photos/seed/liam/100', team: 'Transportistas' },
  { id: 'a7', name: 'Yuki Tanaka', status: 'Online', assignedTickets: ['TK-1012', 'TK-1013'], avatar: 'https://picsum.photos/seed/yuki/100', team: 'Social Media' },
  { id: 'a8', name: 'David Smith', status: 'Online', assignedTickets: ['TK-1014', 'TK-1015'], avatar: 'https://picsum.photos/seed/david/100', team: 'Chat' },
  { id: 'a9', name: 'Amara Okafor', status: 'Online', assignedTickets: ['TK-1016', 'TK-1017'], avatar: 'https://picsum.photos/seed/amara/100', team: 'Marketplace' },
  { id: 'a10', name: 'Chloe Dubois', status: 'Busy', assignedTickets: ['TK-1018', 'TK-1019', 'TK-1020'], avatar: 'https://picsum.photos/seed/chloe/100', team: 'Email' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'SLA Breach: TK-1001',
    message: 'Alice Freeman\'s ticket has exceeded the Urgent SLA limit.',
    timestamp: getRelativeDate(-0.5),
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'New Case Assigned',
    message: 'You have been assigned to TK-1007 (Tony Stark).',
    timestamp: getRelativeDate(-1),
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Case Resolved',
    message: 'TK-1024 has been successfully closed.',
    timestamp: getRelativeDate(-2),
    isRead: true,
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<View>('inbox');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>(INITIAL_SLA);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [rootTicketId, setRootTicketId] = useState<string | null>(null);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [agentSearchName, setAgentSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'All'>('All');

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUnassigned = filterUnassigned ? t.assignedAgentId === null : true;
      const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
      
      let matchesAgent = true;
      if (agentSearchName.trim() !== '') {
        const agent = agents.find(a => a.id === t.assignedAgentId);
        matchesAgent = agent ? agent.name.toLowerCase().includes(agentSearchName.toLowerCase()) : false;
      }

      return matchesSearch && matchesUnassigned && matchesStatus && matchesAgent;
    });
  }, [tickets, searchQuery, filterUnassigned, statusFilter, agentSearchName, agents]);

  const selectedTicket = useMemo(() => 
    tickets.find(t => t.id === selectedTicketId) || null
  , [tickets, selectedTicketId]);

  const viewingAgent = useMemo(() => 
    agents.find(a => a.id === viewingAgentId) || null
  , [agents, viewingAgentId]);

  const handleSelectTicketFromTable = (id: string | null) => {
    setSelectedTicketId(id);
    setRootTicketId(id);
  };

  const handleNavigateToTicket = (id: string) => {
    setSelectedTicketId(id);
    setRootTicketId(id);
  };

  const handleAssignTicket = (ticketId: string, agentId: string | null) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedAgentId: agentId } : t));
    setAgents(prev => prev.map(a => {
      const wasAssigned = a.assignedTickets.includes(ticketId);
      const isNewOwner = a.id === agentId;
      let newTickets = [...a.assignedTickets];
      if (wasAssigned && !isNewOwner) {
        newTickets = newTickets.filter(id => id !== ticketId);
      } else if (!wasAssigned && isNewOwner) {
        newTickets.push(ticketId);
      }
      return { ...a, assignedTickets: newTickets };
    }));

    // Generate notification for assignment
    if (agentId) {
      const agentName = agents.find(a => a.id === agentId)?.name;
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: 'info',
        title: 'Ticket Reassigned',
        message: `${ticketId} has been moved to ${agentName}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updates } : t));
    if (updates.assignedAgentId !== undefined) {
      handleAssignTicket(ticketId, updates.assignedAgentId);
    }
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    if (newTicket.assignedAgentId) {
      handleAssignTicket(newTicket.id, newTicket.assignedAgentId);
    }
    setIsNewTicketModalOpen(false);
    
    // Notify about new ticket
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'New Ticket Created',
      message: `${newTicket.id} for ${newTicket.client} is now active.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleCloseTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Closed' } : t));
    handleAssignTicket(id, null);

    // Notify about resolution
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Case Resolved',
      message: `Ticket ${id} has been marked as closed.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddNote = (ticketId: string, noteContent: string, newStatus?: Ticket['status']) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Alex Supervisor',
      content: noteContent,
      timestamp: new Date().toISOString()
    };

    const finalStatus = newStatus || ticket.status;
    let newDeadline = ticket.slaDeadline;

    if (finalStatus !== 'Closed') {
      const config = slaConfigs.find(c => c.priority === ticket.priority);
      const timeLimitMinutes = config?.timeLimit || 60;
      const deadlineDate = new Date();
      deadlineDate.setMinutes(deadlineDate.getMinutes() + timeLimitMinutes);
      newDeadline = deadlineDate.toISOString();
    }

    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            internalNotes: [...t.internalNotes, newNote], 
            slaDeadline: newDeadline,
            status: finalStatus
          } 
        : t
    ));

    if (finalStatus === 'Closed' && ticket.assignedAgentId) {
      handleCloseTicket(ticketId);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="flex h-screen w-screen bg-[#FDFCF9] overflow-hidden text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl shadow-slate-200/50 rounded-l-[3rem] my-2 overflow-hidden border border-slate-100">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onNewTicket={() => setIsNewTicketModalOpen(true)}
          notifications={notifications}
          onMarkRead={markNotificationRead}
          onClear={clearNotifications}
        />

        <div className="flex-1 overflow-hidden p-8 bg-orange-50/20 min-h-0 relative flex gap-6">
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {activeTab === 'inbox' && (
              <div className="flex flex-col gap-4 flex-1 min-h-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 shrink-0">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Intelligent Inbox</h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active Support Stream</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative group/agent">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/agent:text-indigo-500 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Filter by agent..."
                        value={agentSearchName}
                        onChange={(e) => setAgentSearchName(e.target.value)}
                        className="bg-white border border-slate-100 rounded-2xl py-2 pl-9 pr-8 text-xs font-black text-slate-600 focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm transition-all w-44 placeholder:text-slate-300 placeholder:font-bold"
                      />
                      {agentSearchName && (
                        <button 
                          onClick={() => setAgentSearchName('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-500"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm mr-2">
                      {(['All', 'Open', 'Pending', 'Closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                            statusFilter === status 
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setFilterUnassigned(!filterUnassigned)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black transition-all border ${
                        filterUnassigned 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <Filter size={14} />
                      UNASSIGNED
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0 overflow-auto no-scrollbar">
                  <TicketTable 
                    tickets={filteredTickets} 
                    agents={agents}
                    selectedTicketId={selectedTicketId}
                    setSelectedTicketId={handleSelectTicketFromTable}
                    onAssign={handleAssignTicket}
                  />
                </div>
              </div>
            )}

            {activeTab === 'workload' && (
              <div className="h-full overflow-auto no-scrollbar">
                <AgentWorkload 
                  agents={agents} 
                  onViewDetails={setViewingAgentId} 
                  tickets={tickets}
                />
              </div>
            )}

            {activeTab === 'sla' && (
               <div className="h-full overflow-auto no-scrollbar">
                <SLASettings 
                  configs={slaConfigs} 
                  setConfigs={setSlaConfigs} 
                />
              </div>
            )}

            {activeTab === 'report' && (
              <div className="h-full overflow-auto no-scrollbar">
                <ShiftReport tickets={tickets} />
              </div>
            )}
          </div>

          {/* Sidebar Case View for Inbox */}
          {activeTab === 'inbox' && selectedTicket && (
            <div className="h-full w-[450px] shrink-0 animate-in slide-in-from-right duration-300 z-40">
              <Customer360 
                ticket={selectedTicket} 
                allTickets={tickets} 
                agents={agents}
                onClose={() => setSelectedTicketId(null)}
                onStatusUpdate={handleCloseTicket}
                onUpdateTicket={handleUpdateTicket}
                onAddNote={handleAddNote}
                onSelectTicket={setSelectedTicketId}
                rootTicketId={rootTicketId}
              />
            </div>
          )}
        </div>
      </main>

      {/* GLOBAL CASE MODAL (Floating Modal with Fix for Clipping) */}
      {activeTab !== 'inbox' && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-10 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
           <div 
             className="absolute inset-0" 
             onClick={() => setSelectedTicketId(null)} 
           />
           <div className="relative w-full max-w-xl h-full animate-in slide-in-from-right duration-500 shadow-2xl rounded-[3rem] overflow-hidden bg-white border border-slate-100">
             <Customer360 
                ticket={selectedTicket} 
                allTickets={tickets} 
                agents={agents}
                onClose={() => setSelectedTicketId(null)}
                onStatusUpdate={handleCloseTicket}
                onUpdateTicket={handleUpdateTicket}
                onAddNote={handleAddNote}
                onSelectTicket={setSelectedTicketId}
                rootTicketId={rootTicketId}
              />
           </div>
        </div>
      )}

      {/* Modals & Overlays */}
      {isNewTicketModalOpen && (
        <NewTicketModal 
          isOpen={isNewTicketModalOpen} 
          onClose={() => setIsNewTicketModalOpen(false)} 
          onCreate={handleCreateTicket}
          agents={agents}
        />
      )}

      {viewingAgentId && viewingAgent && (
        <AgentSlideOver 
          agent={viewingAgent} 
          tickets={tickets}
          agents={agents}
          onClose={() => setViewingAgentId(null)}
          onReassign={handleAssignTicket}
          onViewTicket={handleNavigateToTicket}
        />
      )}
    </div>
  );
};

export default App;
