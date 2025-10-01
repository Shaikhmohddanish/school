import { getCollection } from '@/lib/mongodb';
import { User, CreateUserInput, UpdateUserInput, UserResponse } from '@/types/user';
import { ObjectId } from 'mongodb';

/**
 * User model class for database operations
 */
export class UserModel {
  private static readonly COLLECTION_NAME = 'users';

  /**
   * Get the users collection
   */
  private static async getCollection() {
    return await getCollection(this.COLLECTION_NAME);
  }

  /**
   * Create a new user
   */
  static async create(userData: CreateUserInput) {
    const collection = await this.getCollection();
    const currentTime = new Date();
    
    const newUser = {
      ...userData,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    return await collection.insertOne(newUser);
  }

  /**
   * Find a user by email
   */
  static async findByEmail(email: string) {
    const collection = await this.getCollection();
    return await collection.findOne({ email }) as User | null;
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) }) as User | null;
  }

  /**
   * Find all users (with optional query and options)
   */
  static async findAll(query: any = {}, options: any = {}) {
    const collection = await this.getCollection();
    return await collection.find(query, options).toArray() as unknown as User[];
  }

  /**
   * Update a user
   */
  static async updateById(id: string, updateData: UpdateUserInput) {
    const collection = await this.getCollection();
    
    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Delete a user by ID
   */
  static async deleteById(id: string) {
    const collection = await this.getCollection();
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  /**
   * Check if a user exists by email
   */
  static async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Convert User to UserResponse (removes sensitive data)
   */
  static toResponse(user: User): UserResponse {
    return {
      _id: user._id || '',
      name: user.name,
      email: user.email,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };
  }

  /**
   * Validate user input
   */
  static validateCreateInput(input: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (!input.email || typeof input.email !== 'string' || !this.isValidEmail(input.email)) {
      errors.push('Valid email is required');
    }

    if (!input.password || typeof input.password !== 'string' || input.password.length < 6) {
      errors.push('Password is required and must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Simple email validation
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}