/**
 * User roles enum
 */
export type UserRole = 'user' | 'admin';

/**
 * User interface representing the structure of a user in the database
 */
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User creation input interface (without optional fields like _id, createdAt, updatedAt)
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // Optional, defaults to 'user'
}

/**
 * User response interface (excludes sensitive information like password)
 */
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User login input interface
 */
export interface LoginUserInput {
  email: string;
  password: string;
}

/**
 * User update input interface (all fields optional except those being updated)
 */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

/**
 * Base user interface for UI components (flexible for different contexts)
 */
export interface BaseUser {
  name?: string;
  email: string;
  role?: UserRole;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}