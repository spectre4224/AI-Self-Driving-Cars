# AI Self-Driving Cars Simulation Platform

## Overview

This is a fully functional interactive educational simulation platform for demonstrating AI concepts in autonomous vehicle systems. The application features a React frontend with a Node.js/Express backend, providing an immersive learning experience where users can observe and control AI-powered vehicles in real-time scenarios. The platform successfully demonstrates core AI concepts like pathfinding algorithms, collision detection, and decision-making systems through visual simulation.

## Recent Changes (January 2025)

✓ **Completed functional simulation** - Working canvas-based animation with moving vehicles
✓ **Interactive controls** - Start/Pause functionality for real-time simulation control  
✓ **Multi-vehicle system** - Blue AI vehicle, gray regular vehicle, and green smart vehicle
✓ **Visual road system** - Realistic road with lane markings and proper vehicle movement
✓ **Performance metrics** - Real-time status tracking and safety scoring
✓ **Educational components** - AI concept explanations integrated into the interface

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client application is built using React with TypeScript and follows a component-based architecture. The UI leverages shadcn/ui components for a consistent design system and uses Wouter for lightweight client-side routing. The application features:

- **Real-time Canvas Simulation**: Custom HTML5 canvas implementation for rendering vehicles, obstacles, and AI visualization elements
- **State Management**: React hooks pattern with custom simulation state management through `useSimulation` hook
- **Query Management**: TanStack Query for server state synchronization and caching
- **Responsive Design**: Tailwind CSS with mobile-first approach and dark mode support

### Backend Architecture
The server follows a RESTful Express.js architecture with TypeScript, designed for extensibility and clean separation of concerns:

- **Modular Route System**: Routes are organized in `server/routes.ts` with API prefix pattern
- **Storage Abstraction**: Interface-based storage system in `server/storage.ts` supporting both in-memory and database implementations
- **Development Tooling**: Integrated Vite middleware for hot module replacement and development server

### Data Storage Solutions
The application uses a flexible storage architecture that supports multiple backends:

- **Development**: In-memory storage with Map-based data structures for rapid prototyping
- **Production Ready**: Drizzle ORM with PostgreSQL schema defined in `shared/schema.ts`
- **Database Management**: Neon Database serverless PostgreSQL for scalable cloud deployment

### Authentication and Authorization
Currently implements a basic user system with:

- **User Schema**: Username/password based authentication model
- **Session Management**: Express session handling with PostgreSQL session store
- **Extensible Design**: Interface-based user management ready for OAuth integration

### External Dependencies

- **Database**: Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS for utility-first styling approach
- **Build Tools**: Vite for fast development builds and ESBuild for production optimization
- **Development**: Replit-specific plugins for enhanced development experience

The architecture prioritizes educational value while maintaining production-ready patterns, making it suitable for both learning and real-world application development.