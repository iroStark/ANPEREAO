# ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico

## Overview

ANPERE is a professional association website for telecommunications radio spectrum professionals in Angola. The project is a comprehensive web application built as a single-page application (SPA) that showcases the organization's mission, services, events, publications, and provides contact functionality. The website serves as the primary digital presence for ANPERE, offering information about the association's activities, membership benefits, and professional development opportunities in the telecommunications sector.

The system includes a complete administrative platform with secure authentication, enabling authorized users to manage all website content through CRUD interfaces for Publications, Events, Legislation, About content, and Gallery items. All data is persistently stored in a PostgreSQL database with proper data validation and session management.

## Recent Changes

### October 2, 2025 - Member Registration System with PDF Generation
- Implemented complete member registration system accessible via /associar-se route
- Created members table in PostgreSQL with comprehensive fields matching official registration form
- Added full CRUD operations for member management in storage layer
- Built public registration endpoint (POST /api/members/register) with photo upload support
- Created admin endpoints for member management (GET, PUT, DELETE /api/admin/members)
- Developed MemberRegistration page with multi-section form based on official PDF template
- Integrated jsPDF library for automated PDF generation of registration certificates
- Form sections: Personal Info, Document Info, Family Info, Professional Info, Contact Info
- Auto-generated member numbers in format XXXX/YYYY (sequential number/year)
- PDF certificate includes all registration details and official formatting
- Connected "Junte-se a Nós" button (AboutSection) and "ASSOCIAR-SE" service card to registration page
- Comprehensive form validation using Zod schemas and react-hook-form
- Photo upload functionality with preview and storage in uploads directory
- Post-registration screen with member number display and PDF download option

### September 26, 2025 - Database Persistence Implementation
- Migrated from volatile MemStorage to persistent PostgreSQL database using Drizzle ORM
- Implemented DatabaseStorage class with full CRUD operations for all content types
- Updated database schema to align with frontend CRUD interface requirements
- Publications: title, description, category, date, fileUrl, downloadUrl fields
- Events: title, description, date, time, location, type, capacity, registrationUrl fields
- End-to-end testing confirms data persistence across logout/login cycles and server restarts
- Admin authentication system maintains session state with PostgreSQL session storage
- All CRUD operations (Create, Read, Update, Delete) now persist to database permanently

### September 26, 2025 - Comprehensive Responsive Design Implementation
- Implemented mobile-first responsive design across all admin pages for proper screen fitting
- Created shared AdminLayout component using shadcn Sidebar for consistent navigation and responsive behavior
- Established responsive breakpoints: base (≤639px mobile), md (640-1023px tablet), lg (≥1024px desktop)
- Updated all admin components with responsive layouts: AdminDashboard, AdminAbout, AdminLegislation, AdminGallery, AdminEvents, AdminPublications
- Fixed critical routing bug where URL changes didn't update main content - AdminDashboard now correctly routes to appropriate components
- Mobile optimizations: collapsible sidebar, single-column layouts, responsive forms and dialogs
- Consistent responsive patterns: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 for cards, responsive padding and text sizes
- All interactive elements now have proper data-testid attributes for automation testing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system following professional educational institution aesthetics
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Image Assets**: Static images stored in attached_assets directory for hero slideshow and visual content

### Design System
- **Color Palette**: Deep blue primary (220 85% 25%), light blue accents (210 70% 85%), with orange highlights for CTAs
- **Typography**: Inter font family with consistent sizing scale (text-4xl to text-sm)
- **Layout**: Responsive design with consistent spacing units (2, 4, 6, 8, 12, 16) and section spacing (py-12, py-16)
- **Components**: Modular component architecture with floating navigation menu, hero slideshow, service cards, and dedicated sections for each main area

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **API Structure**: RESTful API design with /api prefix for all backend routes

### Component Structure
- **Page Layout**: Single-page application with smooth scrolling navigation between sections
- **Navigation**: Floating menu component that adapts based on scroll position
- **Content Sections**: AboutSection (mission/vision), EventsSection, PublicationsSection, LegislationSection, GallerySection, ContactSection
- **Interactive Elements**: Service cards with hover effects, carousel/slideshow components, modal dialogs for detailed content

### Development Environment
- **Build System**: Vite with TypeScript compilation and React Fast Refresh
- **Development Server**: Express server with Vite middleware integration
- **Asset Handling**: Vite handles static assets with path aliases for clean imports
- **Error Handling**: Runtime error overlay for development debugging

## External Dependencies

### UI and Styling
- **Radix UI**: Complete set of accessible UI primitives (accordion, dialog, dropdown, navigation, etc.)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Class Variance Authority**: Type-safe variant management for component styling
- **Lucide React**: Consistent icon library for UI elements

### Database and Data Management
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect
- **Drizzle Kit**: Database migration and schema management tools
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

### Development and Build Tools
- **Vite**: Fast build tool with development server and production bundling
- **ESBuild**: JavaScript bundler for server-side code compilation
- **TypeScript**: Static type checking for both client and server code
- **React Hook Form**: Form handling with validation and resolver support

### Utilities and Libraries
- **Date-fns**: Modern date utility library for date formatting and manipulation
- **Clsx/TailwindCSS Merge**: Utility for conditional CSS class composition
- **Wouter**: Minimalist routing library for React applications
- **Embla Carousel**: Touch-friendly carousel component for image galleries