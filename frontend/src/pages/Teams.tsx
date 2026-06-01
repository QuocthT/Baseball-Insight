import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTeams, fetchHitting } from '../utils/api'

export default function Teams() {
  const [teams, setTeams] = useState<Record<string, string>>({})
  const [hitting, setHitting] = useState<any[]>([])
  const [year, setYear] = useState(2025)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchTeams(), fetchHitting(year)])
      .then(([t, h]) => { setTeams(t); setHitting(h) })
      .finally(() => setLoading(false))
  }, [year])

  // Build team stats summary
  const teamStats = Object.entries(teams).map(([code, name]) => {
    const roster = hitting.filter(p => p.Team === code)
    const totalHR = roster.reduce((s, p) => s + (parseFloat(p.HR) || 0), 0)
    const totalSB = roster.reduce((s, p) => s + (parseFloat(p.SB) || 0), 0)
    const avgOPS = roster.length > 0
      ? roster.reduce((s, p) => s + (parseFloat(p.OPS) || 0), 0) / roster.length
      : 0
    return { code, name, players: roster.length, totalHR, totalSB, avgOPS }
  }).filter(t => t.players > 0)
    .sort((a, b) => b.avgOPS - a.avgOPS)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Teams</h2>
        <div className="flex gap-2">
          {[2025, 2026].map(y => (
            <button key={y} onClick={() => setYear(y)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                year === y ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 animate-pulse">Loading teams...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamStats.map(t => (
            <Link key={t.code} to={`/teams/${t.code}`}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{t.code}</h3>
                  <p className="text-gray-400 text-sm">{t.name}</p>
                </div>
                <span className="text-2xl">⚾</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-gray-500 text-xs">Players</p>
                  <p className="text-white font-bold">{t.players}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Team HR</p>
                  <p className="text-yellow-400 font-bold">{t.totalHR}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Avg OPS</p>
                  <p className="text-blue-400 font-bold">{t.avgOPS.toFixed(3)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}