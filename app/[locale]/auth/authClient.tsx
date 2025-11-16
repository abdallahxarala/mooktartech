'use client'

import React from 'react'
import LoginForm from '@/components/auth/login-form'
import RegisterForm from '@/components/auth/register-form'

export default function AuthClient() {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
