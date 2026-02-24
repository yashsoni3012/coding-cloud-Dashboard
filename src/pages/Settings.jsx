import { useState } from 'react'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? 'bg-brand-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const [notifs, setNotifs]     = useState(true)
  const [twoFA, setTwoFA]       = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [emails, setEmails]     = useState(true)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">Profile</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">First Name</label>
              <input className="input w-full" defaultValue="Admin" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Last Name</label>
              <input className="input w-full" defaultValue="Kumar" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
            <input className="input w-full" type="email" defaultValue="admin@example.com" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-2">Preferences</h3>
        <SettingRow label="Notifications" description="Receive in-app notifications">
          <Toggle checked={notifs} onChange={setNotifs} />
        </SettingRow>
        <SettingRow label="Email Alerts" description="Get email updates for orders">
          <Toggle checked={emails} onChange={setEmails} />
        </SettingRow>
        <SettingRow label="Dark Mode" description="Use dark theme across the panel">
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </SettingRow>
      </div>

      {/* Security */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-2">Security</h3>
        <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </SettingRow>
        <SettingRow label="Password" description="Last changed 3 months ago">
          <button className="btn-secondary text-xs">Change Password</button>
        </SettingRow>
      </div>
    </div>
  )
}