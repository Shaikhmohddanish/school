import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/AuthService'
import { UserModel } from '@/models/User'
import { UpdateUserInput } from '@/types/user'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name }: { userId: string; name: string } = body

    // Validate required fields
    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      )
    }

    // Get existing user to preserve email
    const existingUser = await UserModel.findById(userId)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user profile (only name, keep existing email)
    const updateData: UpdateUserInput = { 
      name: name.trim(), 
      email: existingUser.email // Keep existing email unchanged
    }
    const updateResult = await UserModel.updateById(userId, updateData)

    if (!updateResult) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Get updated user
    const updatedUser = await UserModel.findById(userId)
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to retrieve updated user' },
        { status: 500 }
      )
    }

    const userResponse = UserModel.toResponse({
      ...updatedUser,
      _id: userId
    })

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: userResponse,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}