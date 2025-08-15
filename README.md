# ETIC AI Chatbot

An intelligent chatbot application for ETIC Algarve school built with Next.js 15, TypeScript, and ShadCN UI.

## Features

- 🤖 AI-powered chatbot using Google Gemini 2.5 Flash
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI components with ShadCN UI
- 📊 Database integration with Prisma and PostgreSQL
- 🔄 Real-time chat with streaming responses
- 📅 Integrated scheduling system for interviews, tours, and calls
- 🌐 Embeddable widget for external websites

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **AI**: Vercel AI SDK with Google Gemini
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your database URL and Google Gemini API key.

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # ShadCN UI components
│   ├── hero/          # Hero section components
│   ├── chatbot/       # Chatbot components
│   └── scheduling/    # Scheduling form components
├── lib/               # Utility functions
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

## Environment Variables

```env
DATABASE_URL="your-postgresql-connection-string"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License.
