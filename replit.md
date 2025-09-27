# Overview

This is a 3D relativistic spaceship physics simulation built with React Three.js and Express. The application demonstrates time dilation effects between two spaceships traveling at different velocities, showcasing concepts from Einstein's special and general relativity. The frontend renders an interactive 3D scene with spaceships, trajectory trails, spacetime grids, and control panels, while the backend provides a REST API foundation with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **3D Rendering**: Three.js via @react-three/fiber and @react-three/drei
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite with custom configuration for 3D assets (GLTF, GLB, audio files)
- **State Management**: Custom React hooks and Zustand stores for game state and audio
- **Error Handling**: Error boundaries with fallback to 2D simulation when WebGL fails
- **WebGL Detection**: Graceful degradation for systems without WebGL support

## Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Development**: Hot module replacement via Vite integration
- **API Structure**: RESTful endpoints with /api prefix
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Error Handling**: Centralized error middleware with status code management

## Data Storage
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle-kit for database migrations
- **Schema Location**: Shared schema definitions in /shared/schema.ts
- **Development Storage**: In-memory storage implementation for development

## Physics Engine
- **Relativistic Calculations**: Custom implementation of Lorentz transformations, time dilation, and spacetime curvature
- **Simulation Features**: 
  - Special relativity effects (time dilation based on velocity)
  - General relativity simulation (gravitational time dilation)
  - Real-time proper time calculations for multiple reference frames
  - Curved and straight trajectory calculations

## Component Architecture
- **3D Scene Management**: Modular components for spaceships, starfields, spacetime grids, and trajectory trails
- **Control Systems**: Keyboard controls integration with Three.js scene
- **UI Components**: Radix UI-based component library with consistent theming
- **Simulation Controls**: Interactive panels for adjusting velocities and managing simulation state

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Environment variable-based DATABASE_URL configuration

## 3D Graphics Libraries
- **Three.js**: Core 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helper components and utilities for Three.js scenes
- **React Three Postprocessing**: Visual effects and shaders

## UI Component Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Tailwind CSS**: Utility-first CSS framework

## Development Tools
- **Vite**: Build tool with custom 3D asset support
- **ESBuild**: Production bundling for server code
- **TypeScript**: Type safety across client and server
- **Drizzle Kit**: Database schema management and migrations

## Audio Support
- **Web Audio API**: Sound effects and background music
- **Asset Loading**: Support for MP3, OGG, WAV audio formats

## Query Management
- **TanStack Query**: Server state management and caching for API calls
- **Custom Query Client**: Configured with credential handling and error management