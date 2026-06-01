import { useEffect, useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Props {
  name: string
  year: number
}

export default function AIScoutSummary({ name, year }: Props) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setSummary(null)
    fetch(`${BASE_URL}/api/ai/player-summary/${encodeURIComponent(name)}/${year}`)
      .then(res => {
        if (!res.ok) throw new Error('non-200')
        return res.json()
      })
      .then(data => setSummary(data?.summary ?? null))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [name, year])

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
        <div className="h-3 bg-gray-700 rounded w-28 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 border-l-4 border-l-blue-500">
      <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold mb-3">
        AI Scout Report
      </p>
      <p className="text-gray-300 italic leading-relaxed">{summary}</p>
    </div>
  )
}
