
import React, { useState } from 'react';
import { PatientState, Action } from '../types';
import { generateLegalReport, generateEducationalSummary } from '../geminiService';
import { Activity, Pill, Stethoscope, ClipboardCheck, Zap, BookOpen, FileText, ChevronRight, CheckCircle2, Loader2, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  patient: PatientState;
  onAddAction: (label: string, type: 'RX' | 'DX' | 'PROC') => void;
  onAddRemark: (text: string) => void;
}

export const SeniorModule: React.FC<Props> = ({ patient, onAddAction, onAddRemark }) => {
  const [report, setReport] = useState<string | null>(null);
  const [learningSummary, setLearningSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = async (label: string, type: 'RX' | 'DX' | 'PROC') => {
    onAddAction(label, type);
    const summary = await generateEducationalSummary(patient, label);
    setLearningSummary(summary);
  };

  const handleGenerateLegal = async () => {
    setIsGenerating(true);
    const result = await generateLegalReport(patient);
    setReport(result);
    setIsGenerating(false);
  };

  const latestVitals = patient.vitals[patient.vitals.length - 1];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Decision Interface</h2>
          <p className="text-slate-500">Supervising Resident: Dr. Resident • Active Case: {patient.name}</p>
        </div>
        <button 
          onClick={handleGenerateLegal}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          Generate Medico-Legal Log
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Feed - Left */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Incoming Bedside Feed</h3>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   Firebase Live
                </span>
             </div>

             <div className="space-y-4">
                <div className={`p-4 rounded-xl border-l-4 ${latestVitals.spO2 < 94 ? 'bg-red-50 border-red-500' : 'bg-slate-50 border-slate-200'}`}>
                   <div className="flex justify-between items-start">
                     <span className="text-xs font-bold text-slate-500 uppercase">Vitals Logged</span>
                     <span className="text-[10px] text-slate-400">{new Date(latestVitals.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <p className="text-lg font-bold text-slate-800">SpO2: {latestVitals.spO2}% | HR: {latestVitals.heartRate}</p>
                   {latestVitals.spO2 < 94 && (
                     <div className="mt-1 flex items-center gap-1 text-red-600 text-[10px] font-bold">
                       <AlertTriangle className="w-3 h-3" /> HYPOXIA RISK
                     </div>
                   )}
                </div>

                {patient.remarks.slice(-2).map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-blue-500 uppercase">JR Remark</span>
                      <span className="text-[10px] text-slate-400">{new Date(r.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-slate-700 italic">"{r.text}"</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold">Resident Learning Module</h3>
              </div>
              <p className="text-sm opacity-90 leading-relaxed min-h-[100px]">
                {learningSummary || "Waiting for your next clinical action to generate educational feedback for the resident..."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-200">
                <Zap className="w-3 h-3 fill-current" />
                Gemini Insights
              </div>
            </div>
            <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10" />
          </div>
        </div>

        {/* Action Tiles - Middle */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border p-6">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
               One-Click Interventions
             </h3>
             
             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Start Oxygen', type: 'PROC', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'Amlodipine 5mg', type: 'RX', icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50' },
                 { label: 'ECG Order', type: 'DX', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                 { label: 'Fluid Bolus', type: 'PROC', icon: ClipboardCheck, color: 'text-sky-600', bg: 'bg-sky-50' },
                 { label: 'IV Antibiotics', type: 'RX', icon: Pill, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 { label: 'Chest X-Ray', type: 'DX', icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50' },
               ].map((btn) => (
                 <button 
                   key={btn.label}
                   onClick={() => handleAction(btn.label, btn.type as any)}
                   className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-4 text-left"
                 >
                   <div className={`${btn.bg} ${btn.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                     <btn.icon className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-700">{btn.label}</p>
                     <p className="text-[10px] font-semibold text-slate-400 uppercase">{btn.type}</p>
                   </div>
                   <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" />
                 </button>
               ))}
             </div>
           </div>

           <div className="bg-white rounded-2xl shadow-sm border p-6">
             <h3 className="font-bold text-slate-800 mb-4">Chain of Command Log</h3>
             <div className="space-y-3">
               {patient.actions.slice().reverse().map(action => (
                 <div key={action.id} className={`flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0 ${action.status === 'DONE' ? 'opacity-60' : ''}`}>
                    {action.status === 'DONE' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 mt-1 animate-pulse" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`text-sm font-bold ${action.status === 'DONE' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{action.label}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${action.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {action.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="text-[10px] text-slate-500">Authorized by {action.author}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                 </div>
               ))}
               {patient.actions.length === 0 && (
                 <p className="text-xs text-slate-400 text-center py-4 italic">No interventions logged yet.</p>
               )}
             </div>
           </div>
        </div>

        {/* Legal Preview - Right */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-2xl shadow-sm border p-6 h-full sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-slate-800">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold">Legal Document</h3>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 h-[calc(100vh-350px)] overflow-y-auto text-[10px] leading-relaxed font-serif text-slate-600 whitespace-pre-wrap border border-slate-200">
                {report ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    {report}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <FileText className="w-10 h-10 text-slate-200 mb-3" />
                    <p className="text-slate-400 italic">Generated Medico-Legal narration will appear here after clicking "Generate Log".</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <button 
                  disabled={!report}
                  className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Export to Google Workspace
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
