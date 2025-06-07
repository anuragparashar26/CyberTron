# CyberTron

CyberTron is an interactive cybersecurity learning platform that simulates security tools and analysis in a gamified terminal environment.

## ✨ Features

- 🔍 URL and File scanning with VirusTotal integration
- 💻 Interactive terminal interface
- 🎮 Gamified learning experience
- 📊 Progress tracking and achievements
- 🛠️ Network analysis tools simulation
- 🔐 Security analysis commands
- 📝 Interactive security quizzes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- VirusTotal API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/anuragparashar26/cybertron.git
cd cybertron
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
VITE_VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎮 Usage

### Available Commands

- `scan --url <url>` - Scan a URL for potential threats
- `scan --file <file>` - Analyze a file for malware
- `nmap <target>` - Simulate network scanning
- `analyze <file>` - Perform detailed file analysis
- `help` - Show all available commands

### Quick Start
1. Type `help` to see available commands
2. Complete the tutorial missions
3. Try scanning URLs and files
4. Take security quizzes to earn points

## 🛠️ Built With

- React
- Vite
- TailwindCSS
- Express
- VirusTotal API
