'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.loggedIn) {
        router.push('/dashboard')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to School
            </h1>
            <p className="text-gray-600">
              Please sign in to access your dashboard
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out block"
            >
              Sign In
            </Link>
            
            <Link
              href="/signup"
              className="w-full bg-white hover:bg-gray-50 text-indigo-600 font-medium py-3 px-6 rounded-lg border-2 border-indigo-600 transition duration-150 ease-in-out block"
            >
              Create Account
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>New to our platform? Create an account to get started!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
