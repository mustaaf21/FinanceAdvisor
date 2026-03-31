import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, CreditCard, MessageSquare, LogOut, TrendingUp, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/transactions', icon: CreditCard, label: 'Transactions' },
  { to: '/chat', icon: MessageSquare, label: 'AI Advisor' }
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const SidebarContents = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Finance Advisor</p>
            <p className="text-xs text-gray-500">AI Agent System</p>
          </div>
        </div>
        {/* Close button — only visible inside the mobile drawer */}
        <button
          onClick={closeSidebar}
          className="md:hidden text-gray-500 hover:text-gray-300 transition-colors p-1 -mr-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.fullName?.[0] ?? 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Desktop sidebar (always visible on md+) ── */}
      <aside className="hidden md:flex w-64 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
        <SidebarContents />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeSidebar}
          style={{ background: 'rgba(0,0,0,0.6)' }}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-gray-900 border-r border-gray-800
          transition-transform duration-300 ease-in-out
          md:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContents />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="text-gray-400 hover:text-white transition-colors p-1 -ml-1"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
              <span className="font-semibold text-white text-sm">Finance Advisor</span>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors p-1">
            <LogOut size={18} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-30">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

      </div>
    </div>
  )
}