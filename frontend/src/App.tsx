import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import PlayerDetail from './pages/PlayerDetail'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Games from './pages/Games'
import GameDetail from './pages/GameDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="players" element={<Players />} />
        <Route path="players/:name" element={<PlayerDetail />} />
        <Route path="teams" element={<Teams />} />
        <Route path="teams/:code" element={<TeamDetail />} />
        <Route path="games" element={<Games />} />
        <Route path="games/:gameId" element={<GameDetail />} />
      </Route>
    </Routes>
  )
}

export default App
