# FWC HRMS

A modern Human Resource Management System built with Next.js, React, and Recharts.

## Features

- **Role-Based Access Control:** Differentiated dashboards for Admin, HR, Managers, and Employees.
- **Core HR:** Manage employee directories, department budgets, and attendance tracking.
- **Payroll System:** Dynamic salary structures, automated deductions, and downloadable PDF payslips.
- **Leave Management:** End-to-end leave application and approval workflows.
- **Recruitment (ATS):** Track job postings and candidate pipelines.
- **AI Integrations:** Features a smart HR chatbot, voice assistant, and resume screening tools built on the Gemini API.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Log in using `admin@fwcit.com` and `admin123`.
