# 🏢 Max-ERP — Enterprise Resource Planning System

An intelligent, modern Enterprise Resource Planning (ERP) web application built to streamline business operations, internal controls, and data management. Powered by a responsive frontend and cloud-first architecture, Max-ERP integrates AI capabilities with robust enterprise modules.

---

## ✨ Core Modules & Features

* 📊 **Executive Dashboard:** Real-time overview of key business metrics and operational workflows (`Dashboard.tsx`).
* 💰 **Finance Management:** Comprehensive tracking for financial records, transactions, and accounting workflows (`Finance.tsx`).
* 👥 **Human Resources (HR):** Employee records, staff administration, and personnel management (`HumanResources.tsx`, `HRContext.tsx`).
* 📦 **Inventory Control:** Stock management, product tracking, and inventory levels (`Inventory.tsx`, `InventoryContext.tsx`).
* 🛡️ **IT Control & System Audit:** Built-in audit trail logging and role-based access control (`AuditContext.tsx`, `AuthContext.tsx`).
* 🤖 **AI Studio Integration:** Smart assistance and automated insights powered by Google Gemini AI models.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React + TypeScript + Vite
* **Styling & Layout:** Modern CSS (`index.css`) & Responsive UI Components (`AppLayout.tsx`, `Sidebar.tsx`, `Header.tsx`)
* **Backend & Database:** Firebase (Firestore Database & Authentication)
* **AI Integration:** Google Gen AI SDK / Gemini API

---

## 🚀 Getting Started

Follow these instructions to set up and run **Max-ERP** locally on your machine.

### Prerequisites

* Ensure you have **Node.js** (LTS version) installed.

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maxbrandon1019/Max-ERP
   cd Max-ERP

2. **Install project dependencies:**
   ```bash
   npm install ```

3. **Configure Environment Variables:**
Copy the example environment file:
```bash
   cp .env.example .env.local
```
Open .env.local and add your Gemini API Key and Firebase credentials:
Code snippet
```bash
   GEMINI_API_KEY=your_actual_gemini_api_key
```

4. **Launch the local development server:**
```bash
   npm run dev
```

View the Application:
Open your browser and navigate to http://localhost:5173 (or the URL shown in your terminal).
