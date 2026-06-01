import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHitting, fetchPitching } from '../utils/api'

export default function Dashboard() {
  const [hitting, setHitting] = useState<any[]>([])
  const [pitching, setPitching] = useState<any[]>([])
  const [year, setYear] = useState(2025)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchHitting(year), fetchPitching(year)])
      .then(([h, p]) => {
        setHitting(h)
        setPitching(p)
      })
      .finally(() => setLoading(false))
  }, [year])

  // Top hitters by AVG (min 10 PA)
  const topHitters = [...hitting]
    .filter(p => parseFloat(p.PA) >= 10)
    .sort((a, b) => parseFloat(b.AVG) - parseFloat(a.AVG))
    .slice(0, 10)

  // Top pitchers by ERA (min 5 IP)
  const topPitchers = [...pitching]
    .filter(p => parseFloat(p.IP) >= 5)
    .sort((a, b) => parseFloat(a.ERA9) - parseFloat(b.ERA9))
    .slice(0, 10)

  // Top HR hitters
  const topHR = [...hitting]
    .sort((a, b) => parseFloat(b.HR) - parseFloat(a.HR))
    .slice(0, 5)

  // Top SB
  const topSB = [...hitting]
    .sort((a, b) => parseFloat(b.SB) - parseFloat(a.SB))
    .slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">League Dashboard</h2>
          <p className="text-gray-400 mt-1">Polish Baseball League — Ekstraliga</p>
        </div>
        <div className="flex gap-2">
          {[2025, 2026].map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                year === y ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 text-lg animate-pulse">Loading stats...</div>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Players</p>
              <p className="text-3xl font-bold text-white mt-1">{hitting.length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pitchers</p>
              <p className="text-3xl font-bold text-white mt-1">{pitching.length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total HRs</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">
                {hitting.reduce((sum, p) => sum + (parseFloat(p.HR) || 0), 0)}
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total SBs</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {hitting.reduce((sum, p) => sum + (parseFloat(p.SB) || 0), 0)}
              </p>
            </div>
          </div>

          {/* Top hitters and pitchers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Batting average leaders */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🏆 Batting Average Leaders</h3>
              <div className="space-y-2">
                {topHitters.map((p, i) => (
                  <Link
                    key={p.Name}
                    to={`/players/${encodeURIComponent(p.Name)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{p.Name}</p>
                        <p className="text-gray-400 text-xs">{p.Team} · {p.PA} PA</p>
                      </div>
                    </div>
                    <span className="text-blue-400 font-bold">
                      {parseFloat(p.AVG).toFixed(3)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ERA leaders */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎯 ERA Leaders</h3>
              <div className="space-y-2">
                {topPitchers.map((p, i) => (
                  <Link
                    key={p.Name}
                    to={`/players/${encodeURIComponent(p.Name)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{p.Name}</p>
                        <p className="text-gray-400 text-xs">{p.Team} · {p.IP} IP</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-bold">
                      {parseFloat(p.ERA9).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* HR and SB leaders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">💣 Home Run Leaders</h3>
              <div className="space-y-2">
                {topHR.map((p, i) => (
                  <Link
                    key={p.Name}
                    to={`/players/${encodeURIComponent(p.Name)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                      <p className="text-white font-medium text-sm">{p.Name}</p>
                      <span className="text-gray-400 text-xs">{p.Team}</span>
                    </div>
                    <span className="text-yellow-400 font-bold">{p.HR}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">💨 Stolen Base Leaders</h3>
              <div className="space-y-2">
                {topSB.map((p, i) => (
                  <Link
                    key={p.Name}
                    to={`/players/${encodeURIComponent(p.Name)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                      <p className="text-white font-medium text-sm">{p.Name}</p>
                      <span className="text-gray-400 text-xs">{p.Team}</span>
                    </div>
                    <span className="text-purple-400 font-bold">{p.SB}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}