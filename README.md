# CyberTron - Interactive Cybersecurity Learning Platform

CyberTron is a gamified, terminal-based learning platform designed to teach cybersecurity concepts in an interactive and engaging way. Users can run simulated security tools, complete challenges, take quizzes, and track their progress on a live dashboard.

## Core Features

- **Interactive Terminal:** A simulated command-line interface with commands like `nmap`, `whois`, and `scan`.
- **User Authentication:** Secure sign-up, login, and profile management powered by Supabase Auth.
- **Gamified Learning:** Earn XP, unlock badges, and climb the leaderboard by completing challenges and quizzes.
- **VirusTotal Integration:** Scan URLs and files for threats using the VirusTotal API, proxied through a secure Supabase Edge Function.
- **Progress Dashboard:** A personalized dashboard showing user stats, earned achievements, available challenges, and a global leaderboard.
- **Security Quizzes:** Test your knowledge with multiple-choice quizzes and earn XP.
- **CTF-Style Challenges:** Solve puzzles in the terminal to unlock rewards.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend & Database:** Supabase (Auth, Postgres, Edge Functions)
- **API:** VirusTotal API
- **Styling:** TailwindCSS

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v22 or later)
- npm or yarn
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Clone the Repository

```bash
git clone https://github.com/anuragparashar26/CyberTron.git
cd cybertron
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1.  **Log in to Supabase CLI:**

    ```bash
    supabase login
    ```

2.  **Link to Your Supabase Project:**
    Replace `YOUR_PROJECT_ID` with your actual Supabase project ID from your project's dashboard URL (`https://supabase.com/dashboard/project/YOUR_PROJECT_ID`).

    ```bash
    supabase link --project-ref YOUR_PROJECT_ID
    ```

3.  **Run Database Migrations:**
    The `supabase_setup.sql` and `supabase_rpc_setup.sql` files contain the necessary schema and functions. Copy their contents and run them in the Supabase SQL Editor in your project dashboard.

4.  **Deploy Edge Function:**
    The project uses an Edge Function to securely proxy requests to the VirusTotal API.
    ```bash
    supabase functions deploy
    ```

### 4. Configure Environment Variables

Create a `.env` file in the root of the project and add your Supabase and VirusTotal credentials.

```env
# .env

# Your Supabase project URL
VITE_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"

# Your Supabase project anon key
VITE_SUPABASE_ANON_KEY="YOUR SUPABASE_ANON_KEY_HERE"

# Your VirusTotal API key (used for the Edge Function)
VITE_VIRUSTOTAL_API_KEY="YOUR_VIRUSTOTAL_API_KEY_HERE"
```

**Important:** You also need to set your VirusTotal API key as a secret for your deployed Edge Function.

```bash
supabase secrets set VIRUSTOTAL_API_KEY=YOUR_VIRUSTOTAL_API_KEY_HERE
```

### 5. Run the Development Server

You are now ready to start the application.

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

Application is Live on Render- [LIVE](https://cybertron-uvmm.onrender.com/)
---

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build in the `dist/` folder.
- `npm run preview`: Serves the production build locally for testing.
- `npm run lint`: Lints the project files for errors.