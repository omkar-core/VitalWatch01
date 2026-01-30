# VitalWatch Platform

**VitalWatch** is a comprehensive, AI-powered remote patient monitoring platform designed to manage Non-Communicable Diseases (NCDs) like diabetes and hypertension, with a focus on serving rural populations. It provides real-time health data, predictive alerts, and dedicated portals for doctors, patients, and clinic administrators.

This project was built as a demonstration of a scalable, robust, and modern healthcare IoT solution.

---

## ✨ Core Features

The platform is divided into four main sections, each tailored to a specific user group:

#### 🏠 Public-Facing Site
- **Landing Page:** Engaging introduction to the platform's mission and capabilities.
- **Detailed Feature & Tech Pages:** In-depth information on features, technology (`Why GridDB Cloud`), and a step-by-step "How It Works" guide.
- **Transparent Pricing:** Clear pricing tiers for different organizational scales.
- **Role-Based Registration:** Separate signup flows for doctors, patients, and clinic admins.

#### 🧑‍⚕️ Doctor Portal
- **Clinical Dashboard:** A high-level overview of patient statistics, critical alerts, and recent activity.
- **Patient Management:** A searchable and filterable list of all assigned patients, with access to detailed health records.
- **Real-Time Alerts:** An intelligent notification center that prioritizes critical and predictive alerts for timely intervention.
- **AI-Powered Analytics:** Tools for visualizing population health trends and generating insightful reports.

#### 🧑‍🦱 Patient Portal
- **Personal Dashboard:** A simplified, easy-to-understand view of current health status, active alerts, and medication reminders.
- **Health Data Tracking:** Interactive charts to explore historical glucose, blood pressure, and other vital trends.
- **Appointments & Communication:** A hub to manage appointments and receive advice from the care team.

#### 👨‍💼 Admin Portal
- **System Overview:** Key metrics for the entire platform, including user counts, device status, and system health.
- **User & Device Management:** Tools to enroll new users (doctors, patients) and manage the lifecycle of monitoring devices.
- **System Monitoring:** Real-time performance dashboards for critical infrastructure like GridDB.
- **Comprehensive Reporting:** Generate clinical, operational, and financial reports for administrative oversight.

---

## 🛠️ Technology Stack

VitalWatch is built with a modern, scalable, and secure technology stack:

- **Frontend:** [Next.js](https://nextjs.org/) with React (App Router) & [TypeScript](https://www.typescriptlang.org/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Google Gemini](https://deepmind.google.com/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit) for summaries and diagnostic suggestions.
- **Database:** [GridDB Cloud](https://www.toshiba-sol.co.jp/en/pro/griddb/) for high-performance time-series data storage.
- **Backend:** [Vercel](https://vercel.com/) with API Routes
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To run the VitalWatch platform locally, follow these steps:

1.  **Install Dependencies:**
    Make sure you have Node.js and npm installed. Then, run the following command in the project root:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Create a `.env` file in the project root and add your credentials for the various services:
    ```env
    # For Google AI (Gemini) features
    GEMINI_API_KEY=YOUR_API_KEY_HERE

    # For Telegram alert notifications
    TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
    TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID
    
    # For GridDB Cloud connection
    GRIDDB_API_URL=YOUR_GRIDDB_API_URL
    GRIDDB_USERNAME=YOUR_GRIDDB_USERNAME
    GRIDDB_PASSWORD=YOUR_GRIDDB_PASSWORD
    ```

3.  **Run the Development Server:**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```

4.  **Access the Application:**
    Open your browser and navigate to `http://localhost:3000` to see the application in action.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors and style issues.
- `npm run genkit:dev`: Starts the Genkit development server for AI flow testing.
