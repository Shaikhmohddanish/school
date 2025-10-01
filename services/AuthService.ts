import { UserModel } from '@/models/User';
import { CreateUserInput, LoginUserInput, UserResponse } from '@/types/user';

/**
 * Authentication service for handling user authentication logic
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: CreateUserInput): Promise<{
    success: boolean;
    data?: UserResponse;
    error?: string;
    details?: string[];
  }> {
    try {
      // Validate input
      const validation = UserModel.validateCreateInput(userData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        };
      }

      // Check if user already exists
      const existingUser = await UserModel.existsByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Create new user
      const result = await UserModel.create(userData);
      
      // Get the created user
      const createdUser = await UserModel.findById(result.insertedId.toString());
      if (!createdUser) {
        throw new Error('Failed to retrieve created user');
      }

      const userResponse = UserModel.toResponse({
        ...createdUser,
        _id: result.insertedId.toString(),
      });

      return {
        success: true,
        data: userResponse,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  /**
   * Authenticate user login
   */
  static async login(credentials: LoginUserInput): Promise<{
    success: boolean;
    data?: UserResponse;
    error?: string;
  }> {
    try {
      const { email, password } = credentials;

      // Validate required fields
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Check password (plain text comparison for now)
      // TODO: Implement proper password hashing
      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      const userResponse = UserModel.toResponse({
        ...user,
        _id: user._id || '',
      });

      return {
        success: true,
        data: userResponse,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<{
    success: boolean;
    data?: UserResponse;
    error?: string;
  }> {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const userResponse = UserModel.toResponse({
        ...user,
        _id: user._id || id,
      });

      return {
        success: true,
        data: userResponse,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }
}