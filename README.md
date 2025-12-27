
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17pfeupUDxgZBpMbms9k47qwVI5B4Xln_

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

MedFlow AI
Standardizing Care, Empowering Juniors, Protecting Hospitals.

Project Overview
MedFlow AI is a clinical workflow automation platform designed to solve the bottlenecks of modern hospital environments. By replacing messy manual typing with a structured, clickable interface, we enable senior doctors to make rapid decisions while integrating real-time bedside data from Junior Residents (JRs).

The platform creates a "Clinical Intelligence Loop" where every action is timestamped for legal protection, and every senior decision is explained by AI to educate the junior staff.

Key Features
One-Click Decision Interface: Senior doctors select symptoms, diagnoses, and prescriptions through modular tiles, saving 5–10 minutes per patient.

Real-Time Vitals & Remarks: JRs input live bedside data (BP, SpO2, Heart Rate) and observations that sync instantly to the senior's dashboard via Firebase.

AI-Powered Education: Uses Google Gemini to provide instant clinical rationales ("the why") behind prescriptions to educate JRs in real-time.

Medico-Legal Audit Trail: Automatically generates timestamped, professional reports for every patient interaction, stored securely in Google Workspace.

Tech Stack
Generative AI: Google Gemini, Google AI Studio.

Backend & Database: Firebase (Firestore & Auth).

Infrastructure: Google Cloud Platform (Cloud Run, Cloud Functions).

Collaboration: Google Workspace (Docs & Drive API).

Setup Instructions
1. Prerequisites
Node.js (v18 or higher)

Firebase CLI installed (npm install -g firebase-tools)

A Google Cloud Project with Gemini API enabled.

2. Backend Setup (Firebase)
Go to the Firebase Console and create a new project.

Enable Firestore Database and Authentication.

Clone the repository:

Bash

git clone https://github.com/your-repo/medflow-ai.git
cd medflow-ai
Install dependencies:

Bash

npm install
3. Environment Variables
Create a .env file in the root directory and add your Google/Firebase credentials:

Code snippet

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_GEMINI_API_KEY=your_gemini_key
4. Running the Project
Bash

# Start the development server
npm start
Process Flow
JR Input: Vitals and bedside remarks are entered.

Sync: Data flows through Firebase to the Senior Doctor.

Action: Senior clicks through the diagnosis/prescription tiles.

Rationale: Gemini explains the clinical choice to the JR.

Archive: A timestamped report is generated and saved to Google Drive.
