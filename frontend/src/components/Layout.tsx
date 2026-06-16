import { Outlet, NavLink } from 'react-router-dom'
import ScoreboardBanner from './ScoreboardBanner'

export default function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚾</span>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Baseball Insight</h1>
              <p className="text-xs text-gray-400">PLB Stats</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={navClass}>Dashboard</NavLink>
            <NavLink to="/players" className={navClass}>Players</NavLink>
            <NavLink to="/teams" className={navClass}>Teams</NavLink>
            <NavLink to="/games" className={navClass}>Scores</NavLink>
          </nav>
        </div>
      </header>
      <ScoreboardBanner />

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6 text-center text-gray-500 text-sm">
        Baseball Insight · PLB / Ekstraliga · Built with ❤️ for Polish Baseball
      </footer>
    </div>
  )
}