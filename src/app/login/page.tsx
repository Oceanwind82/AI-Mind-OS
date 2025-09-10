'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  
  async function signIn() {
    // TODO: Wire up Supabase auth
    console.log('Magic link login for:', email)
    setSent(true)
  }

  return (
    <div className="min-h-screen grid place-items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-sm w-full space-y-6 bg-white rounded-3xl p-8 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Mind OS
          </h1>
          <p className="text-gray-600">Sign in to continue learning</p>
        </div>
        
        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">📧</div>
            <div className="space-y-2">
              <p className="font-semibold text-green-600">Magic link sent!</p>
              <p className="text-sm text-gray-600">Check your email and click the link to sign in.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && signIn()}
            />
            <button 
              onClick={signIn} 
              disabled={!email}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send magic link ✨
            </button>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Connect Supabase to enable real authentication
          </p>
        </div>
      </div>
    </div>
  )
}
