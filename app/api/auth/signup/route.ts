import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/AuthService'
import { CreateUserInput } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // const {name,email,password} = body
    const userData: CreateUserInput = body

    // Use the AuthService to handle registration
    const result = await AuthService.register(userData)

    if (!result.success) {
      const statusCode = result.error === 'User with this email already exists' ? 409 : 400
      return NextResponse.json(
        { 
          error: result.error,
          ...(result.details && { details: result.details })
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: result.data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}