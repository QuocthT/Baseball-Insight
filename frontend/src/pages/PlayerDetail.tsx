import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPlayer, fetchHitting } from '../utils/api'
import StatCard from '../components/StatCard'
import PlayerRadar from '../components/PlayerRadar'
import AIScoutSummary from '../components/AIScoutSummary'
import { normalizeName } from '../utils/nameUtils'

export default function PlayerDetail() {
  const { name } = useParams<{ name: string }>()
  const [data, setData] = useState<any>(null)
  const [year, setYear] = useState(2025)
  const [loading, setLoading] = useState(true)
  const [leagueAvg, setLeagueAvg] = useState(0)

  const playerName = decodeURIComponent(name || '')

  useEffect(() => {
    if (!name) return
    setLoading(true)
    fetchPlayer(decodeURIComponent(name), year)
      .then(setData)
      .finally(() => setLoading(false))
  }, [name, year])

  useEffect(() => {
    fetchHitting(year)
      .then((rows: any[]) => {
        const qualified = rows.filter(p => Number(p.PA) > 20 && Number(p.AVG) > 0)
        if (qualified.length === 0) { setLeagueAvg(0); return }
        const avg = qualified.reduce((sum: number, p: any) => sum + Number(p.AVG), 0) / qualified.length
        setLeagueAvg(avg)
      })
      .catch(() => setLeagueAvg(0))
  }, [year])

  const h = data?.hitting
  const p = data?.pitching
  const f = data?.fielding

  return (
    <div>
      {/* Top bar: back link + year switcher */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/players" className="text-gray-400 hover:text-white transition-colors">
          ← Players
        </Link>
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
          <div className="text-gray-400 animate-pulse">Loading player...</div>
        </div>
      ) : !data || data.detail ? (
        <div className="text-center py-16 text-gray-400">Player not found</div>
      ) : (
        <div className="space-y-6">

          {/* Player header: photo + info on left, radar on right */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* Photo + name/team */}
              <div className="flex items-center gap-4 shrink-0">
                <img
                  src={`/players/${normalizeName(playerName)}.jpg`}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.onerror = null
                    img.src = '/players/placeholder.jpg'
                  }}
                  alt={playerName}
                  className="w-24 h-24 rounded-full object-cover bg-gray-700"
                />
                <div>
                  <h2 className="text-3xl font-bold text-white">{playerName}</h2>
                  <p className="text-gray-400 mt-1">
                    {h?.Team || p?.Team} · {year} Season
                  </p>
                  {(h?.Nationality || p?.Nationality) && (
                    <p className="text-gray-500 text-sm mt-0.5">
                      {h?.Nationality || p?.Nationality}
                    </p>
                  )}
                </div>
              </div>

              {/* Radar chart */}
              <div className="flex-1 w-full min-w-0">
                <PlayerRadar stats={h} leagueAvg={leagueAvg} />
              </div>

            </div>
          </div>

          {/* AI scout summary — silently absent if endpoint not ready */}
          <AIScoutSummary name={playerName} year={year} />

          {/* Hitting stats */}
          {h && parseFloat(h.PA) > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🏏 Hitting</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                <StatCard label="AVG" value={parseFloat(h.AVG).toFixed(3)} highlight />
                <StatCard label="OBP" value={parseFloat(h.OBP).toFixed(3)} />
                <StatCard label="SLG" value={parseFloat(h.SLG).toFixed(3)} />
                <StatCard label="OPS" value={parseFloat(h.OPS).toFixed(3)} highlight />
                <StatCard label="HR" value={h.HR} />
                <StatCard label="RBI" value={h.RBI} />
                <StatCard label="SB" value={h.SB} />
                <StatCard label="BB%" value={h['BB%'] != null ? (parseFloat(h['BB%']) * 100).toFixed(1) + '%' : '—'} />
                <StatCard label="K%" value={h['K%'] != null ? (parseFloat(h['K%']) * 100).toFixed(1) + '%' : '—'} />
                <StatCard label="BABIP" value={h.BABIP != null ? parseFloat(h.BABIP).toFixed(3) : '—'} />
                <StatCard label="ISO" value={h.ISO != null ? parseFloat(h.ISO).toFixed(3) : '—'} />
                <StatCard label="JOPS" value={h.JOPS != null ? parseFloat(h.JOPS).toFixed(3) : '—'} />
              </div>
            </div>
          )}

          {/* Pitching stats */}
          {p && parseFloat(p.IP) > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">⚾ Pitching</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatCard label="ERA" value={p.ERA9 != null ? parseFloat(p.ERA9).toFixed(2) : '—'} highlight />
                <StatCard label="IP" value={p.IP} />
                <StatCard label="W-L" value={`${p.W}-${p.L}`} />
                <StatCard label="K" value={p.K} />
                <StatCard label="BB" value={p.BB} />
                <StatCard label="WHIP" value={p.WHIP != null ? parseFloat(p.WHIP).toFixed(2) : '—'} />
                <StatCard label="K/9" value={p['K/9'] != null ? parseFloat(p['K/9']).toFixed(1) : '—'} />
                <StatCard label="BB/9" value={p['BB/9'] != null ? parseFloat(p['BB/9']).toFixed(1) : '—'} />
                <StatCard label="FIP" value={p.FIP != null ? parseFloat(p.FIP).toFixed(2) : '—'} highlight />
                <StatCard label="K%" value={p['K%'] != null ? (parseFloat(p['K%']) * 100).toFixed(1) + '%' : '—'} />
                <StatCard label="BB%" value={p['BB%'] != null ? (parseFloat(p['BB%']) * 100).toFixed(1) + '%' : '—'} />
                <StatCard label="CSW%" value={p['CSW%'] != null ? (parseFloat(p['CSW%']) * 100).toFixed(1) + '%' : '—'} />
              </div>
            </div>
          )}

          {/* Fielding stats */}
          {f && parseFloat(f.G) > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">🧤 Fielding</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatCard label="FP" value={f.FP != null ? parseFloat(f.FP).toFixed(3) : '—'} highlight />
                <StatCard label="PO" value={f.PO} />
                <StatCard label="A" value={f.A} />
                <StatCard label="ERR" value={f.ERR} />
                <StatCard label="DP" value={f.DP} />
                <StatCard label="CS%" value={f['CS%']} />
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
