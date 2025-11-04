# TODO App - Setup Guide for Jasmine Daniel

## Project Overview

This is a beautiful TODO application with light/dark theme switching, drag-and-drop functionality, and real-time data synchronization using Lovable Cloud (powered by Supabase).

## Features

✅ **User Authentication** - Email/password signup and login
✅ **CRUD Operations** - Create, read, update, and delete todos
✅ **Theme Switching** - Toggle between light and dark themes
✅ **Drag & Drop** - Reorder todos with drag and drop
✅ **Filters** - View all, active, or completed todos
✅ **Real-time Sync** - Changes sync across all sessions
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable

## Setting Up in VS Code

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **VS Code**
   - Download from: https://code.visualstudio.com/

### Step 1: Clone the Repository

```bash
# Clone your project from GitHub
git clone <YOUR_GITHUB_REPO_URL>

# Navigate into the project directory
cd <PROJECT_NAME>
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Supabase client
- @dnd-kit packages for drag and drop
- All UI components and utilities

### Step 3: Environment Variables

The project automatically configures environment variables through Lovable Cloud. The `.env` file contains:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

**Important**: Never commit the `.env` file to version control!

### Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

The app will open at `http://localhost:8080`

## Project Structure

```
src/
├── assets/              # Images (hero backgrounds)
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── Auth.tsx        # Authentication component
│   ├── ThemeToggle.tsx # Theme switcher
│   ├── TodoInput.tsx   # Add new todos
│   ├── TodoItem.tsx    # Individual todo item
│   ├── TodoList.tsx    # List with drag & drop
│   └── TodoFilters.tsx # Filter controls
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── integrations/       # Backend integrations
│   └── supabase/       # Supabase client (auto-generated)
├── pages/              # Page components
│   ├── Index.tsx       # Main todo page
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main app component
├── index.css           # Global styles & design system
└── main.tsx            # App entry point
```

## Backend Architecture

### Database Schema

**todos table**:
- `id` (UUID) - Primary key
- `user_id` (UUID) - References authenticated user
- `title` (TEXT) - Todo text
- `completed` (BOOLEAN) - Completion status
- `order_index` (INTEGER) - For drag & drop ordering
- `created_at` (TIMESTAMP) - Creation timestamp

### Row Level Security (RLS)

All todos are protected by RLS policies that ensure:
- Users can only see their own todos
- Users can only create todos for themselves
- Users can only update their own todos
- Users can only delete their own todos

### Real-time Subscriptions

The app uses Supabase real-time subscriptions to sync todos across all open sessions.

## How the App Works

### Authentication Flow

1. User visits the app
2. If not logged in, sees login/signup form
3. Creates account or signs in
4. Redirected to main todo interface

### Todo Operations

**Create**: 
- User types in input field
- Presses Enter or clicks + button
- Todo added to database with highest order_index

**Toggle Complete**:
- User clicks checkbox
- Completed status updated in database
- UI updates with strikethrough text

**Delete**:
- User clicks X button (appears on hover)
- Todo removed from database

**Reorder**:
- User drags todo to new position
- All affected todos get new order_index values
- Database updated with new order

**Filter**:
- Click "All", "Active", or "Completed"
- UI filters displayed todos
- Database query remains the same

### Theme Switching

1. User clicks sun/moon icon
2. Theme stored in localStorage
3. CSS classes update
4. Background image changes
5. All color tokens update via CSS variables

## Design System

The app uses a comprehensive design system defined in `src/index.css`:

### Color Tokens

**Light Theme**:
- Primary: Purple (#A855F7)
- Background: Light blue gradient
- Cards: White with subtle borders

**Dark Theme**:
- Primary: Purple (#A855F7)
- Background: Deep purple gradient
- Cards: Dark purple with borders

### Custom CSS Classes

- `.gradient-bg` - Applies theme-specific gradient
- `.todo-card` - Card styling with hover effects
- All colors use HSL values for smooth transitions

## API Reference

### Supabase Client Usage

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch todos
const { data, error } = await supabase
  .from("todos")
  .select("*")
  .order("order_index");

// Create todo
await supabase.from("todos").insert({
  title: "New todo",
  user_id: user.id,
  order_index: 0,
});

// Update todo
await supabase
  .from("todos")
  .update({ completed: true })
  .eq("id", todoId);

// Delete todo
await supabase
  .from("todos")
  .delete()
  .eq("id", todoId);

// Real-time subscription
const channel = supabase
  .channel("todos")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "todos",
  }, (payload) => {
    // Handle changes
  })
  .subscribe();
```

## Building for Production

```bash
# Create production build
npm run build

# The build output will be in the `dist/` folder
```

## Deployment

The app can be deployed through Lovable:
1. Click "Publish" in the Lovable interface
2. Your app will be deployed to a Lovable subdomain
3. Optionally connect a custom domain in Settings

## Troubleshooting

### Development Server Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Database Connection Issues

- Check that `.env` file exists with valid credentials
- Verify internet connection
- Check Supabase project status in Lovable Cloud tab

### Theme Not Persisting

- Check browser localStorage
- Clear cache and reload
- Verify ThemeProvider wraps the app

### Drag & Drop Not Working

- Ensure @dnd-kit packages are installed
- Check that todos have unique IDs
- Verify SortableContext is properly configured

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [DND Kit Documentation](https://docs.dndkit.com/)
- [Lovable Documentation](https://docs.lovable.dev/)

## Support

For issues or questions:
1. Check the Lovable documentation
2. Search existing issues on GitHub
3. Join the Lovable Discord community
4. Create a new issue with detailed description

---

**Happy Coding! 🚀**
