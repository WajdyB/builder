# CMS-Builder - Visual CMS Website Builder

A production-ready visual website builder with advanced project management, real-time analytics, and professional-grade features. Built with Next.js, TypeScript, and PostgreSQL.

## ✨ Latest Features (Recent Updates)

### 🎯 **Enhanced Project Management Dashboard**
- **Advanced Project States**: 6 comprehensive statuses (Draft, Published, Archived, Review, Maintenance, Exported)
- **Real Analytics Tracking**: View counts, download counts, and last viewed timestamps
- **Smart Status Management**: Change project status directly from dashboard with automatic timestamps
- **Dual View Modes**: Switch between elegant card view and detailed list view
- **Project Actions**: Edit, duplicate, export (HTML/CSS/JSON), and delete with confirmation dialogs
- **Status Distribution Overview**: Visual breakdown of project statuses with percentages
- **Enhanced Search & Filtering**: Search by title and filter by status

### 🎨 **Builder & Preview Improvements**
- **Perfect Preview Synchronization**: Builder canvas and preview mode now perfectly aligned
- **Device Boundary Constraints**: Components automatically constrained within device limits
- **Smart Component Positioning**: Prevents components from exceeding canvas boundaries
- **Visual Device Indicators**: Clear boundaries shown in both builder and preview
- **"Fit to Device" Button**: Automatically adjusts components to fit device constraints

### 🃏 **Enhanced Card Component**
- **Content Customization**: Customize title, description, and button text
- **Content Types**: Choose between default, custom, or empty content modes
- **Style Variants**: 4 visual styles (default, elevated, gradient, dark)
- **Real-time Updates**: Changes reflect immediately in builder and preview

### 🔐 **Improved Authentication & Profile System**
- **Profile Picture Integration**: User avatars displayed throughout the application
- **Optimized Image Handling**: File-based storage system (no more base64 header issues)
- **Avatar Upload System**: Easy profile picture management
- **Session Persistence**: Improved authentication state management

### 📊 **Professional Analytics System**
- **View Tracking**: Automatic tracking of project interactions
- **Download Analytics**: Track export/download activities
- **Performance Metrics**: Real-time statistics dashboard
- **Data Persistence**: Analytics data saved and synchronized

## 🚀 Core Features

- 🎨 **Visual Drag & Drop Builder** - Intuitive interface for creating websites
- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 💾 **Database Integration** - PostgreSQL with Prisma ORM
- 📱 **Responsive Design** - Desktop, tablet, and mobile preview modes
- 🎯 **Component Library** - Rich set of pre-built components
- 💾 **Auto-save** - Automatic saving every 5 seconds
- 📤 **Export Functionality** - Export as HTML, CSS, or JSON
- 🌙 **Dark/Light Mode** - Theme switching support
- 📄 **Multi-page Support** - Create and manage multiple pages per project
- 🎭 **Component Customization** - Extensive properties panel for all components
- 🔄 **Real-time Preview** - Live preview with perfect synchronization
- 📱 **Device Mode Switching** - Mobile, tablet, and desktop preview modes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with enhanced error handling
- **Database**: PostgreSQL with Prisma ORM and migrations
- **Authentication**: NextAuth.js with JWT and session management
- **State Management**: Zustand with optimized store patterns
- **UI Components**: Radix UI + shadcn/ui with custom enhancements
- **Styling**: Tailwind CSS with custom design system
- **File Handling**: Optimized image upload and storage system
- **Real-time Updates**: Custom event system for component synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd cms-builder
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Fill in your database URL and other required environment variables.

4. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

5. **Optional: Seed the database:**
```bash
npm run db:seed
```

6. **Clean up any existing base64 images (if migrating):**
```bash
npm run cleanup:images
```

7. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Enhanced Database Schema

The application uses the following main entities with enhanced features:

- **User** - User accounts, authentication, and profile pictures
- **Project** - Website projects with status management and analytics
- **Page** - Individual pages within projects
- **Component** - UI components with extensive customization properties
- **Image** - Optimized image storage and management

### Project Status System
```typescript
enum Status {
  DRAFT        // Work in progress
  PUBLISHED    // Live and accessible
  ARCHIVED     // Stored for reference
  REVIEW       // Pending approval
  MAINTENANCE  // Under maintenance
  EXPORTED     // Downloaded package
}
```

## 🔌 Enhanced API Routes

### Core Project Management
- `GET /api/projects` - Get user's projects with analytics
- `POST /api/projects` - Create new project with initial status
- `PUT /api/projects/[id]` - Update project including status changes
- `DELETE /api/projects/[id]` - Delete project with confirmation
- `GET /api/projects/[id]/export` - Export project in multiple formats

### Enhanced User Management
- `GET /api/user/profile` - Get user profile with optimized image handling
- `POST /api/user/upload-avatar` - Upload profile picture with file storage
- `PUT /api/user/profile` - Update user profile information

### Component & Page Management
- `POST /api/pages` - Create new page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page
- `POST /api/components` - Create component
- `PUT /api/components/[id]` - Update component
- `DELETE /api/components/[id]` - Delete component

### Export & Analytics
- `GET /api/export/[projectId]` - Export project as HTML/CSS/JSON
- `POST /api/autosave` - Auto-save functionality
- `POST /api/projects/[id]/view` - Track project views (planned)
- `POST /api/projects/[id]/download` - Track project downloads (planned)

## 🎨 Component Library

### Available Components
- **Layout**: Section, Divider, Container
- **Navigation**: Navigation bar, Footer
- **Content**: Heading, Paragraph, Text, Link
- **Media**: Image, Video, Gallery, Slider
- **Interactive**: Button, Form, Input, Checkbox, Radio, Select
- **UI Elements**: Card, Hero, Testimonial, Newsletter, Social links
- **Advanced**: Modal, Tooltip, Dropdown, Accordion, Tabs

### Component Customization
Each component includes:
- **Content Properties**: Text, titles, descriptions, button text
- **Style Properties**: Colors, fonts, sizes, spacing, borders
- **Layout Properties**: Width, height, positioning, alignment
- **Behavior Properties**: States, interactions, animations

## 🔧 Advanced Features

### Smart Canvas Management
- **Device Boundary Constraints**: Components automatically stay within device limits
- **Dynamic Canvas Sizing**: Canvas adapts to content while respecting device constraints
- **Component Positioning**: Smart positioning with boundary checking
- **Visual Indicators**: Clear device boundaries and component constraints

### Enhanced Preview System
- **Perfect Synchronization**: Builder and preview are 1:1 identical
- **Real-time Updates**: Changes reflect immediately across all views
- **Device Mode Switching**: Seamless switching between mobile, tablet, and desktop
- **Export Consistency**: What you see is exactly what you get

### Professional Project Management
- **Status Workflow**: Comprehensive project lifecycle management
- **Analytics Dashboard**: Real-time project performance metrics
- **Export Management**: Multiple format support with automatic status updates
- **Collaboration Ready**: Status-based workflow for team collaboration

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy with automatic database migrations

### Database Setup

For production, use a hosted PostgreSQL service:
- **Vercel Postgres** - Seamless integration with Vercel
- **Supabase** - Feature-rich PostgreSQL platform
- **PlanetScale** - Serverless MySQL platform
- **Railway** - Simple database hosting

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# File Upload (if using external storage)
UPLOAD_DIR="public/uploads"
```

## 📚 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:seed      # Seed database with sample data
npm run cleanup:images # Clean up base64 images (migration)

# Linting & Type Checking
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🔄 Recent Updates & Improvements

### Performance & Reliability
- ✅ Fixed `net::ERR_RESPONSE_HEADERS_TOO_BIG` error with optimized image handling
- ✅ Implemented file-based image storage system
- ✅ Enhanced error handling and user feedback
- ✅ Improved TypeScript type safety throughout

### User Experience
- ✅ Added comprehensive project status management
- ✅ Implemented real-time analytics tracking
- ✅ Enhanced dashboard with dual view modes
- ✅ Added professional project management features
- ✅ Improved component customization experience

### Technical Improvements
- ✅ Perfect preview mode synchronization
- ✅ Smart component boundary constraints
- ✅ Enhanced API response handling
- ✅ Optimized database queries and updates
- ✅ Improved state management and persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/cms-builder/issues) page
2. Create a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

---

**Built with ❤️ using Next.js, React, and modern web technologies**

