# Role-Based User Management System

This application now includes a comprehensive role-based user management system with the following features:

## User Roles

- **User** (default): Standard user with basic access
- **Admin**: Administrative user with management capabilities

## Features

### 1. Default User Role
- All new user registrations automatically receive the 'user' role
- Users can access their dashboard, profile settings, and password management

### 2. Admin Dashboard
- Accessible only to users with 'admin' role
- View all registered users
- Update user names and roles
- Manage user permissions

### 3. Role-Based Navigation
- Admin users see "Admin Dashboard" option in the user menu
- Regular users only see standard profile options

## Getting Started

### Initial Admin Setup

1. Create an admin user directly in the database by setting the `role` field to 'admin'
2. Login with admin credentials

### Admin Functions

1. **Access Admin Dashboard**:
   - Login as admin user
   - Click user menu → "Admin Dashboard"

2. **View All Users**:
   - Admin dashboard displays all registered users
   - Shows name, email, role, and creation date

3. **Edit Users**:
   - Click "Edit" button next to any user
   - Update user name
   - Change user role (user ↔ admin)
   - Save changes

### User Registration Flow

1. Users sign up with name, email, and password
2. System automatically assigns 'user' role
3. Users can login and access their dashboard
4. Only admin users can change roles

## API Endpoints

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/update` - Update user name/role (admin only)

### User Endpoints
- `POST /api/auth/signup` - Register new user (default role: 'user')
- `POST /api/auth/login` - User login
- `PUT /api/user/profile` - Update user profile (name only)
- `PUT /api/user/password` - Change password

## Security Features

- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected admin routes
- Separate concerns (profile vs password management)

## File Structure

```
app/
├── admin/
│   └── dashboard/page.tsx    # Admin dashboard
├── api/
│   ├── admin/
│   │   ├── users/route.ts    # Get all users
│   │   └── users/update/route.ts  # Update users
│   ├── auth/
│   │   ├── login/route.ts    # User login
│   │   └── signup/route.ts   # User registration
│   └── user/
│       ├── profile/route.ts  # Profile updates
│       └── password/route.ts # Password changes
├── components/
│   └── UserMenu.tsx          # Navigation with role-based options
├── settings/
│   ├── profile/page.tsx      # Profile management
│   └── password/page.tsx     # Password management
types/
└── user.ts                   # User interfaces with roles
models/
└── User.ts                   # User database model
utils/
├── authMiddleware.ts         # Role verification
└── password.ts              # Password utilities
```

## Usage Examples

### Creating an Admin User
```mongodb
// Connect to your MongoDB and update user role directly:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Updating User Role
```typescript
// Admin dashboard or API
PUT /api/admin/users/update
{
  "userId": "user_id_here",
  "name": "Updated Name",
  "role": "admin"
}
```

## Next Steps

1. **Authentication Enhancement**: Implement JWT tokens for better session management
2. **Permission System**: Add more granular permissions beyond admin/user
3. **Audit Logging**: Track admin actions and user changes
4. **Bulk Operations**: Add bulk user management features
5. **Advanced Filtering**: Search and filter users in admin dashboard

## Development Notes

- Default role assignment happens in `UserModel.create()`
- Role validation occurs in API routes and frontend components
- Admin roles must be set directly in the database
- All passwords are hashed using bcrypt with 12 salt rounds
- Role-based navigation is handled in `UserMenu` component