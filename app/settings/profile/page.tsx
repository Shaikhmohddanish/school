'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from "@/app/header/page";

interface User {
  name?: string
  email: string
  loggedIn: boolean
  _id?: string
}

interface ProfileFormData {
  name: string
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [profileData, setProfileData] = useState<ProfileFormData>({ name: '' })
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
                setProfileData({ 
                    name: parsedUser.name || ''
                })
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

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        // Validate name
        if (!profileData.name.trim()) {
            setMessage({ type: 'error', text: 'Name is required' })
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?._id,
                    name: profileData.name.trim(),
                    email: user?.email,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }
            const updatedUser = { 
                ...user, 
                name: profileData.name.trim(),
                loggedIn: true 
            } as User
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="mt-2 text-gray-600">Manage your personal information</p>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md ${
                            message.type === 'success' 
                                ? 'bg-green-50 text-green-800 border border-green-200' 
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                            <p className="text-sm text-gray-600">Update your personal details</p>
                        </div>
                        <form onSubmit={handleProfileSubmit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ name: e.target.value })}
                                        className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user?.email || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                        placeholder="Your email address"
                                        disabled
                                        readOnly
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Email address cannot be changed</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/settings/password')}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
