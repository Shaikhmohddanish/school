import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'

export async function GET(request: NextRequest) {
    try {
        // For now, we'll add proper admin authentication later
        // In a production app, you'd verify the user is an admin here
        
        // Get all users for admin dashboard
        const users = await UserModel.getAllUsersForAdmin()
        
        return NextResponse.json({
            users,
            total: users.length
        })

    } catch (error) {
        console.error('Admin get users error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}