# Fitness Web Application

[🌐 Visit Live Application](https://workoutrec.dimitarkl.me/)

A full-stack web application for creating, managing, and sharing workout routines. Built with Angular frontend and Node.js/Express backend.

## Features

### User Management
- **Authentication**: Secure user registration and login system
- **User Profiles**: Personal profiles with customizable usernames and weight unit preferences
- **Session Management**: JWT-based authentication with secure cookie handling

### Workout Management
- **Create Workouts**: Design custom workout routines with multiple exercises
- **Exercise Tracking**: Add sets, reps, and weights for each exercise
- **Duration Tracking**: Set and track workout duration
- **Edit & Delete**: Full CRUD operations for your workouts

### Social Features
- **Workout Feed**: Browse workouts from other users
- **Like System**: Like and interact with community workouts
- **User Profiles**: View other users' workout collections

### Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, dark-themed interface with green accent colors
- **Tailwind CSS**: Utility-first styling for consistent design

## Technology Stack

### Frontend
- **Angular 18.2**: Modern TypeScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming for state management
- **Angular Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Type-safe database queries
- **JWT**: JSON Web Tokens for authentication

### Database
- **PostgreSQL**: Relational database for data storage
- **Drizzle**: Database migrations and schema management

## Project Structure

```
FitnessWebApp/
├── Client/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── home/       # Home page and workout components
│   │   │   ├── user/       # Authentication components
│   │   │   ├── account/    # User profile management
│   │   │   └── shared/     # Shared components and services
│   │   └── styles.css      # Global styles and CSS variables
├── Server/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Custom middleware
│   │   └── db/            # Database configuration
└── shared/                 # Shared TypeScript types
    └── types/             # Common interfaces and types
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/update` - Update user profile
- `GET /users/:id` - Get user by ID
- `GET /user/workouts` - Get current user's workouts

### Workouts
- `GET /workouts` - Get recent workouts
- `GET /workouts/:id` - Get specific workout
- `POST /create-workout` - Create new workout
- `PUT /workouts/:id` - Update workout
- `DELETE /workouts/:id` - Delete workout
- `POST /workouts/:id/like` - Like/unlike workout

### Exercises
- `GET /exercises` - Get available exercises

## Key Components

### Frontend Components
- **PostComponent**: Display workout cards with like/edit/delete functionality
- **CreateWorkoutComponent**: Form for creating and editing workouts
- **WorkoutDetailsComponent**: Full workout view with all exercises
- **SetInputComponent**: Input fields for exercise sets (reps/weight)
- **NavigationComponent**: Main navigation with authentication state

### Backend Services
- **AuthService**: Handle user authentication and JWT tokens
- **WorkoutService**: Manage workout CRUD operations
- **UserService**: User profile management

## Styling

The application uses a dark theme with:
- **Primary Colors**: Dark blues and grays (`#111827`, `#1f2937`)
- **Accent Color**: Bright green (`#22c55e`) for buttons and highlights
- **Text**: Light gray (`#f5f5f5`) for readability
- **Custom CSS Variables**: Defined in styles.css for consistent theming

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Angular CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dimitarkl/FitnessWebApp.git
   cd FitnessWebApp
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd Server
   npm install
   
   # Install client dependencies
   cd ../Client
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the Server directory with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run database migrations**
   ```bash
   cd Server
   npx drizzle-kit migrate
   ```

5. **Start the applications**
   ```bash
   # Start the server (from Server directory)
   npm run dev
   
   # Start the client (from Client directory)
   npm start
   ```

6. **Access the application**
   - **Live Application**: https://workoutrec.dimitarkl.me/
   - **Local Development**:
     - Frontend: http://localhost:4200
     - Backend API: http://localhost:5000

## Development

- **Frontend**: Angular development server with hot reload
- **Backend**: Express server with TypeScript compilation
- **Database**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT tokens stored in secure HTTP-only cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and personal use.
