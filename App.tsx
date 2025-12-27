
import React, { useState, useEffect, useCallback } from 'react';
import { Role, PatientState, VitalReading, Remark, Action } from './types';
import { JuniorModule } from './components/JuniorModule';
import { SeniorModule } from './components/SeniorModule';
import { Navbar } from './components/Navbar';
import { AlertCircle, UserCheck, Settings } from 'lucide-react';

const INITIAL_PATIENT: PatientState = {
  id: 'P-10293',
  name: 'John Doe',
  age: 54,
  vitals: [
    { timestamp: Date.now() - 3600000, heartRate: 72, spO2: 98, bloodPressure: '120/80', source: 'Sensor' }
  ],
  remarks: [
    { id: '1', timestamp: Date.now() - 3500000, text: 'Stable upon admission', author: 'JR' }
  ],
  actions: []
};

function App() {
  const [role, setRole] = useState<Role>('JUNIOR');
  const [patient, setPatient] = useState<PatientState>(INITIAL_PATIENT);
  const [criticalAlert, setCriticalAlert] = useState<string | null>(null);

  // Simulate real-time sync "Firebase" feel
  const updateVitals = useCallback((newVitals: VitalReading) => {
    setPatient(prev => ({
      ...prev,
      vitals: [...prev.vitals, newVitals]
    }));
    
    if (newVitals.spO2 < 94 || newVitals.heartRate > 110) {
      setCriticalAlert(`Critical Vitals Alert for ${patient.name}`);
    }
  }, [patient.name]);

  const addRemark = useCallback((text: string, author: 'JR' | 'SR') => {
    const newRemark: Remark = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      text,
      author
    };
    setPatient(prev => ({
      ...prev,
      remarks: [...prev.remarks, newRemark]
    }));
  }, []);

  const addAction = useCallback((label: string, type: 'RX' | 'DX' | 'PROC') => {
    const newAction: Action = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      label,
      author: 'Dr. Sarah (Senior)',
      status: 'PENDING'
    };
    setPatient(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
    // Clear alert if intervention happens
    setCriticalAlert(null);
  }, []);

  const toggleActionStatus = useCallback((actionId: string) => {
    setPatient(prev => ({
      ...prev,
      actions: prev.actions.map(action => 
        action.id === actionId 
          ? { ...action, status: action.status === 'PENDING' ? 'DONE' : 'PENDING' }
          : action
      )
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar 
        role={role} 
        setRole={setRole} 
        alert={criticalAlert} 
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {role === 'JUNIOR' ? (
          <JuniorModule 
            patient={patient} 
            onUpdateVitals={updateVitals} 
            onAddRemark={(txt) => addRemark(txt, 'JR')} 
            onToggleAction={toggleActionStatus}
          />
        ) : (
          <SeniorModule 
            patient={patient} 
            onAddAction={addAction}
            onAddRemark={(txt) => addRemark(txt, 'SR')}
          />
        )}
      </main>

      {/* Real-time notification footer */}
      {criticalAlert && role === 'SENIOR' && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-2xl animate-bounce flex items-center gap-3 border-2 border-red-400 z-50">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">URGENT INTERVENTION NEEDED</p>
            <p className="text-sm opacity-90">{criticalAlert}</p>
          </div>
          <button 
            onClick={() => setCriticalAlert(null)}
            className="ml-4 hover:bg-red-700 p-1 rounded"
          >
            ✕
          </button>
        </div>
      )}
      
      <footer className="bg-white border-t py-3 text-center text-xs text-slate-400">
        MedFlow AI Platform • Powered by Google Cloud & Firebase • v1.0.4-hackathon
      </footer>
    </div>
  );
}

export default App;
