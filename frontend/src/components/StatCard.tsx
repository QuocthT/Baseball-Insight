interface StatCardProps {
  label: string
  value: string | number | null
  subtitle?: string
  highlight?: boolean
}

export default function StatCard({ label, value, subtitle, highlight }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 border ${
      highlight
        ? 'bg-blue-900/30 border-blue-700'
        : 'bg-gray-800 border-gray-700'
    }`}>
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-blue-300' : 'text-white'}`}>
        {value ?? '—'}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}