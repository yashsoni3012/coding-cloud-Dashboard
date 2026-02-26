import { Bell, Search, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const pageTitles = {
  '/':            'Dashboard',
  '/course':      'Courses',
  '/modules':     'Modules',
  '/topics':      'Topics',
  '/contact':     'Contact',
  '/users':       'Users',
  '/analytics':   'Analytics',
  '/orders':      'Orders',
  '/settings':    'Settings',
  '/category':    'Categories',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const title = pageTitles[pathname] ?? 'Admin'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const notifications = [
    { id: 1, text: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, text: 'Order #1234 completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'System update available', time: '2 hours ago', unread: false },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-200/80 shrink-0 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[15px] sm:text-base font-bold text-slate-800 leading-tight">
              {title}
            </h1>
            {!isMobile && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile search toggle */}
          {isMobile ? (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>
          ) : (
            <div className="relative">
              
            </div>
          )}

       
          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 hidden sm:block" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm shadow-sky-500/20">
                AK
              </div>
              {!isMobile && (
                <div className="hidden lg:block text-left">
                  <p className="text-[13px] font-semibold text-slate-700 leading-tight">Admin Kumar</p>
                  <p className="text-[11px] text-slate-400">admin@example.com</p>
                </div>
              )}
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-slate-100">
                    <p className="text-[13px] font-semibold text-slate-800">Admin Kumar</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">admin@example.com</p>
                  </div>
                  <div className="py-1">
                    {['Profile', 'Settings', 'Help'].map((item) => (
                      <button
                        key={item}
                        className="w-full px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 text-left transition-colors font-medium"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      className="w-full px-4 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 hover:text-rose-600 text-left transition-colors font-medium"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {isMobile && showSearch && (
        <div className="fixed inset-x-0 top-0 z-40 bg-white border-b border-slate-200 p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
                autoFocus
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}