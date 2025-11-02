# Gatherfy AI - AI-Powered Event Management Platform

<div align="center">

![Gatherfy AI Logo](#)

**Intelligent Event Creation & Management Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)

[Live Demo](#) | [Documentation](docs/) | [Report Bug](https://github.com/yosrend/Gatherfy-AI/issues) | [Request Feature](https://github.com/yosrend/Gatherfy-AI/issues)

</div>

## 📖 Overview

Gatherfy AI is a comprehensive event management platform that leverages artificial intelligence to streamline the process of creating, managing, and attending events. Built with modern web technologies, it provides an intuitive interface for both event organizers and attendees.

### ✨ Key Features

- 🤖 **AI-Powered Event Generation**: Automatically generate event details using AI
- 📝 **Manual Event Creation**: Traditional event creation with advanced customization
- 📊 **Event Dashboard**: Comprehensive overview of all events and their metrics
- 👥 **Guest Management**: Advanced guest list management with RSVP tracking
- 🎨 **Beautiful UI**: Modern, responsive interface built with shadcn/ui components
- 🔐 **Role-Based Access**: Admin and user roles with appropriate permissions
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🌙 **Dark Mode Support**: Built-in theme switching capability

## 🚀 Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### Backend & Database
- **Supabase** - Backend as a Service (authentication, database, storage)
- **Hono** - Lightweight web framework (for future API development)

### State Management & Forms
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Charts & Data Visualization
- **Recharts** - Composable charting library
- **D3.js** - Powerful data visualization

## 📁 Project Structure

```
Gatherfy-AI/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── LandingPage.tsx  # Landing page component
│   │   ├── Login.tsx        # Authentication component
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── EventGenerator.tsx # AI event creation
│   │   ├── ManualEventCreator.tsx # Manual event creation
│   │   ├── EventPreview.tsx # Event preview component
│   │   ├── EventEditor.tsx  # Event editing
│   │   ├── GuestRSVP.tsx    # RSVP management
│   │   └── ...
│   ├── supabase/
│   │   └── functions/       # Supabase edge functions
│   ├── styles/
│   ├── utils/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── docs/                    # Documentation
├── package.json
├── vite.config.ts
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

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
   # Create a .env file in the root directory
   touch .env
   ```

   Add your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
```

The built files will be in the `build` directory.

## 🏗️ Architecture Overview

### Component Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Layout Components**: Handle overall page structure
- **Feature Components**: Implement specific functionality (events, guests, etc.)
- **UI Components**: Reusable presentational components from shadcn/ui
- **Data Components**: Handle data fetching and state management

### State Management

The application uses React's built-in state management:

- **Local State**: useState for component-level state
- **Context API**: For global application state (user authentication, theme)
- **Custom Hooks**: For reusable stateful logic

### Data Flow

1. **User Interaction** → Component Event Handlers
2. **State Updates** → React State Management
3. **API Calls** → Supabase (when implemented)
4. **UI Updates** → Re-render with new data

## 📱 Application Views

The application consists of several main views:

### 1. Landing Page (`/`)
- Introduction to Gatherfy AI
- Key features showcase
- Call-to-action for login/signup

### 2. Login (`/login`)
- User authentication
- Role selection (admin/user)

### 3. Dashboard (`/dashboard`)
- Overview of all events
- Event statistics and metrics
- Quick actions for event management

### 4. AI Event Generator (`/ai-generator`)
- AI-powered event creation
- Intelligent suggestions for event details
- Automated guest list generation

### 5. Manual Event Creator (`/manual-creator`)
- Traditional event creation form
- Advanced customization options
- Guest import functionality

### 6. Event Preview (`/preview/:id`)
- Preview event before publishing
- Share functionality
- RSVP management

### 7. Guest RSVP (`/rsvp/:token`)
- Guest RSVP interface
- Event details display
- Response confirmation

## 🎨 UI/UX Design

### Design System

The application uses a comprehensive design system based on:

- **Color Palette**: Modern, accessible color scheme
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent spacing using Tailwind classes
- **Components**: Reusable component library

### Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Tailwind's responsive breakpoints
- **Touch Friendly**: Optimized for touch interactions

### Accessibility

- **WCAG 2.1**: Compliance with accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Optimized for screen readers
- **ARIA Labels**: Proper ARIA attributes

## 📊 Data Models

### Event Model

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  coverImage?: string;
  capacity?: number;
  invitedGuests: Guest[];
  createdAt: string;
  status: 'draft' | 'published' | 'cancelled';
}
```

### Guest Model

```typescript
interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'declined';
  respondedAt?: string;
}
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

### Deployment Options

- **Vercel**: Recommended for React applications
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Custom setup
- **Docker**: Containerized deployment

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Feature testing
- **E2E Tests**: End-to-end testing with Playwright

### Running Tests

```bash
# Install testing dependencies (when implemented)
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests (when implemented)
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the amazing component library
- **Supabase** for the backend services
- **Vite** for the fast build tool
- **React Team** for the excellent framework

## 📞 Support

- **Email**: support@gatherfy.ai
- **Documentation**: [docs.gatherfy.ai](https://docs.gatherfy.ai)
- **Issues**: [GitHub Issues](https://github.com/yosrend/Gatherfy-AI/issues)

## 🔮 Roadmap

### Upcoming Features

- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Integration with calendar apps
- [ ] Custom branding options

### Future Enhancements

- [ ] Event streaming capabilities
- [ ] Advanced networking features
- [ ] Sponsor management
- [ ] Venue management system
- [ ] Catering integration
- [ ] Advanced reporting

---

<div align="center">

**Made with ❤️ by the Gatherfy Team**

[Website](https://gatherfy.ai) | [Twitter](https://twitter.com/gatherfy) | [LinkedIn](https://linkedin.com/company/gatherfy)

</div>
