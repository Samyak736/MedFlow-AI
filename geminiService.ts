
import { GoogleGenAI, Type } from "@google/genai";
import { PatientState } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLegalReport = async (patient: PatientState) => {
  const prompt = `
    Generate a professional Medico-Legal Patient Report based on the following clinical timeline:
    
    Patient: ${patient.name}, Age: ${patient.age}
    
    Timeline Events:
    ${patient.vitals.map(v => `[${new Date(v.timestamp).toLocaleTimeString()}] Vitals: HR ${v.heartRate}, SpO2 ${v.spO2}%, BP ${v.bloodPressure} (Logged by ${v.source})`).join('\n')}
    ${patient.remarks.map(r => `[${new Date(r.timestamp).toLocaleTimeString()}] Remark: ${r.text} (By ${r.author})`).join('\n')}
    ${patient.actions.map(a => `[${new Date(a.timestamp).toLocaleTimeString()}] Action: ${a.type} - ${a.label} (By ${a.author})`).join('\n')}

    Format the output as a formal medical document with sections:
    1. Incident Summary
    2. Clinical Progression (Timestamped)
    3. Management & Decision Logic
    4. Legal Authentication & Chain of Command
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate report. Please check API configuration.";
  }
};

export const generateEducationalSummary = async (patient: PatientState, lastAction: string) => {
  const prompt = `
    Act as a Senior Teaching Physician. A Junior Resident just saw you perform the action: "${lastAction}".
    Briefly explain the medical reasoning (Pathophysiology) behind this decision based on the current vitals: 
    HR: ${patient.vitals[patient.vitals.length - 1]?.heartRate}, 
    SpO2: ${patient.vitals[patient.vitals.length - 1]?.spO2}%.
    
    Keep it concise, encouraging, and educational for a Junior Resident.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    return "Learning module unavailable.";
  }
};
