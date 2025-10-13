'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/app/header/page";
import { UserResponse, UserRole } from '@/types/user'

interface User {
  name?: string
  email: string
  role: UserRole
  loggedIn: boolean
  _id?: string
}

interface EditingUser {
  _id: string
  name: string
  role: UserRole
}

export default function AdminDashboard() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [users, setUsers] = useState<UserResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [editingUser, setEditingUser] = useState<EditingUser | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in and is admin
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsedUser = JSON.parse(userData)
            if (parsedUser.loggedIn && parsedUser.role === 'admin') {
                setCurrentUser(parsedUser)
                fetchUsers()
            } else {
                router.push('/dashboard') // Redirect non-admin users
            }
        } else {
            router.push('/login')
        }
    }, [router])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/users')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch users')
            }

            setUsers(data.users)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load users'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/login')
    }

    const handleEditUser = (user: UserResponse) => {
        setEditingUser({
            _id: user._id,
            name: user.name,
            role: user.role
        })
        setMessage({ type: '', text: '' })
    }

    const handleUpdateUser = async () => {
        if (!editingUser) return

        try {
            setLoading(true)
            const response = await fetch('/api/admin/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: editingUser._id,
                    name: editingUser.name,
                    role: editingUser.role,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user')
            }

            setMessage({ type: 'success', text: 'User updated successfully!' })
            setEditingUser(null)
            fetchUsers() // Refresh the user list
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update user'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingUser(null)
        setMessage({ type: '', text: '' })
    }

    const getRoleBadgeColor = (role: UserRole | undefined) => {
        return role === 'admin' 
            ? 'bg-purple-100 text-purple-800 border border-purple-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <>
            <Header user={currentUser} handleLogout={handleLogout} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage users and their roles</p>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
                            <p className="text-sm text-gray-600">Manage user information and roles</p>
                        </div>

                        {loading && !editingUser ? (
                            <div className="p-8 text-center">
                                <div className="text-lg text-gray-600">Loading users...</div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-lg text-gray-600">No users found</div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role || 'user')}`}>
                                                        {(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Edit User Modal */}
                    {editingUser && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Edit User
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="edit-name"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter user name"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <select
                                                id="edit-role"
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateUser}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Updating...' : 'Update User'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}