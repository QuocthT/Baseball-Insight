import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface HittingStats {
  PA?: number | string | null
  AB?: number | string | null
  H?: number | string | null
  'CON%'?: number | string | null
  ISO?: number | string | null
  SB?: number | string | null
  'BB%'?: number | string | null
  AVG?: number | string | null
  [key: string]: unknown
}

interface PlayerRadarProps {
  stats: HittingStats | null
  leagueAvg: number
}

function cap(value: number, max = 100): number {
  return Math.min(Math.max(value, 0), max)
}

function n(v: number | string | null | undefined): number {
  return Number(v ?? 0)
}

export default function PlayerRadar({ stats, leagueAvg }: PlayerRadarProps) {
  if (!stats || n(stats.PA) === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm italic">
        No hitting data available
      </div>
    )
  }

  const conPct = n(stats['CON%'])
  const contact = conPct > 0
    ? cap(conPct * 100)
    : cap(n(stats.AB) > 0 ? (n(stats.H) / n(stats.AB)) * 100 : 0)

  const power = cap((n(stats.ISO) / 0.4) * 100)

  const speed = cap((n(stats.SB) / 30) * 100)

  const bbPct = n(stats['BB%'])
  const discipline = cap(bbPct <= 1 ? bbPct * 100 : bbPct)

  const playerAvg = n(stats.AVG)
  const avgVsLeague = leagueAvg > 0 ? cap((playerAvg / leagueAvg) * 100, 150) : 0

  const data = [
    { axis: 'Contact', value: Math.round(contact) },
    { axis: 'Power',   value: Math.round(power) },
    { axis: 'Speed',   value: Math.round(speed) },
    { axis: 'Discipline', value: Math.round(discipline) },
    { axis: 'AVG vs Lg', value: Math.round(avgVsLeague) },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.25}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#f3f4f6' }}
          itemStyle={{ color: '#f59e0b' }}
          formatter={(value) => [value, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
