'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
  inputClassName?: string
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Enter password',
  label,
  required = false,
  className = '',
  inputClassName = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputClassName}`}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-label="Hide password" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-label="Show password" />
          )}
        </button>
      </div>
    </div>
  )
}