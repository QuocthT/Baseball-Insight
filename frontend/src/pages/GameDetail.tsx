import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchGame } from '../utils/api'

interface LineScore {
  visitor_r: number | null
  visitor_h: number | null
  visitor_e: number | null
  home_r:    number | null
  home_h:    number | null
  home_e:    number | null
}

interface GameDetail {
  game_id: string
  round: string
  date: string
  visitor: string
  home: string
  line_score: LineScore
  visitor_batting: any[]
  home_batting: any[]
  visitor_pitching: any[]
  home_pitching: any[]
  visitor_fielding: any[]
  home_fielding: any[]
}

function fmt(val: any, decimals = 3): string {
  if (val === null || val === undefined || val === '') return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return String(val)
  return n.toFixed(decimals)
}

function BattingTable({ rows, teamName }: { rows: any[], teamName: string }) {
  const cols = [
    { key: 'Name', label: 'Batter',  align: 'left' },
    { key: 'AB',   label: 'AB',      align: 'center' },
    { key: 'R',    label: 'R',       align: 'center' },
    { key: 'H',    label: 'H',       align: 'center' },
    { key: 'RBI',  label: 'RBI',     align: 'center' },
    { key: 'HR',   label: 'HR',      align: 'center' },
    { key: 'BB',   label: 'BB',      align: 'center' },
    { key: 'SO',   label: 'K',       align: 'center' },
    { key: 'AVG',  label: 'AVG',     align: 'center', decimals: 3 },
    { key: 'OBP',  label: 'OBP',     align: 'center', decimals: 3 },
    { key: 'SLG',  label: 'SLG',     align: 'center', decimals: 3 },
  ]

  return (
    <div>
      <h3 className="text-base font-bold text-gray-300 mb-2">{teamName} Batting</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {cols.map(c => (
                <th
                  key={c.key}
                  className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${c.align === 'left' ? 'text-left' : 'text-center'}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40">
                {cols.map(c => (
                  <td
                    key={c.key}
                    className={`py-2 px-3 ${c.align === 'left' ? 'text-left text-white font-medium' : 'text-center text-gray-300'}`}
                  >
                    {c.key === 'Name'
                      ? (row[c.key] || '').trim()
                      : c.decimals !== undefined
                        ? fmt(row[c.key], c.decimals)
                        : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PitchingTable({ rows, teamName }: { rows: any[], teamName: string }) {
  const cols = [
    { key: 'Name',  label: 'Pitcher', align: 'left' },
    { key: 'IP',    label: 'IP',      align: 'center' },
    { key: 'H',     label: 'H',       align: 'center' },
    { key: 'R',     label: 'R',       align: 'center' },
    { key: 'ER',    label: 'ER',      align: 'center' },
    { key: 'BB',    label: 'BB',      align: 'center' },
    { key: 'K',     label: 'K',       align: 'center' },
    { key: 'ERA9',  label: 'ERA',     align: 'center', decimals: 2 },
    { key: 'WHIP',  label: 'WHIP',    align: 'center', decimals: 2 },
    { key: 'PIT',   label: 'P',       align: 'center' },
  ]

  return (
    <div>
      <h3 className="text-base font-bold text-gray-300 mb-2">{teamName} Pitching</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {cols.map(c => (
                <th
                  key={c.key}
                  className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${c.align === 'left' ? 'text-left' : 'text-center'}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40">
                {cols.map(c => (
                  <td
                    key={c.key}
                    className={`py-2 px-3 ${c.align === 'left' ? 'text-left text-white font-medium' : 'text-center text-gray-300'}`}
                  >
                    {c.key === 'Name'
                      ? (row[c.key] || '').trim()
                      : c.decimals !== undefined
                        ? fmt(row[c.key], c.decimals)
                        : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FieldingTable({ rows, teamName }: { rows: any[], teamName: string }) {
  const cols = [
    { key: 'Name', label: 'Fielder', align: 'left' },
    { key: 'PO',   label: 'PO',     align: 'center' },
    { key: 'A',    label: 'A',      align: 'center' },
    { key: 'ERR',  label: 'E',      align: 'center' },
    { key: 'DP',   label: 'DP',     align: 'center' },
    { key: 'FP',   label: 'FP',     align: 'center', decimals: 3 },
  ]

  return (
    <div>
      <h3 className="text-base font-bold text-gray-300 mb-2">{teamName} Fielding</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {cols.map(c => (
                <th
                  key={c.key}
                  className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${c.align === 'left' ? 'text-left' : 'text-center'}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/40">
                {cols.map(c => (
                  <td
                    key={c.key}
                    className={`py-2 px-3 ${c.align === 'left' ? 'text-left text-white font-medium' : 'text-center text-gray-300'}`}
                  >
                    {c.key === 'Name'
                      ? (row[c.key] || '').trim()
                      : c.decimals !== undefined
                        ? fmt(row[c.key], c.decimals)
                        : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>()
  const [game, setGame] = useState<GameDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) return
    fetchGame(gameId)
      .then(setGame)
      .catch(() => setGame(null))
      .finally(() => setLoading(false))
  }, [gameId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Loading game...</div>
      </div>
    )
  }

  if (!game) {
    return <div className="text-center py-16 text-gray-400">Game not found.</div>
  }

  const { line_score: ls } = game
  const vWin = (ls.visitor_r ?? 0) > (ls.home_r ?? 0)
  const hWin = (ls.home_r ?? 0) > (ls.visitor_r ?? 0)
  const roundLabel = game.round.replace('PLB 2026 ', '')

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/games" className="text-gray-400 hover:text-white transition-colors text-sm">
        ← Scores
      </Link>

      {/* Scoreboard header */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {roundLabel} · {game.date} · FINAL
          </span>
        </div>

        {/* Teams and scores */}
        <div className="flex items-center justify-between gap-4">
          {/* Visitor */}
          <div className="flex-1 text-right">
            <div className={`text-2xl font-bold ${vWin ? 'text-white' : 'text-gray-400'}`}>
              {game.visitor}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">Away</div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 shrink-0">
            <span className={`text-5xl font-black tabular-nums ${vWin ? 'text-white' : 'text-gray-500'}`}>
              {ls.visitor_r ?? '—'}
            </span>
            <span className="text-2xl text-gray-600 font-bold">–</span>
            <span className={`text-5xl font-black tabular-nums ${hWin ? 'text-white' : 'text-gray-500'}`}>
              {ls.home_r ?? '—'}
            </span>
          </div>

          {/* Home */}
          <div className="flex-1 text-left">
            <div className={`text-2xl font-bold ${hWin ? 'text-white' : 'text-gray-400'}`}>
              {game.home}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">Home</div>
          </div>
        </div>

        {/* R / H / E line */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex justify-center">
            <table className="text-sm">
              <thead>
                <tr>
                  <th className="w-40 text-left text-gray-500 font-normal pb-1"></th>
                  <th className="w-12 text-center text-gray-500 font-semibold pb-1">R</th>
                  <th className="w-12 text-center text-gray-500 font-semibold pb-1">H</th>
                  <th className="w-12 text-center text-gray-500 font-semibold pb-1">E</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`text-left pr-6 py-1 font-medium ${vWin ? 'text-white' : 'text-gray-400'}`}>{game.visitor}</td>
                  <td className={`text-center font-bold ${vWin ? 'text-white' : 'text-gray-400'}`}>{ls.visitor_r ?? '—'}</td>
                  <td className="text-center text-gray-400">{ls.visitor_h ?? '—'}</td>
                  <td className="text-center text-gray-400">{ls.visitor_e ?? '—'}</td>
                </tr>
                <tr>
                  <td className={`text-left pr-6 py-1 font-medium ${hWin ? 'text-white' : 'text-gray-400'}`}>{game.home}</td>
                  <td className={`text-center font-bold ${hWin ? 'text-white' : 'text-gray-400'}`}>{ls.home_r ?? '—'}</td>
                  <td className="text-center text-gray-400">{ls.home_h ?? '—'}</td>
                  <td className="text-center text-gray-400">{ls.home_e ?? '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Batting stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-8">
        <BattingTable rows={game.visitor_batting} teamName={game.visitor} />
        <BattingTable rows={game.home_batting} teamName={game.home} />
      </div>

      {/* Pitching stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-8">
        <PitchingTable rows={game.visitor_pitching} teamName={game.visitor} />
        <PitchingTable rows={game.home_pitching} teamName={game.home} />
      </div>

      {/* Fielding stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-8">
        <FieldingTable rows={game.visitor_fielding} teamName={game.visitor} />
        <FieldingTable rows={game.home_fielding} teamName={game.home} />
      </div>
    </div>
  )
}
