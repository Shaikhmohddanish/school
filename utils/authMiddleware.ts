import { UserModel } from '@/models/User'
import { NextRequest } from 'next/server'

/**
 * Utility functions for role-based access control
 */
export class AuthMiddleware {
  /**
   * Extract user ID from request headers or body
   */
  static extractUserId(request: NextRequest, body?: any): string | null {
    // Try to get from custom header first
    const userIdFromHeader = request.headers.get('x-user-id')
    if (userIdFromHeader) {
      return userIdFromHeader
    }

    // Try to get from request body
    if (body && body.userId) {
      return body.userId
    }

    // For now, return null - in production you'd extract from JWT token
    return null
  }

  /**
   * Verify if a user is an admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    if (!userId) return false

    try {
      const user = await UserModel.findById(userId)
      return user?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  /**
   * Verify admin access for API routes
   */
  static async verifyAdminAccess(request: NextRequest, body?: any): Promise<{
    isValid: boolean
    userId?: string
    error?: string
  }> {
    const userId = this.extractUserId(request, body)
    
    if (!userId) {
      return {
        isValid: false,
        error: 'User authentication required'
      }
    }

    const isAdminUser = await this.isAdmin(userId)
    if (!isAdminUser) {
      return {
        isValid: false,
        userId,
        error: 'Admin access required'
      }
    }

    return {
      isValid: true,
      userId
    }
  }
}