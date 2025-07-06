# My Team - AI Assistant App

An AI-powered app that lets you have specialized conversations with different AI assistants for various purposes.

## Features

- **5 Built-in AI Teams**:
  - 👨‍💼 **Life Coach** - Goals, motivation, habits, and personal growth
  - 💰 **Financial Advisor** - Money management and investment strategies
  - ⚕️ **Doctor** - Health advice and medical guidance
  - 🔍 **Researcher** - Information gathering and analysis
  - 👩‍💼 **Executive Assistant** - Productivity and organization

- **Modern Horizontal Navigation** - Icon-based team selection bar with history indicators
- **Persistent Chat Interface** - Always-visible chat with easy team switching
- **Individual Chat History** - Each AI assistant maintains separate conversation history
- **Context Sidebar** - Recent memory and quick action buttons
- **Real-time AI Responses** with Google Gemini API
- **LocalStorage Persistence** - Chat history saved locally and restored on reload
- **Clean, Professional Design** matching modern chat applications

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS + shadcn/ui utilities
- **Storage**: Local Storage (with plans for cloud storage)

## Setup

1. **Clone and install dependencies**:
   ```bash
   cd my-team
   npm install
   ```

2. **Set up Google Gemini API**:
   - Get your API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
   - Copy `.env.example` to `.env`
   - Add your API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## Usage

1. **Select a Team**: Choose from the available AI assistants
2. **Start Chatting**: Type your message and get personalized responses
3. **Switch Teams**: Click "Back" to select a different assistant
4. **Chat History**: Your conversations are saved locally

## API Usage

The app uses Google Gemini's free tier:
- **1,500 requests per day**
- **100 requests per minute**
- **No credit card required**

## Project Structure

```
src/
├── components/          # React components
│   ├── TeamSelector.tsx # Team selection screen
│   ├── TeamCard.tsx     # Individual team cards
│   ├── ChatInterface.tsx # Chat screen
│   └── MessageBubble.tsx # Message display
├── data/
│   └── teams.ts         # Built-in team configurations
├── services/
│   └── gemini.ts        # Google Gemini API integration
├── types/
│   └── index.ts         # TypeScript type definitions
└── lib/
    └── utils.ts         # Utility functions
```

## Future Enhancements

- **Custom Teams**: Create and modify your own AI assistants
- **Cloud Storage**: Sync chat history across devices
- **Team Sharing**: Share custom teams with other users
- **Better Security**: Move API key to backend proxy
- **Enhanced Features**: File uploads, voice chat, etc.

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Contributing

This project follows the patterns established in the broader codebase. See `CLAUDE.md` for development guidelines and architectural decisions.
