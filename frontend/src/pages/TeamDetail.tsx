import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchTeamRoster } from '../utils/api'

export default function TeamDetail() {
  const { code } = useParams<{ code: string }>()
  const [data, setData] = useState<any>(null)
  const [year, setYear] = useState(2025)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    fetchTeamRoster(code, year)
      .then(setData)
      .finally(() => setLoading(false))
  }, [code, year])

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/teams" className="text-gray-400 hover:text-white">← Teams</Link>
        <div className="flex gap-2 ml-auto">
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
          <div className="text-gray-400 animate-pulse">Loading roster...</div>
        </div>
      ) : !data || data.detail ? (
        <div className="text-center py-16 text-gray-400">Team not found</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-3xl font-bold text-white">{data.team_name}</h2>
            <p className="text-gray-400">{data.team_code} · {year} Season · {data.roster?.length} players</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="text-left px-4 py-3 text-gray-400">Name</th>
                    <th className="text-center px-3 py-3 text-gray-400">G</th>
                    <th className="text-center px-3 py-3 text-gray-400">AVG</th>
                    <th className="text-center px-3 py-3 text-gray-400">OPS</th>
                    <th className="text-center px-3 py-3 text-gray-400">HR</th>
                    <th className="text-center px-3 py-3 text-gray-400">RBI</th>
                    <th className="text-center px-3 py-3 text-gray-400">SB</th>
                  </tr>
                </thead>
                <tbody>
                  {data.roster?.map((p: any, i: number) => (
                    <tr key={p.Name} className={`border-b border-gray-700/50 hover:bg-gray-700/50 ${i % 2 === 0 ? '' : 'bg-gray-800/50'}`}>
                      <td className="px-4 py-3">
                        <Link to={`/players/${encodeURIComponent(p.Name)}`}
                          className="text-blue-400 hover:text-blue-300 font-medium">
                          {p.Name}
                        </Link>
                      </td>
                      <td className="text-center px-3 py-3 text-gray-300">{p.G}</td>
                      <td className="text-center px-3 py-3 text-white">{p.AVG ? parseFloat(p.AVG).toFixed(3) : '—'}</td>
                      <td className="text-center px-3 py-3 text-blue-400">{p.OPS ? parseFloat(p.OPS).toFixed(3) : '—'}</td>
                      <td className="text-center px-3 py-3 text-yellow-400">{p.HR ?? '—'}</td>
                      <td className="text-center px-3 py-3 text-gray-300">{p.RBI ?? '—'}</td>
                      <td className="text-center px-3 py-3 text-purple-400">{p.SB ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}