import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, AlertTriangle } from 'lucide-react'

export default function Login() {
  const { login, showSessionAlert, forceLogoutOtherSession, cancelLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forceLogout, setForceLogout] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(form.email, form.password)
      if (result) {
        navigate('/')
      }
    } catch {
      setError('Invalid email or password!!')
    } finally {
      setLoading(false)
    }
  }

  const handleForceLogin = async () => {
    if (forceLogout) {
      setLoading(true)
      try {
        await forceLogoutOtherSession()
        navigate('/')
      } catch (err) {
        setError('Failed to logout other session')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Finance Advisor</h1>
          <p className="text-gray-400 mt-1 text-sm">AI-powered spending intelligence</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          AI Agent System · Built with .NET 8 + React
        </p>

        {/* Session Alert Modal */}
        {showSessionAlert && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Active Session Detected</h3>
                  <p className="text-sm text-gray-400">
                    Another session is currently active for this account. You can force logout the other session to continue.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceLogout}
                    onChange={(e) => setForceLogout(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    Log out the other session and sign in here
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    cancelLogin()
                    setForceLogout(false)
                  }}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleForceLogin}
                  disabled={!forceLogout || loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
