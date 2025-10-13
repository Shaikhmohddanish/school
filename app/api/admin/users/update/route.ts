import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'
import { UserRole } from '@/types/user'
import { ObjectId } from 'mongodb'

export async function PUT(request: NextRequest) {
    try {
        const { userId, name, role } = await request.json()

        // Validate required fields
        if (!userId || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, name, and role are required' },
                { status: 400 }
            )
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID format' },
                { status: 400 }
            )
        }

        // Validate role
        const validRoles: UserRole[] = ['user', 'admin']
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be either "user" or "admin"' },
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

        // Check if user exists
        const existingUser = await UserModel.findById(userId)
        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Update user
        const updateData = {
            name: name.trim(),
            role: role,
            updatedAt: new Date()
        }

        const updateResult = await UserModel.updateById(userId, updateData)
        if (!updateResult) {
            return NextResponse.json(
                { error: 'Failed to update user' },
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

        const userResponse = UserModel.toResponse(updatedUser)
        
        return NextResponse.json({
            message: 'User updated successfully',
            user: userResponse
        })

    } catch (error) {
        console.error('Admin update user error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}