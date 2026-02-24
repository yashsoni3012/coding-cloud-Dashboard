const variants = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger:  'bg-red-500/10 text-red-400 border border-red-500/20',
  info:    'bg-brand-500/10 text-brand-400 border border-brand-500/20',
  default: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={`badge ${variants[variant]}`}>
      {children}
    </span>
  )
}