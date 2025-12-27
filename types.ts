
export interface VitalReading {
  timestamp: number;
  heartRate: number;
  spO2: number;
  bloodPressure: string;
  source: 'JR' | 'Sensor';
}

export interface Remark {
  id: string;
  timestamp: number;
  text: string;
  author: 'JR' | 'SR';
}

export interface Action {
  id: string;
  timestamp: number;
  type: 'RX' | 'DX' | 'PROC';
  label: string;
  author: string;
  status: 'PENDING' | 'DONE';
}

export type Role = 'JUNIOR' | 'SENIOR';

export interface PatientState {
  id: string;
  name: string;
  age: number;
  vitals: VitalReading[];
  remarks: Remark[];
  actions: Action[];
}
