'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/app/header/page";
import PasswordInput from '@/app/components/ui/PasswordInput';

interface User {
  name?: string
  email: string
  loggedIn: boolean
  _id?: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function PasswordPage() {
    const [user, setUser] = useState<User | null>(null)
    const [passwordData, setPasswordData] = useState<PasswordFormData>({ 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsedUser = JSON.parse(userData)
            if (parsedUser.loggedIn) {
                setUser(parsedUser)
            } else {
                router.push('/login')
            }
        } else {
            router.push('/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/login')
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' })
            setLoading(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long!' })
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?._id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password')
            }

            setMessage({ type: 'success', text: 'Password updated successfully!' })
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update password. Please try again.'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <>
            <Header user={user} handleLogout={handleLogout} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
                        <p className="mt-2 text-gray-600">Update your account password for better security</p>
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

                    {/* Password Update Card */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
                            <p className="text-sm text-gray-600">Choose a strong password to keep your account secure</p>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6">
                            <div className="space-y-6">
                                <PasswordInput
                                    id="currentPassword"
                                    label="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(value) => setPasswordData({ ...passwordData, currentPassword: value })}
                                    placeholder="Enter current password"
                                    required
                                />
                                <PasswordInput
                                    id="newPassword"
                                    label="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(value) => setPasswordData({ ...passwordData, newPassword: value })}
                                    placeholder="Enter new password"
                                    required
                                />
                                <PasswordInput
                                    id="confirmPassword"
                                    label="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(value) => setPasswordData({ ...passwordData, confirmPassword: value })}
                                    placeholder="Confirm new password"
                                    required
                                />
                                
                                {/* Password Requirements */}
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• At least 8 characters long</li>
                                        <li>• At least one uppercase letter</li>
                                        <li>• At least one lowercase letter</li>
                                        <li>• At least one number</li>
                                        <li>• At least one special character</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Updating Password...' : 'Update Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/settings/profile')}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Back to Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
