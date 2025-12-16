# App Idea

## Core Concept:

A todo app where tasks flow through time-based buckets, moving from abstract future planning down to concrete daily execution. Users explicitly manage bucket transitions when time periods end.

## The Five Buckets:

1. Inbox — Entry point for all new todos (permanent bucket)
2. Yearly — Specific year (e.g., "2025 bucket")
3. Monthly — Specific month (e.g., "November 2025 bucket")
4. Weekly — Specific week (e.g., "Week 45 of 2025 bucket")
5. Daily — Specific day (e.g., "December 9, 2025 bucket")

## Key Behaviors:

- Time-bound buckets: Year/Month/Week/Day buckets are created dynamically and tied to specific time periods
- Explicit transitions: When a time period ends, the system prompts the user to handle the transition
- User-controlled migration: Users decide what happens to unfinished todos:
  - Move to new bucket (carry forward)
  - Move back to parent bucket (e.g., Daily → Weekly)
  - Keep old bucket archived for reference
- Progressive refinement: Users gradually move todos from abstract ("tackle this year") to concrete ("do this today")
- Drag-and-drop: Simple UI to move tasks between buckets
- Multi-user: Basic auth so each user has their own isolated todo universe

Happy Path Example:

1. User adds "Learn React" to Inbox
2. Decides it's a 2025 goal → drags to "2025" bucket
3. November 1st: commits to starting this month → drags to "November 2025" bucket
4. Monday: wants to work on it this week → drags to "Week 45" bucket
5. Tuesday morning: schedules it for today → drags to "December 9" bucket
6. End of day: System prompts "December 9 has ended. What should happen to 'Learn React'?"
   - User chooses: move back to "Week 45" bucket
7. End of week: System prompts "Week 45 has ended. Create Week 46?"
   - User reviews unfinished todos, moves some to Week 46, others back to Monthly

Bucket Lifecycle:

- Active: Current bucket being used
- Pending Transition: Time period ended, awaiting user decision
- Archived: User completed transition, bucket is historical (read-only)

## Philosophy:

Forces intentional task prioritization through temporal constraints and explicit review moments. Users must consciously decide the fate of unfinished work, preventing task rot and promoting realistic planning.

## Tech Stack

### Language

- TypeScript

### Frontend Framework

- React — Component-based UI library
- Tanstack Start
- Styling & UI Components
  - Tailwind CSS
  - Shadcn/ui
- Database & ORM
  - Neon
  - Drizzle ORM
- Zod for validation
- BetterAuth
- Tanstack Query
- Tanstack Form
- dnd-kit — Modern drag-and-drop toolkit
- date-fns or dayjs
- GitHub Actions
- Vercel or Netlify

# Learning and Implementation plan

**Master Rule**: consider done a phase when it has the tag [DONE] in the title

## [DONE] Phase 0: Environment Setup & Fundamentals

**Goal**: Get a running Tanstack Start app with TypeScript and Tailwind.

What you'll learn:

- Tanstack Start project structure
- File-based routing
- Basic React component syntax (JSX, props, state with useState)
- How to run dev server, build, and preview

What you'll build:

- Empty app scaffold
- A single route (/) rendering "Hello World"
- Tailwind working (style a button to confirm)

Key concepts:

- React components are functions that return JSX
- Tanstack Start's app/routes directory maps to URLs
- tsx files = TypeScript + JSX

## [DONE] Phase 1: Static UI Shell

**Goal**: Build the 5-bucket layout (Inbox, Yearly, Monthly, Weekly, Daily) with static mock data.

What you'll learn:

- Component composition (breaking UI into reusable pieces)
- Props and TypeScript interfaces
- Mapping over arrays to render lists
- Tailwind layout (flexbox/grid)
- Shadcn components (install Card, Button)

What you'll build:

- <BucketColumn> component (reusable, shows bucket title + status badge)
- <TodoCard> component (displays a single todo)
- Hardcoded array of todos rendered in each bucket
- Mock "pending transition" banner (non-functional)

Key concepts:

- Props are immutable
- map() is how you render lists
- Components should be pure functions when possible

## Phase 2: Client-Side State Management

**Goal**: Make todos interactive. Add, delete, and move todos between buckets (in-memory only, no persistence yet).

What you'll learn:

- useState for local component state
- Lifting state up (shared state lives in parent component)
- Event handlers (onClick, onDragStart, etc.)
- Immutable state updates (spread operators, filter, map)

What you'll build:

- "Add Todo" form in Inbox
- Delete button on each todo
- Move todo between buckets (buttons, not drag-drop yet)
- Mock bucket state transitions (change status from active to pending_transition)

Key concepts:

- State is mutable reference, but you must create new objects/arrays to trigger re-renders
- This is similar to StateFlow in Android — you emit new state, don't mutate the old one
- Parent component owns state; children receive props and call callbacks

## Phase 3: Database Schema & Drizzle Setup

**Goal**: Define your data model including bucket lifecycle and set up Drizzle with Neon.

What you'll learn:

- Drizzle schema definition (tables, columns, relations, enums)
- Zod schemas for runtime validation
- How to generate and run migrations
- Connection pooling with Neon (serverless Postgres)

What you'll build:

- schema.ts with:
  - users table
  - buckets table (id, type, period, status, userId, createdAt)
  - todos table (id, title, description, bucketId, userId, createdAt)

- Zod schemas for Todo, Bucket, and User types
- Bucket status enum: active | pending_transition | archived
- Bucket type enum: inbox | yearly | monthly | weekly | daily
- Migration files
- Seed script with sample data including different bucket states

Key concepts:

- Drizzle schema = TypeScript-first ORM (like Room entities, but less annotation-heavy)
- Zod schema = runtime validation (like Moshi/Gson but type-safe)
- Migrations are version-controlled SQL diffs
- Enums provide type safety for bucket states and types

Architectural decision:

- Buckets are first-class entities with their own lifecycle
- Todos reference buckets via bucketId foreign key
- Status field enables transition workflow tracking

## Phase 4: Server Actions & Data Fetching

**Goal**: Replace in-memory state with real database operations.

What you'll learn:

- Tanstack Start's server functions (RPC-like API calls)
- React Server Components (RSC) vs Client Components
- createServerFn for mutations
- Tanstack Query for client-side caching and optimistic updates

What you'll build:

- Server function: getBuckets(userId) (returns active + pending buckets)
- Server function: getTodos(userId, bucketId?)
- Server function: createTodo(data)
- Server function: updateTodo(id, data) (includes moving between buckets)
- Server function: deleteTodo(id)
- Server function: createBucket(type, period, userId)
- Refactor UI to fetch/mutate via these functions

Key concepts:

- Server functions run on the server (like Retrofit endpoints, but co-located with components)
- Tanstack Query handles caching, revalidation, and loading states automatically
- RSC vs Client: RSC = server-rendered, no interactivity; Client = hydrated, interactive

Architectural pattern:

- Treat server functions as your "repository layer" (Android architecture equivalent)
- Keep business logic in server functions; UI components stay thin
- Server functions validate bucket states before mutations

## Phase 5: Authentication with BetterAuth

**Goal**: Add user sign-up, login, and session management.

What you'll learn:

- BetterAuth setup and configuration
- Session-based auth in server functions
- Protecting routes (redirect if not authenticated)
- Accessing current user in Server Components and server functions

What you'll build:

- /login and /signup routes with forms
- Session middleware
- Modify server functions to filter by current user
- Protect all routes except login/signup
- Create default Inbox bucket on user registration

Key concepts:

- Sessions are server-side state (like Android's SharedPreferences + backend tokens)
- BetterAuth handles cookie management and session validatio
- Middleware runs before routes (like Interceptors in OkHttp)

Architectural decision:

- All server functions must validate session before DB operations (authorization layer)
- Users get an Inbox bucket automatically on signup

## Phase 6: Drag-and-Drop Between Buckets

**Goal**: Implement drag-and-drop to move todos between buckets.

What you'll learn:

- HTML5 Drag-and-Drop API or dnd-kit library
- Optimistic updates with Tanstack Query
- Handling async state transitions
- Validation rules (can't drag to archived buckets, etc.)

What you'll build:

- Draggable <TodoCard> components
- Droppable <BucketColumn> components
- onDrop handler that calls updateTodo to change bucket
- Optimistic UI update (todo moves immediately, then reverts if server fails)
- Visual feedback during drag (drag preview, drop zones)
- Validation: prevent drops on archived/pending buckets

Key concepts:

- Drag-and-drop is event-driven (like touch events in Android)
- Optimistic updates = update UI before server confirms (undo if error)
- dnd-kit handles accessibility and mobile touch automatically
- Bucket status affects drop target validity

## Phase 7: Time-Based Bucket Logic & Detection

**Goal**: Implement automatic detection when time periods end.

What you'll learn:

- Date manipulation libraries (date-fns or dayjs)
- Period calculation (week numbers, month boundaries)
- Server-side background checks vs on-demand detection

What you'll build:

- Server function: checkBucketExpiry(userId)
  - Detects if active buckets have expired
  - Updates status from active to pending_transition
  - Returns list of buckets needing attention
- Utility functions to compute period strings (e.g., 2025-11, 2025-W45, 2025-12-09)
- Server function: getOrCreateBucket(type, period, userId)
  - Gets existing bucket or creates new one with active status
- UI: Poll or check on mount for expired buckets

Key concepts:

- Periods use ISO strings for consistency (ISO week dates for weeks)
- Detection happens server-side to ensure correctness across timezones
- User's timezone matters — store and use it for period calculations
- Lazy detection (check when user visits) vs proactive (cron job) — start with lazy

Architectural decision:

- Buckets don't auto-archive; they transition to pending_transition state
- Detection logic runs when user loads the app or on a schedule
- Period strings are the canonical identifier for buckets

## Phase 8: Bucket Transition Workflow

**Goal**: Build the UI and logic for users to handle bucket transitions.

What you'll learn:

- Modal/dialog patterns in React (Shadcn Dialog component)
- Multi-step forms with state management
- Batch updates (migrating multiple todos)
- Transaction-like server operations

What you'll build:

- Transition prompt modal/banner when pending_transition buckets exist
- UI showing expired bucket + unfinished todos + options:
  - Create new bucket and move todos forward
  - Move todos back to parent bucket
  - Archive bucket (mark as archived, todos move to parent)
- Server function: transitionBucket(bucketId, action, targetBucketId?)
  - Handles todo migration based on user choice
  - Creates new bucket if needed
  - Updates old bucket status to archived
- Confirmation step before executing transition

Key concepts:

- Transitions are user-driven, explicit operations
- Server function performs multiple DB operations atomically
- UI guides user through decision-making process
- Parent bucket relationship: Daily → Weekly → Monthly → Yearly → Inbox

Architectural pattern:

- Treat transitions as a workflow with clear steps
- Server validates that target buckets exist or creates them
- Transitions are logged/auditable (optional: add transition history)

## Phase 9: Bucket History & Archive View

**Goal**: Allow users to view archived buckets and their todos (read-only).

What you'll learn:

- Filtered queries (active vs archived)
- Read-only UI patterns
- Toggle/tab navigation

What you'll build:

- "Show archived buckets" toggle in UI
- Server function: getArchivedBuckets(userId, type?)
- Read-only bucket columns for archived buckets
- Visual distinction (grayed out, labeled "Archived")
- Optional: Search/filter archived todos

Key concepts:

- Archived buckets are historical records
- Users can reference past work but not modify it
- Useful for retrospectives and tracking completion patterns

## Phase 10: Deployment & CI/CD

**Goal**: Deploy to Vercel/Netlify and automate deployments via GitHub Actions.

What you'll learn:

- Build process for Tanstack Start
- Environment variables (database URL, auth secrets)
- GitHub Actions workflows (lint, test, build, deploy)
- Vercel/Netlify project setup
- Database migration in production

What you'll build:

- .github/workflows/deploy.yml
- Vercel/Netlify config
- Environment variable management
- Preview deployments for PRs
- Migration strategy (run on deploy or manually)

Key concepts:

- Serverless deployment = no server management (like Firebase Cloud Functions)
- CI/CD = automated testing + deployment on every push
- Preview URLs = staging environments per branch
- Database migrations need careful handling in production

## Phase 11: Polish & Advanced Features

**Goal**: Add quality-of-life improvements.

What you'll learn:

- Form validation with React Hook Form + Zod
- Error boundaries (catch render errors)
- Loading skeletons (Suspense boundaries)
- Keyboard shortcuts
- Dark mode (Tailwind + Shadcn theming)
- Toast notifications for actions

What you'll build:

- Better form UX (inline validation, error messages)
- Global error handling
- Loading states for all async operations
- Toast notifications (todo created, bucket transitioned, etc.)
- Keyboard navigation for power users
- Empty states (no todos in bucket)
- Onboarding flow for new users

Optional advanced features:

- Bulk operations (select multiple todos, move together)
- Todo subtasks
- Recurring todos
- Analytics (completion rates, bucket usage patterns)
- Mobile-responsive improvements
- PWA capabilities
- Automated tests
