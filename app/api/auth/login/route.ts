import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/AuthService'
import { LoginUserInput } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const credentials: LoginUserInput = body

    // Use the AuthService to handle login
    const result = await AuthService.login(credentials)

    if (!result.success) {
      const statusCode = result.error === 'Invalid email or password' ? 401 : 400
      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: result.data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}