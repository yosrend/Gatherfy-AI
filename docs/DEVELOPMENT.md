# Development Guide

This guide provides detailed information for developers working on the Gatherfy AI project.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn 1.22+)
- **Git** 2.30 or higher
- **VS Code** (recommended) with extensions

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yosrend/Gatherfy-AI.git
   cd Gatherfy-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **Backend**: Supabase (authentication, database, storage)
- **Forms**: React Hook Form + Zod validation

### Project Structure

```
Gatherfy-AI/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EventGenerator.tsx
│   │   ├── ManualEventCreator.tsx
│   │   ├── EventPreview.tsx
│   │   ├── EventEditor.tsx
│   │   ├── GuestRSVP.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── styles/            # Global styles and CSS
│   ├── supabase/          # Supabase configuration
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper utilities
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── docs/                  # Documentation
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 🧩 Components

### Component Architecture

The application follows a hierarchical component structure:

#### Layout Components
- **App.tsx**: Main application wrapper with routing logic
- **Layout**: Overall page layout structure

#### Feature Components
- **LandingPage.tsx**: Landing page with marketing content
- **Login.tsx**: User authentication interface
- **Dashboard.tsx**: Main user dashboard
- **EventGenerator.tsx**: AI-powered event creation
- **ManualEventCreator.tsx**: Manual event creation form
- **EventPreview.tsx**: Event preview and sharing
- **EventEditor.tsx**: Event editing interface
- **GuestRSVP.tsx**: Guest RSVP management

#### UI Components
Located in `src/components/ui/` - reusable components from shadcn/ui

### Component Guidelines

1. **Use TypeScript**: All components should have proper TypeScript types
2. **Functional Components**: Use functional components with hooks
3. **Props Interface**: Define clear interfaces for component props
4. **Default Exports**: Use default exports for components
5. **Storybook**: Consider adding Storybook stories for complex components

Example component structure:

```typescript
interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  className?: string;
}

export function EventCard({ event, onEdit, onDelete, className }: EventCardProps) {
  // Component logic
  return (
    <div className={cn("card", className)}>
      {/* Component JSX */}
    </div>
  );
}
```

## 🎨 Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration:

```typescript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... custom colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### CSS Variables

Custom CSS variables are defined in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

### Styling Guidelines

1. **Use Tailwind Classes**: Prefer utility classes over custom CSS
2. **Responsive Design**: Use mobile-first approach
3. **Component Variants**: Use `cn()` utility for conditional classes
4. **Dark Mode**: Support both light and dark themes
5. **Accessibility**: Ensure proper contrast ratios and focus states

## 🔧 State Management

### Local State

Use `useState` for component-level state:

```typescript
const [events, setEvents] = useState<Event[]>([]);
const [loading, setLoading] = useState(false);
```

### Global State

Use React Context for global application state:

```typescript
// context/AppContext.tsx
interface AppContextType {
  user: User | null;
  events: Event[];
  // ... other state
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Context logic
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### Custom Hooks

Create custom hooks for reusable stateful logic:

```typescript
// hooks/useEvents.ts
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch logic
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, fetchEvents };
}
```

## 📡 Data Fetching

### Supabase Integration

The application uses Supabase for backend services:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Data Fetching Patterns

```typescript
// Example: Fetching events
async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Example: Creating an event
async function createEvent(eventData: CreateEventDto): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .single();

  if (error) throw error;
  return data;
}
```

## 📝 Forms

### React Hook Form

The application uses React Hook Form for form management:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  // ... other fields
});

type EventFormData = z.infer<typeof eventSchema>;

export function EventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = (data: EventFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 🧪 Testing

### Testing Setup

The project is set up for testing with:

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing (planned)

### Writing Tests

```typescript
// src/components/__tests__/EventCard.test.tsx
import { render, screen } from '@testing-library/react';
import { EventCard } from '../EventCard';

describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    // ... other properties
  };

  it('renders event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<EventCard event={mockEvent} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockEvent);
  });
});
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   VITE_APP_URL=https://your-domain.com
   ```

2. **Build Command**
   ```bash
   npm run build
   ```

### Deployment Options

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Debugging

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "html"
  }
}
```

### Debugging Tips

1. **Use React DevTools**: Install browser extension for React debugging
2. **Network Tab**: Monitor API calls in browser dev tools
3. **Console Logging**: Use appropriate log levels
4. **Error Boundaries**: Implement error boundaries for better error handling

## 📚 Learning Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Recommended Articles
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Tailwind CSS Tips](https://tailwindcss.com/blog)

### Tools and Extensions
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

## 🤝 Contributing

1. Follow the [Contributing Guide](../CONTRIBUTING.md)
2. Use conventional commit messages
3. Write tests for new features
4. Update documentation
5. Ensure all tests pass before submitting PR

## 🆘 Troubleshooting

### Common Issues

1. **Build fails due to TypeScript errors**
   - Check for type errors in your code
   - Ensure all imports are correct
   - Run `npm run type-check` for detailed errors

2. **Supabase connection issues**
   - Verify environment variables are set correctly
   - Check Supabase project settings
   - Ensure network connectivity

3. **Styling issues**
   - Clear browser cache
   - Check Tailwind CSS configuration
   - Verify CSS imports in main.tsx

4. **Dependency conflicts**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check for conflicting dependency versions

### Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/yosrend/Gatherfy-AI/issues)
- **Discussions**: [Ask questions](https://github.com/yosrend/Gatherfy-AI/discussions)
- **Email**: dev@gatherfy.ai

---

Happy coding! 🚀