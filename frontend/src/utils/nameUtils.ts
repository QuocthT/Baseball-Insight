const DIACRITIC_MAP: Record<string, string> = {
  'ą': 'a', 'Ą': 'A',
  'ę': 'e', 'Ę': 'E',
  'ó': 'o', 'Ó': 'O',
  'ź': 'z', 'Ź': 'Z',
  'ż': 'z', 'Ż': 'Z',
  'ś': 's', 'Ś': 'S',
  'ć': 'c', 'Ć': 'C',
  'ń': 'n', 'Ń': 'N',
  'ł': 'l', 'Ł': 'L',
}

export function transliterate(s: string): string {
  return s.split('').map(ch => DIACRITIC_MAP[ch] ?? ch).join('')
}

// Data names are stored as "Lastname, Firstname".
// Produces "Lastname_Firstname" after diacritic transliteration.
// Falls back to splitting on the last space if no comma is present.
export function normalizeName(name: string): string {
  const trimmed = name.trim()
  let last: string
  let first: string

  if (trimmed.includes(',')) {
    const commaIdx = trimmed.indexOf(',')
    last = trimmed.slice(0, commaIdx).trim()
    first = trimmed.slice(commaIdx + 1).trim()
  } else {
    const spaceIdx = trimmed.lastIndexOf(' ')
    if (spaceIdx === -1) {
      last = trimmed
      first = ''
    } else {
      first = trimmed.slice(0, spaceIdx).trim()
      last = trimmed.slice(spaceIdx + 1).trim()
    }
  }

  const combined = first ? `${last}_${first}` : last
  return transliterate(combined)
}
