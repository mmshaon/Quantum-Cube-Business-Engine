
# Quantum Cube Business Cloud - Alpha Generation

A futuristic, neon-accented financial operating system featuring the Yusra AI assistant, real-time analytics, and comprehensive business management modules.

## Project Overview

Quantum Cube Business Cloud is designed to provide a sleek, performant, and intelligent platform for business operations. It integrates advanced UI/UX principles with cutting-edge AI capabilities, powered by the Google Gemini API, to offer a truly next-generation business operating system.

### Complete Feature List

*   **Authentication:** Secure sign-in, sign-up, password reset, and session management.
*   **Dashboard:** Real-time KPIs, financial dynamics, budget utilization, and AI insights.
*   **Transactions:** Detailed ledger with AI-powered categorization, custom categories, voice entry, and edit capabilities.
*   **Budgets & Cashflow:** Comprehensive financial planning and allocation tracking.
*   **Goals:** Strategic objective tracking with progress visualization.
*   **Ventures:** Management of strategic projects and ROI monitoring.
*   **Design Assets:** Version control system for design files with rollback support.
*   **Reports:** Dynamic generation and export of financial statements (Income/Balance/Budget).
*   **Admin Control:** System health monitoring, event logs, and security settings.
*   **Settings:** User preferences including appearance (Dark/Light mode), notifications, and regional settings.
*   **User Management:**
    *   **User Roster:** Invite, view, manage (Active/Suspended/Blocked), and view detailed history.
    *   **Role-Based Access Control (RBAC):** Create custom roles with granular permission matrices across modules (Finance, HR, IT, etc.).
    *   **Access Logs:** Detailed audit trails of user activities with filtering by User, Status, Action, and Date.
*   **Yusra AI Assistant:**
    *   **Multilingual Voice Interaction:** Real-time speech-to-text and text-to-speech in BN, EN, AR with dynamic, frequency-based audio visualization.
    *   **Contextual Intelligence:** Adapts persona and responses based on user role and dynamic system prompts.
    *   **Advanced Analysis:** Leverages higher `thinkingBudget` for complex tasks like prediction, research, and strategy planning.
    *   **Internet Grounding:** Integrates Google Search for up-to-date and external information, with source indicators in chat.
    *   **Role-Based Command Execution:** Suggests and *executes* actions (e.g., creating transactions, approving requests) based on user permissions. Visual feedback via toast notifications.
    *   **Chat Persistence:** History saved locally so conversations continue seamlessly.
    *   **Knowledge Base Integration:** Upload training documents (text, image, PDF), auto-detect types via voice annotation, and manage processing status.
    *   **Yusra Control Hub:** An advanced administrative module:
        *   **Granular Command Control:** Enable/disable specific AI commands per role with bulk select tools.
        *   **Advanced Role Management:** Clone configurations between roles, Export/Import configs as JSON.
        *   **Global Settings Overrides:** Customize AI params (Temp, TopK, TopP) per role with visual override indicators.
        *   **Document Management:** Filter/Search training docs, reprocess errors, and view files.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
*   **npm** (comes with Node.js)

You will also need a Google Gemini API Key.

### Obtaining a Gemini API Key

1.  Go to the [Google AI Studio](https://aistudio.google.com/).
2.  Log in with your Google account.
3.  Create a new API key or select an existing one.
4.  Copy your API key.

## Local Development Setup

Follow these steps to get the Quantum Cube Business Cloud running on your local machine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quantum-cube-business-cloud
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory. This file will store your Google Gemini API Key and (optionally) Firebase configuration.

```dotenv
# .env
# Required for Gemini API calls
API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

# Optional: For actual Firebase Authentication. If not provided, a mock authentication system will be used.
# REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
# ... (other firebase config)
```

Replace `YOUR_GOOGLE_GEMINI_API_KEY` with the API key you obtained from Google AI Studio.

### 4. Run the Application

```bash
npm start
```

This will start the development server. Open your browser and navigate to `http://localhost:8000` (or the port specified in your terminal) to see the application running.

## Folder Structure

The project follows a standard React application structure:

```
.
├── public/                       # Public assets (e.g., index.html)
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Auth.tsx              # Authentication forms
│   │   ├── App.tsx               # Main application layout and routing
│   │   ├── Dashboard.tsx         # Main dashboard with KPIs
│   │   ├── DesignVersionControl.tsx # Design asset versioning
│   │   ├── LiveVoiceMode.tsx     # Real-time voice interaction
│   │   ├── Transactions.tsx      # Transaction management
│   │   ├── UserManagement.tsx    # User and role management
│   │   ├── YusraChat.tsx         # AI chat interface
│   │   └── YusraControlHub.tsx   # Admin interface for AI config
│   ├── context/                  # React Context providers
│   ├── services/                 # External service integrations
│   ├── constants.ts              # Global constants and mock data
│   ├── index.tsx                 # Entry point
│   └── types.ts                  # TypeScript definitions
└── ...
```

## Key Technologies Used

*   **React 18+**: Component-based UI library.
*   **TypeScript**: Type safety and developer experience.
*   **Tailwind CSS**: Utility-first styling.
*   **Google Gemini API (`@google/genai`)**: Advanced AI and multimodal interactions.
*   **Firebase (Mock/Real)**: Authentication and persistence simulation.
*   **Recharts**: Data visualization.
*   **Lucide React**: Iconography.

---

**Coding Guidelines Adherence**

This project strictly follows the `@google/genai` SDK guidelines:
*   API Keys are accessed via `process.env.API_KEY`.
*   Correct model names (`gemini-2.5-flash`, `gemini-2.5-flash-native-audio-preview-09-2025`) are used.
*   System instructions and generation config are passed correctly in the `config` object.
*   Live API integration uses raw PCM audio data processing and proper session management.
# Quantum-Cube-Business-Engine
