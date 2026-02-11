
import React from 'react';
import { SLAConfig, Priority } from '../types';
import { Save, RefreshCcw, Info } from 'lucide-react';

interface SLASettingsProps {
  configs: SLAConfig[];
  setConfigs: (configs: SLAConfig[]) => void;
}

const SLASettings: React.FC<SLASettingsProps> = ({ configs, setConfigs }) => {
  const updateLimit = (priority: Priority, value: string) => {
    const minutes = parseInt(value) || 0;
    setConfigs(configs.map(c => c.priority === priority ? { ...c, timeLimit: minutes } : c));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">SLA Policies</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Configure guaranteed response times for your customers</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
        <div className="flex items-start gap-4 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
          <Info className="text-indigo-600 shrink-0 mt-1" size={20} />
          <p className="text-sm text-indigo-900/70 font-medium leading-relaxed">
            Response times are calculated from the moment a ticket is created. 
            Once the limit is reached, the ticket will be flagged as <span className="font-black text-rose-500">EXPIRED</span> in the dashboard and supervisors will be notified.
          </p>
        </div>

        <div className="grid gap-6">
          {configs.map(config => (
            <div key={config.priority} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all group">
              <div className="flex items-center gap-6">
                {/* Fixed: Removed 'Medium' priority check as it is not part of the Priority type defined in types.ts */}
                <div className={`w-3 h-10 rounded-full ${
                  config.priority === 'Urgent' ? 'bg-rose-500' :
                  config.priority === 'High' ? 'bg-orange-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <h3 className="text-lg font-black text-slate-900">{config.priority}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Priority Group</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={config.timeLimit}
                    onChange={(e) => updateLimit(config.priority, e.target.value)}
                    className="w-32 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-right font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">Minutes</span>
                </div>
                <div className="w-24 text-center">
                  <p className="text-xl font-black text-indigo-600">{(config.timeLimit / 60).toFixed(1)}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
            <Save size={18} />
            APPLY NEW POLICIES
          </button>
          <button className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] font-bold text-sm hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <RefreshCcw size={18} />
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default SLASettings;
