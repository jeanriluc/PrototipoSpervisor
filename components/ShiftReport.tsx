
import React from 'react';
import { Ticket } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Trophy, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ShiftReportProps {
  tickets: Ticket[];
}

const ShiftReport: React.FC<ShiftReportProps> = ({ tickets }) => {
  const total = tickets.length;
  const closed = tickets.filter(t => t.status === 'Closed').length;
  const open = tickets.filter(t => t.status !== 'Closed').length;
  const slaCompliance = 88; // Mock value

  const priorityData = [
    { name: 'Urgent', value: tickets.filter(t => t.priority === 'Urgent').length },
    { name: 'High', value: tickets.filter(t => t.priority === 'High').length },
    { name: 'Low', value: tickets.filter(t => t.priority === 'Low').length },
  ];

  const COLORS = ['#F43F5E', '#F97316', '#10B981'];

  const stats = [
    { label: 'SLA COMPLIANCE', value: `${slaCompliance}%`, icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'CASES CLOSED', value: closed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'OPEN BACKLOG', value: open, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'AVG RESPONSE', value: '42m', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Shift Performance</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Comprehensive analysis of today's customer support metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-lg transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full" />
            Tickets by Priority
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full" />
            Volume Distribution
          </h3>
          <div className="h-80 w-full flex items-center justify-center relative">
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900">{total}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Cases</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftReport;
