import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/AuthService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Use the AuthService to get user by ID
    const result = await AuthService.getUserById(id)

    if (!result.success) {
      const statusCode = result.error === 'User not found' ? 404 : 500
      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        message: 'User retrieved successfully',
        user: result.data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}