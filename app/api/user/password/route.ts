import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'
import { PasswordUtils } from '@/utils/password'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword }: { 
      userId: string; 
      currentPassword: string; 
      newPassword: string 
    } = body

    // Validate required fields
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'User ID, current password, and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await PasswordUtils.comparePassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedNewPassword = await PasswordUtils.hashPassword(newPassword)

    // Update password in database
    const updateResult = await UserModel.updateById(userId, { 
      password: hashedNewPassword 
    })

    if (!updateResult) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Password updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}