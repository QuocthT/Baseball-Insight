const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchHitting(year: number = 2026) {
  const res = await fetch(`${BASE_URL}/api/sheets/hitting/${year}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchPitching(year: number = 2026) {
  const res = await fetch(`${BASE_URL}/api/sheets/pitching/${year}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchFielding(year: number = 2026) {
  const res = await fetch(`${BASE_URL}/api/sheets/fielding/${year}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchTeams() {
  const res = await fetch(`${BASE_URL}/api/teams/`)
  const data = await res.json()
  return data.teams || {}
}

export async function fetchTeamRoster(code: string, year: number = 2026) {
  const res = await fetch(`${BASE_URL}/api/teams/${code}?year=${year}`)
  const data = await res.json()
  return data
}

export async function fetchPlayer(name: string, year: number = 2026) {
  const res = await fetch(`${BASE_URL}/api/players/${encodeURIComponent(name)}?year=${year}`)
  const data = await res.json()
  return data
}

export async function fetchGames() {
  const res = await fetch(`${BASE_URL}/api/games/`)
  const data = await res.json()
  return (data.games || []) as any[]
}

export async function fetchGame(gameId: string) {
  const res = await fetch(`${BASE_URL}/api/games/${encodeURIComponent(gameId)}`)
  if (!res.ok) return null
  return res.json()
}