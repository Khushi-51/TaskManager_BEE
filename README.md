# Task Manager - Full-Stack Application

A comprehensive task management application demonstrating modern full-stack development with Express.js, MongoDB, JWT authentication, WebSocket real-time updates, and React frontend.

## Features

### Backend
- **JWT Authentication**: Secure user authentication with token-based sessions
- **MongoDB Integration**: Persistent data storage with optimized queries
- **WebSocket Support**: Real-time task updates across connected clients
- **Redis Caching**: Performance optimization for frequent queries
- **Security**: Password hashing with bcryptjs, helmet middleware, CORS protection
- **Database Scaling**: Indexes on frequently queried fields for performance

### Frontend
- **React UI**: Modern, responsive interface
- **Real-time Updates**: Live task changes via WebSocket
- **Task Management**: Create, read, update, delete tasks
- **Filtering**: Filter by status, priority, category
- **Sorting**: Automatic sorting by priority and due date
- **Task Organization**: Categories, tags, priorities, due dates

## Tech Stack

### Backend
- Express.js - Web framework
- MongoDB - Database
- JWT - Authentication
- Socket.IO - Real-time communication
- Redis - Caching layer
- Bcryptjs - Password hashing

### Frontend
- React 18 - UI library
- Socket.IO Client - Real-time updates

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Redis server running locally

### Backend Setup

1. Clone the repository and navigate to root:
\`\`\`bash
cd task-manager
npm install
\`\`\`

2. Create `.env` file with your configuration:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskManager
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
PORT=5000
NODE_ENV=development
\`\`\`

3. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to client directory:
\`\`\`bash
cd client
npm install
\`\`\`

2. Start the frontend:
\`\`\`bash
npm start
\`\`\`

The application will be available at http://localhost:3000

### Docker (Production-like local run) 🔧

> Requires Docker Engine and Docker Compose (v2+) installed on your machine.

1. Build the app image:
```bash
docker compose build --progress=plain app
```

2. Start all services (MongoDB, Redis, and the app):
```bash
docker compose up -d
```

3. Check service logs and health:
```bash
docker compose logs -f app
curl http://localhost:3000/healthz
```

Notes:
- The `docker-compose.yml` brings up `mongo` and `redis` services with named volumes for persistence.
- The app service exposes the port defined by `PORT` (defaults to `3000`).
- Set `JWT_SECRET` in your environment or `.env` before running compose if you need to override the default value in the compose file.
- The app uses a combined Next + Express server; the production start uses `node server.js`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/filter` - Filter tasks by criteria

## Real-time Features

Tasks update in real-time across all connected clients using WebSocket:
- Task creation
- Task updates
- Task deletion
- Status changes
- Priority changes

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token validation on all protected routes
- CORS protection
- Helmet middleware for security headers
- Input validation with express-validator
- MongoDB connection with SSL/TLS support

## Database Schema

### Users
\`\`\`
{
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String (hashed),
  createdAt: Date
}
\`\`\`

### Tasks
\`\`\`
{
  userId: ObjectId (reference to User),
  title: String,
  description: String,
  priority: String (low/medium/high),
  status: String (todo/in-progress/completed),
  dueDate: Date,
  category: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Performance Optimization

- Database indexes on userId, status, priority, and dueDate
- Redis caching for frequently accessed data
- Connection pooling with MongoDB
- Compression middleware enabled
- Efficient WebSocket event handling

## Syllabus Coverage

✓ Authentication and authorization in Express.js
✓ JWT implementation
✓ WebSocket integration
✓ Express.js with MongoDB
✓ Git version control
✓ NoSQL database (MongoDB)
✓ Database scaling (indexes)
✓ Client-side and server-side architecture
✓ Web security (password hashing, HTTPS/TLS ready)
✓ Error handling and validation

## Future Enhancements

- Task sharing and collaboration
- Recurring tasks
- Task analytics and statistics
- Mobile app with React Native
- Advanced filtering and search
- Task templates
- Integration with calendar APIs
