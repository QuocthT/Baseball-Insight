import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHitting } from '../utils/api'

export default function Players() {
  const [players, setPlayers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [year, setYear] = useState(2025)
  const [sortBy, setSortBy] = useState('AVG')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchHitting(year)
      .then(setPlayers)
      .finally(() => setLoading(false))
  }, [year])

  const filtered = players
    .filter(p =>
      p.Name?.toLowerCase().includes(search.toLowerCase()) ||
      p.Team?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => parseFloat(p.PA) > 0)
    .sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]))

  const sortOptions = ['AVG', 'OPS', 'HR', 'RBI', 'SB', 'BB%', 'K%', 'PA']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Players</h2>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search player or team..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          {sortOptions.map(o => <option key={o} value={o}>Sort by {o}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 animate-pulse">Loading players...</div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">Team</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">G</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">PA</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">AVG</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">OBP</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">SLG</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">OPS</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">HR</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">RBI</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">SB</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">K%</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-medium">BB%</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.Name}
                    className={`border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors ${
                      i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'
                    }`}>
                    <td className="px-4 py-3">
                      <Link to={`/players/${encodeURIComponent(p.Name)}`}
                        className="text-blue-400 hover:text-blue-300 font-medium">
                        {p.Name}
                      </Link>
                    </td>
                    <td className="text-center px-3 py-3 text-gray-300">{p.Team}</td>
                    <td className="text-center px-3 py-3 text-gray-300">{p.G}</td>
                    <td className="text-center px-3 py-3 text-gray-300">{p.PA}</td>
                    <td className="text-center px-3 py-3 text-white font-medium">
                      {p.AVG ? parseFloat(p.AVG).toFixed(3) : '—'}
                    </td>
                    <td className="text-center px-3 py-3 text-gray-300">
                      {p.OBP ? parseFloat(p.OBP).toFixed(3) : '—'}
                    </td>
                    <td className="text-center px-3 py-3 text-gray-300">
                      {p.SLG ? parseFloat(p.SLG).toFixed(3) : '—'}
                    </td>
                    <td className="text-center px-3 py-3 text-blue-400 font-medium">
                      {p.OPS ? parseFloat(p.OPS).toFixed(3) : '—'}
                    </td>
                    <td className="text-center px-3 py-3 text-yellow-400">{p.HR ?? '—'}</td>
                    <td className="text-center px-3 py-3 text-gray-300">{p.RBI ?? '—'}</td>
                    <td className="text-center px-3 py-3 text-purple-400">{p.SB ?? '—'}</td>
                    <td className="text-center px-3 py-3 text-red-400">
                      {p['K%'] ? (parseFloat(p['K%']) * 100).toFixed(1) + '%' : '—'}
                    </td>
                    <td className="text-center px-3 py-3 text-green-400">
                      {p['BB%'] ? (parseFloat(p['BB%']) * 100).toFixed(1) + '%' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-700 text-gray-400 text-sm">
            {filtered.length} players
          </div>
        </div>
      )}
    </div>
  )
}