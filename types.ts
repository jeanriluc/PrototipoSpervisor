
export type Priority = 'Low' | 'High' | 'Urgent';

export interface Ticket {
  id: string;
  client: string;
  email: string;
  subject: string;
  priority: Priority;
  slaDeadline: string;
  assignedAgentId: string | null;
  internalNotes: Note[];
  frustrationLevel: number; // 1-10
  status: 'Open' | 'Pending' | 'Closed';
  createdAt: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'Online' | 'Busy';
  assignedTickets: string[]; // List of ticket IDs
  avatar: string;
  team: string; // New: Support team categorization
}

export interface SLAConfig {
  priority: Priority;
  timeLimit: number; // in minutes
}

export type View = 'inbox' | 'workload' | 'sla' | 'report';
