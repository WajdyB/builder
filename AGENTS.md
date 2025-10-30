# CMS-Builder - Agent Instructions

## Project Overview
This is a visual website builder (CMS) built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Users can drag-and-drop components to create websites visually.

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npm run db:seed      # Seed database with sample data
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint
```

## Project Structure

### Main Directories
- `/app` - Next.js 14 App Router pages and API routes
- `/components` - React components (UI library + builder components)
- `/lib` - Utility functions, API clients, stores, hooks
- `/prisma` - Database schema and migrations
- `/public` - Static assets

### Key Files
- `/app/builder/[projectId]/page.tsx` - Main builder interface
- `/components/builder/canvas.tsx` - Drag-and-drop canvas
- `/components/builder/component-panel.tsx` - Component library sidebar
- `/components/builder/properties-panel.tsx` - Component properties editor
- `/components/builder/preview-mode.tsx` - Preview functionality
- `/lib/store/builder-store.ts` - Zustand state management
- `/lib/auth.ts` - NextAuth configuration
- `/app/api/autosave/route.ts` - Auto-save API endpoint
- `/app/api/export/[projectId]/route.ts` - Export functionality

## Builder Functionality

### Drag & Drop System
- Components from the left panel can be dragged onto the canvas
- Once dropped, components can be moved by clicking and dragging
- Components can be resized using the 8 resize handles (corners and edges)
- Position and size are constrained to canvas boundaries
- All positions are stored as absolute coordinates (x, y, width, height)

### Component Selection
- Click a component to select it
- Selected components show blue resize handles
- Properties panel updates to show selected component's properties
- Click canvas background to deselect

### Preview Mode
- Press Ctrl+P or click Preview button to toggle preview mode
- Preview shows exact 1:1 representation of the canvas
- No edit handles shown in preview mode

### Export
- Projects can be exported as HTML, CSS, or JSON
- HTML export includes all components with proper styling
- Export preserves component positioning and styling

## Database Schema

### Main Models
- **User** - Authentication and profile
- **Project** - Top-level container with status (DRAFT, PUBLISHED, etc.)
- **Page** - Multiple pages per project
- **Component** - UI elements with JSON properties
- **Image** - Uploaded images (stored as Bytes in DB)

### Component Storage
Components are stored with:
- `type` - Component type (button, text, heading, etc.)
- `properties` - JSON object with all component properties
- `x, y` - Position coordinates
- `width, height` - Component dimensions
- `zIndex` - Layer order

## Recent Fixes (DO NOT REVERT)

### Canvas Drag & Drop
- Fixed closure issues with isDragging state
- Proper event handler cleanup on unmount
- Scroll container support for large canvases
- Zoom-aware positioning

### Component Positioning
- All positions are absolute (not relative)
- Boundary constraints prevent components from exceeding canvas
- Smooth drag and resize operations

### Preview Mode
- Perfect synchronization with canvas
- Same rendering logic as canvas but without edit handles
- Proper device dimensions

## Known Issues & Limitations

### Image Storage
- README mentions "file-based storage" but schema uses Bytes
- Consider migrating to file paths for better performance
- Large images can cause header size issues

### Missing Features
- Analytics (view/download tracking) - mentioned in README but not implemented
- No collaborative editing
- No undo/redo beyond Zustand history

## Code Style Preferences

### TypeScript
- Use explicit types for function parameters and returns
- Avoid `any` unless absolutely necessary
- Use interface for object shapes

### React
- Use functional components with hooks
- Prefer `useCallback` for event handlers in performance-critical components
- Use proper dependency arrays in `useEffect`

### Styling
- Use Tailwind CSS utility classes
- Component-specific styles in component files
- Avoid inline styles except for dynamic values (positioning, sizing)

### State Management
- Use Zustand store for builder state
- Keep server state separate (React Query could be added)
- Auto-save on element changes (debounced)

## Testing

### Manual Testing Checklist
1. Drag component from panel to canvas ✓
2. Move component on canvas ✓
3. Resize component using handles ✓
4. Edit component properties ✓
5. Preview mode shows correct output ✓
6. Export generates valid HTML ✓
7. Auto-save works (every 5 seconds) ✓
8. Multiple device modes work ✓

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
4. Deploy

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Full URL of deployed app

## Troubleshooting

### Drag & Drop Not Working
- Check canvas ref is properly attached
- Verify event handlers are not being removed
- Check for console errors

### Components Not Saving
- Verify auto-save hook is running
- Check API route responds correctly
- Verify Prisma connection

### Preview Not Matching Canvas
- Ensure same rendering logic in both
- Check device dimensions match
- Verify all properties are passed correctly
