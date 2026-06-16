import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGames } from '../utils/api'

interface GameCard {
  game_id: string
  round: string
  date: string
  visitor: string
  home: string
  visitor_r: number | null
  home_r: number | null
}

function ScoreCard({ game }: { game: GameCard }) {
  const vWin = (game.visitor_r ?? 0) > (game.home_r ?? 0)
  const hWin = (game.home_r ?? 0) > (game.visitor_r ?? 0)
  const label = game.round.replace('PLB 2026 ', '')
  const date = game.date ? game.date.slice(5).replace('-', '/') : ''

  return (
    <Link
      to={`/games/${game.game_id}`}
      className="shrink-0 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-colors min-w-[200px]"
    >
      <div className="text-xs text-gray-500 mb-1.5">{label} · {date}</div>
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className={`text-sm truncate ${vWin ? 'text-white font-semibold' : 'text-gray-400'}`}>
            {game.visitor}
          </div>
          <div className={`text-sm truncate ${hWin ? 'text-white font-semibold' : 'text-gray-400'}`}>
            {game.home}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-sm font-bold ${vWin ? 'text-white' : 'text-gray-400'}`}>
            {game.visitor_r ?? '—'}
          </div>
          <div className={`text-sm font-bold ${hWin ? 'text-white' : 'text-gray-400'}`}>
            {game.home_r ?? '—'}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-1">FINAL</div>
    </Link>
  )
}

export default function ScoreboardBanner() {
  const [games, setGames] = useState<GameCard[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGames().then(setGames).catch(() => {})
  }, [])

  if (games.length === 0) return null

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <Link
          to="/games"
          className="shrink-0 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide whitespace-nowrap"
        >
          Scores
        </Link>
        <div className="w-px h-8 bg-gray-700 shrink-0" />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {games.map(g => <ScoreCard key={g.game_id} game={g} />)}
        </div>
      </div>
    </div>
  )
}
