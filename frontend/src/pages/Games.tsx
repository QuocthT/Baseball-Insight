import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGames } from '../utils/api'

interface Game {
  game_id: string
  round: string
  round_num: number
  date: string
  visitor: string
  home: string
  visitor_r: number | null
  visitor_h: number | null
  visitor_e: number | null
  home_r: number | null
  home_h: number | null
  home_e: number | null
}

function GameRow({ game }: { game: Game }) {
  const vWin = (game.visitor_r ?? 0) > (game.home_r ?? 0)
  const hWin = (game.home_r ?? 0) > (game.visitor_r ?? 0)

  return (
    <Link
      to={`/games/${game.game_id}`}
      className="block bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-colors"
    >
      {/* Line score table */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 items-center">
        {/* Teams */}
        <div className="space-y-1">
          <div className={`font-semibold ${vWin ? 'text-white' : 'text-gray-400'}`}>
            {vWin && <span className="text-yellow-400 mr-1">▶</span>}
            {game.visitor}
          </div>
          <div className={`font-semibold ${hWin ? 'text-white' : 'text-gray-400'}`}>
            {hWin && <span className="text-yellow-400 mr-1">▶</span>}
            {game.home}
          </div>
        </div>
        {/* R */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">R</div>
          <div className={`text-lg font-bold ${vWin ? 'text-white' : 'text-gray-400'}`}>{game.visitor_r ?? '—'}</div>
          <div className={`text-lg font-bold ${hWin ? 'text-white' : 'text-gray-400'}`}>{game.home_r ?? '—'}</div>
        </div>
        {/* H */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">H</div>
          <div className="text-gray-300">{game.visitor_h ?? '—'}</div>
          <div className="text-gray-300">{game.home_h ?? '—'}</div>
        </div>
        {/* E */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">E</div>
          <div className="text-gray-300">{game.visitor_e ?? '—'}</div>
          <div className="text-gray-300">{game.home_e ?? '—'}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500">FINAL</span>
        {game.date && (
          <span className="text-xs text-gray-600">{game.date}</span>
        )}
        <span className="ml-auto text-xs text-blue-400">Box score →</span>
      </div>
    </Link>
  )
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Loading scores...</div>
      </div>
    )
  }

  // Group by round
  const rounds = new Map<number, Game[]>()
  for (const g of games) {
    if (!rounds.has(g.round_num)) rounds.set(g.round_num, [])
    rounds.get(g.round_num)!.push(g)
  }
  const sortedRounds = [...rounds.entries()].sort(([a], [b]) => b - a)

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-white">Scores</h1>
      {sortedRounds.length === 0 ? (
        <p className="text-gray-400">No game data available.</p>
      ) : (
        sortedRounds.map(([roundNum, roundGames]) => (
          <section key={roundNum}>
            <h2 className="text-lg font-bold text-gray-200 mb-4">
              PLB 2026 — Round {roundNum}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roundGames.map(g => <GameRow key={g.game_id} game={g} />)}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
