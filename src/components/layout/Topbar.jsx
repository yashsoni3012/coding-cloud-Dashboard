import { Menu, Bell, Search, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const pageTitles = {
  '/':          'Dashboard',
  '/users':     'Users',
  '/analytics': 'Analytics',
  '/orders':    'Orders',
  '/settings':  'Settings',
}

export default function Topbar({ onMenuClick, sidebarOpen }) {
  const { pathname } = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const title = pageTitles[pathname] ?? 'Admin'

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, text: 'Order #1234 completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'System update available', time: '2 hours ago', unread: false },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 shrink-0 shadow-sm">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Page title with breadcrumb */}
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              {title}
            </h1>
            {!isMobile && (
              <span className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile search toggle */}
          {isMobile ? (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>
          ) : (
            /* Desktop search */
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-9 pr-4 py-2 w-48 lg:w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 text-xs text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-indigo-50/50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                AK
              </div>
              {!isMobile && (
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin Kumar</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              )}
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 lg:hidden">
                    <p className="text-sm font-medium text-gray-900">Admin Kumar</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  {['Profile', 'Settings', 'Help', 'Sign out'].map((item) => (
                    <button
                      key={item}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {isMobile && showSearch && (
        <div className="fixed inset-x-0 top-0 z-40 bg-white border-b border-gray-200 p-4 shadow-lg animate-slideDown">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}