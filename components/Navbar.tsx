
import React from 'react';
import { Role } from '../types';
import { Activity, ShieldCheck, UserCircle, LayoutDashboard, Stethoscope } from 'lucide-react';

interface Props {
  role: Role;
  setRole: (role: Role) => void;
  alert: string | null;
}

export const Navbar: React.FC<Props> = ({ role, setRole, alert }) => {
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">MedFlow <span className="text-blue-600">AI</span></h1>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Cloud Verified
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-slate-100 rounded-full p-1 flex gap-1">
          <button 
            onClick={() => setRole('JUNIOR')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${role === 'JUNIOR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Resident
            </div>
          </button>
          <button 
            onClick={() => setRole('SENIOR')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${role === 'SENIOR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Senior Dr.
            </div>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">{role === 'JUNIOR' ? 'Dr. Resident' : 'Dr. Senior'}</p>
            <p className="text-xs text-slate-500">St. Mary General</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600">
            <UserCircle className="w-7 h-7" />
          </div>
        </div>
      </div>
    </nav>
  );
};
