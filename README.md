# CMS-Builder - Visual CMS Website Builder

A production-ready visual website builder. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- 🎨 **Visual Drag & Drop Builder** - Intuitive interface for creating websites
- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 💾 **Database Integration** - PostgreSQL with Prisma ORM
- 📱 **Responsive Design** - Desktop, tablet, and mobile preview modes
- 🎯 **Component Library** - Rich set of pre-built components
- 💾 **Auto-save** - Automatic saving every 5 seconds
- 📤 **Export Functionality** - Export as HTML, CSS, or JSON
- 🌙 **Dark/Light Mode** - Theme switching support
- 📄 **Multi-page Support** - Create and manage multiple pages per project

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd framer-cms-builder
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your database URL and other required environment variables.

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. (Optional) Seed the database:
\`\`\`bash
npm run db:seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following main entities:

- **User** - User accounts and authentication
- **Project** - Website projects
- **Page** - Individual pages within projects
- **Component** - UI components placed on pages

## API Routes

- `POST /api/auth/register` - User registration
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/pages` - Create new page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page
- `POST /api/components` - Create component
- `PUT /api/components/[id]` - Update component
- `DELETE /api/components/[id]` - Delete component
- `GET /api/export/[projectId]` - Export project
- `POST /api/autosave` - Auto-save functionality

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy

### Database Setup

For production, use a hosted PostgreSQL service like:
- Vercel Postgres
- Supabase
- PlanetScale
- Railway

## Environment Variables


DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id" # Optional
GOOGLE_CLIENT_SECRET="your-google-client-secret" # Optional

