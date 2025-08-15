# Implementation Plan

- [x] 1. Project Setup and Core Infrastructure

  - Initialize Next.js 15+ project with TypeScript and App Router
  - Configure Tailwind CSS and install ShadCN UI with components.json
  - Set up project structure with proper folder organization
  - Install and configure essential dependencies (Vercel AI SDK with Google Gemini, Prisma, etc.)
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2. Database Schema and Models Setup

  - [x] 2.1 Configure Prisma with PostgreSQL database

    - Set up Prisma schema with User Session, Message, and Scheduling Request models
    - Create database migrations for all data models
    - Set up database connection and environment variables
    - _Requirements: 6.1, 6.2_

  - [x] 2.2 Implement TypeScript interfaces and types

    - Create TypeScript interfaces for all data models (UserSession, Message, SchedulingRequest, Program)
    - Set up Zod schemas for form validation
    - Create utility types for API responses and component props
    - _Requirements: 6.1, 6.2, 6.3_

-

- [x] 3. Hero Section Implementation

  - [x] 3.1 Create responsive hero component with ETIC AI branding

    - Build hero section using ShadCN Button and Card components
    - Implement responsive design with Tailwind CSS utilities
    - Add call-to-action button to trigger chatbot widget
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Add animations and micro-interactions

    - Integrate Framer Motion for entrance animations
    - Implement hover effects and button interactions
    - Add Intersection Observer for scroll-triggered animations
    - _Requirements: 1.1, 8.1_

- [x] 4. Core Chatbot Widget Infrastructure

  - [x] 4.1 Install and configure ShadCN Chatbot Kit components

    - Install all required chatbot components via CLI commands
    - Configure Chat, MessageList, MessageInput, and supporting components
    - Set up proper TypeScript types for chatbot components
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.2 Create small chatbot widget icon component

    - Build small, visible chat icon positioned at bottom of screen using ShadCN Button
    - Implement widget positioning and z-index management
    - Add notification badge for new messages using ShadCN Badge
    - Create smooth open/close animations with Framer Motion
    - _Requirements: 2.1, 2.2, 8.1, 8.2_

- [-] 5. Chat Interface Implementation

  - [x] 5.1 Build main chat popover interface

    - Create chat container using ShadCN Dialog or Popover (sized for good usability, not full screen)
    - Integrate ShadCN Chatbot Kit Chat component
    - Implement message history persistence during session
    - Add proper accessibility attributes and keyboard navigation
    - _Requirements: 2.3, 2.4, 8.1, 8.2, 8.3, 8.4_

  - [ ] 5.2 Configure AI integration with Vercel AI SDK

    - Set up API route for chat endpoint (/api/chat)
    - Integrate Google Gemini 2.5 Flash API with streaming responses
    - Implement useChat hook with proper configuration
    - Create system prompt with ETIC Algarve information and guidelines
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_

- [ ] 6. Scheduling System Implementation

  - [ ] 6.1 Create interview scheduling form

    - Build form using ShadCN Form components with React Hook Form
    - Add Input, Select, and Textarea components for user information
    - Implement Zod validation schema for form data
    - Create form submission handler with loading states
    - _Requirements: 5.1, 5.2, 5.5, 6.1, 6.2, 6.3_

  - [ ] 6.2 Implement tour scheduling calendar

    - Integrate ShadCN Calendar component with date-fns
    - Create time slot selection interface
    - Add group size and special requirements fields
    - Implement availability checking and booking logic
    - _Requirements: 5.1, 5.3, 5.5, 6.1, 6.2, 6.3_

  - [ ] 6.3 Build call scheduling interface
    - Create date picker for preferred call dates
    - Implement time preference selection with RadioGroup
    - Add contact information collection form
    - Handle timezone considerations for international students
    - _Requirements: 5.1, 5.4, 5.5, 6.1, 6.2, 6.3_

- [ ] 7. Chat Action Buttons and Scheduling Integration

  - [ ] 7.1 Implement three-button action system

    - Create action buttons that appear at the end of AI responses
    - Build "Schedule Interview" button that triggers interview form
    - Build "Schedule Tour" button that triggers calendar interface
    - Build "Schedule Call" button that triggers call scheduler
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 7.2 Connect scheduling forms to database
    - Implement API routes for each scheduling type
    - Create database insertion logic for scheduling requests
    - Add confirmation messages and reference number generation
    - Set up email notifications for new scheduling requests
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8. Embeddable Widget Development

  - [ ] 8.1 Create standalone widget bundle

    - Configure Webpack for standalone JavaScript bundle
    - Implement Shadow DOM encapsulation for style isolation
    - Create widget loader script with configuration options
    - Set up PostMessage API for cross-origin communication
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ] 8.2 Implement widget integration API
    - Create simple JavaScript snippet for easy integration
    - Add configuration options for theme, position, and branding
    - Implement origin validation for security
    - Create fallback iframe solution for maximum compatibility
    - _Requirements: 9.1, 9.3, 9.4, 9.5, 9.6_

- [ ] 9. Testing and Quality Assurance

  - [ ] 9.1 Implement unit tests for components

    - Write tests for hero section component using React Testing Library
    - Test chatbot widget functionality and state management
    - Create tests for scheduling forms and validation logic
    - Test AI integration and message handling
    - _Requirements: All requirements - testing coverage_

  - [ ] 9.2 Add integration tests for user flows
    - Test complete conversation flow from widget open to scheduling
    - Verify scheduling form submissions and database storage
    - Test embeddable widget functionality across different domains
    - Validate responsive design across device sizes
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 10. Performance Optimization and Deployment

  - [ ] 10.1 Optimize application performance

    - Implement code splitting for chatbot components
    - Optimize images and assets with Next.js Image component
    - Add proper caching strategies for API responses
    - Minimize bundle size for embeddable widget
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 10.2 Deploy to production environment
    - Configure Vercel deployment with environment variables
    - Set up production database and connection strings
    - Configure domain and SSL certificates
    - Test production deployment and widget embedding
    - _Requirements: 7.1, 7.2, 7.3, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
