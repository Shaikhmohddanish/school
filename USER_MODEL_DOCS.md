# User Model Documentation

This project uses a modular approach for user management with proper TypeScript interfaces and MongoDB integration.

## Project Structure

```
├── types/
│   ├── user.ts          # User interfaces and types
│   └── index.ts         # Type exports
├── models/
│   ├── User.ts          # User model with database operations
│   └── index.ts         # Model exports
├── services/
│   ├── AuthService.ts   # Authentication service layer
│   └── index.ts         # Service exports
└── app/api/auth/
    ├── login/route.ts   # Login API endpoint
    └── signup/route.ts  # Signup API endpoint
```

## User Interface

```typescript
interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Available Types

- `User` - Main user interface
- `CreateUserInput` - Input for creating new users
- `UserResponse` - Response format (excludes password)
- `LoginUserInput` - Input for user login
- `UpdateUserInput` - Input for updating users

## User Model Methods

### Static Methods

- `UserModel.create(userData)` - Create a new user
- `UserModel.findByEmail(email)` - Find user by email
- `UserModel.findById(id)` - Find user by ID
- `UserModel.findAll(query, options)` - Find multiple users
- `UserModel.updateById(id, updateData)` - Update user by ID
- `UserModel.deleteById(id)` - Delete user by ID
- `UserModel.existsByEmail(email)` - Check if user exists
- `UserModel.toResponse(user)` - Convert to response format
- `UserModel.validateCreateInput(input)` - Validate user input

## Authentication Service

### Methods

- `AuthService.register(userData)` - Register new user
- `AuthService.login(credentials)` - Authenticate user
- `AuthService.getUserById(id)` - Get user by ID

## Usage Examples

### Creating a User
```typescript
import { AuthService } from '@/services/AuthService';

const result = await AuthService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('User created:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### User Login
```typescript
import { AuthService } from '@/services/AuthService';

const result = await AuthService.login({
  email: 'john@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('Login successful:', result.data);
} else {
  console.error('Login failed:', result.error);
}
```

### Direct Model Usage
```typescript
import { UserModel } from '@/models/User';

// Find user by email
const user = await UserModel.findByEmail('john@example.com');

// Create user directly
const result = await UserModel.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'password123'
});

// Convert to response format
const userResponse = UserModel.toResponse(user);
```

## API Endpoints

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Security Notes

⚠️ **Important**: This implementation currently stores passwords in plain text. For production use, implement proper password hashing using libraries like bcrypt.

## Future Enhancements

1. Password hashing and salting
2. JWT token generation and validation
3. Email verification
4. Password reset functionality
5. Role-based access control
6. Rate limiting
7. Input sanitization