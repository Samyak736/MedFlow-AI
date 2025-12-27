
import React, { useState } from 'react';
import { PatientState, VitalReading, Action } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Send, Heart, Droplets, Thermometer, MessageSquare, ClipboardCheck, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  patient: PatientState;
  onUpdateVitals: (vitals: VitalReading) => void;
  onAddRemark: (text: string) => void;
  onToggleAction: (actionId: string) => void;
}

export const JuniorModule: React.FC<Props> = ({ patient, onUpdateVitals, onAddRemark, onToggleAction }) => {
  const [vitalsInput, setVitalsInput] = useState({ hr: 80, spo2: 98, bp: '120/80' });
  const [remarkInput, setRemarkInput] = useState('');

  const handleUpdate = () => {
    onUpdateVitals({
      timestamp: Date.now(),
      heartRate: Number(vitalsInput.hr),
      spO2: Number(vitalsInput.spo2),
      bloodPressure: vitalsInput.bp,
      source: 'JR'
    });
  };

  const latestVitals = patient.vitals[patient.vitals.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {/* Bedside Panel - Left */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Bedside Panel</h2>
              <p className="text-slate-500 text-sm">Patient: {patient.name} • Room 402</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Live Sync Active
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-2xl border-2 transition-all ${latestVitals.heartRate > 100 ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">HR</span>
              </div>
              <p className={`text-3xl font-bold ${latestVitals.heartRate > 100 ? 'text-red-600' : 'text-slate-800'}`}>{latestVitals.heartRate}</p>
              <p className="text-xs text-slate-400">bpm</p>
            </div>
            <div className={`p-4 rounded-2xl border-2 transition-all ${latestVitals.spO2 < 95 ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">SpO2</span>
              </div>
              <p className={`text-3xl font-bold ${latestVitals.spO2 < 95 ? 'text-amber-600' : 'text-slate-800'}`}>{latestVitals.spO2}%</p>
              <p className="text-xs text-slate-400">Saturation</p>
            </div>
            <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">BP</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{latestVitals.bloodPressure}</p>
              <p className="text-xs text-slate-400">mmHg</p>
            </div>
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patient.vitals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
                <Line type="monotone" dataKey="spO2" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-dashed">
             <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Update Vitals</h3>
             <div className="flex flex-wrap gap-4 items-end">
               <div className="flex-1 min-w-[100px]">
                 <label className="block text-[10px] font-bold text-slate-500 mb-1">Heart Rate</label>
                 <input 
                   type="number" 
                   value={vitalsInput.hr} 
                   onChange={(e) => setVitalsInput({...vitalsInput, hr: Number(e.target.value)})}
                   className="w-full bg-white border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
               <div className="flex-1 min-w-[100px]">
                 <label className="block text-[10px] font-bold text-slate-500 mb-1">SpO2 %</label>
                 <input 
                   type="number" 
                   value={vitalsInput.spo2} 
                   onChange={(e) => setVitalsInput({...vitalsInput, spo2: Number(e.target.value)})}
                   className="w-full bg-white border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
               <div className="flex-1 min-w-[100px]">
                 <label className="block text-[10px] font-bold text-slate-500 mb-1">BP (mmHg)</label>
                 <input 
                   type="text" 
                   value={vitalsInput.bp} 
                   onChange={(e) => setVitalsInput({...vitalsInput, bp: e.target.value})}
                   className="w-full bg-white border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>
               <button 
                 onClick={handleUpdate}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
               >
                 <Plus className="w-4 h-4" />
                 Push to Firebase
               </button>
             </div>
          </div>
        </div>

        {/* Chain of Command - Resident View */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Directives from Senior Dr.
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">PENDING TASKS: {patient.actions.filter(a => a.status === 'PENDING').length}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.actions.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-400 text-sm">
                No orders from Senior Doctor yet.
              </div>
            ) : (
              patient.actions.slice().reverse().map(action => (
                <div 
                  key={action.id} 
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${action.status === 'DONE' ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100 shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleAction(action.id)}
                      className={`p-1.5 rounded-full transition-colors ${action.status === 'DONE' ? 'text-green-600' : 'text-amber-500 hover:bg-amber-100'}`}
                    >
                      {action.status === 'DONE' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div>
                      <p className={`text-sm font-bold ${action.status === 'DONE' ? 'text-green-800 line-through opacity-60' : 'text-slate-800'}`}>{action.label}</p>
                      <p className="text-[10px] text-slate-500">{action.author} • {new Date(action.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${action.status === 'DONE' ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-amber-700 animate-pulse'}`}>
                    {action.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bedside Remarks - Right */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Smart Remarks</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[400px]">
            {patient.remarks.map((r) => (
              <div key={r.id} className={`p-3 rounded-xl max-w-[90%] ${r.author === 'JR' ? 'bg-blue-50 border-blue-100 border ml-0' : 'bg-slate-50 border border-slate-100 ml-auto'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r.author === 'JR' ? 'You (Resident)' : 'Senior Doctor'}</span>
                  <span className="text-[10px] text-slate-300">{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t">
            <div className="flex gap-2 mb-3">
              {['Pale complexion', 'Stable', 'Alert', 'Shortness of breath'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setRemarkInput(tag)}
                  className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea 
                placeholder="Type Bedside context..."
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]"
              />
              <button 
                onClick={() => {
                  if (remarkInput.trim()) {
                    onAddRemark(remarkInput);
                    setRemarkInput('');
                  }
                }}
                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
