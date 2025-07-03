import { CHROMATIC_NOTES, NOTE_TO_FREQUENCY } from "./constants"

export const getAvailableNotesWithOctaves = (tuning: string[], scaleIntervals: number[], rootNote: string): string[] => {
  const allNotes: string[] = []
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)
  tuning.forEach((stringNoteWithOctave) => {
    const stringNote = stringNoteWithOctave.slice(0, -1)
    for (let fret = 0; fret <= 12; fret++) {
      const noteAtFret = calculateNoteAtFret(stringNote, fret)
      const fullNoteAtFret = calculateFullNoteAtFret(stringNoteWithOctave, fret)
      const noteIndex = CHROMATIC_NOTES.indexOf(noteAtFret)
      const distance = (noteIndex - rootIndex + 12) % 12
      if (scaleIntervals.includes(distance)) {
        allNotes.push(fullNoteAtFret)
      }
    }
  })
  const uniqueNotes = [...new Set(allNotes)]
  return uniqueNotes.sort((a, b) => {
    const freqA = NOTE_TO_FREQUENCY[a] || 0
    const freqB = NOTE_TO_FREQUENCY[b] || 0
    return freqA - freqB
  })
}

export const generatePracticeSequence = (
  startNoteWithOctave: string,
  endNoteWithOctave: string,
  availableNotes: string[],
  pattern: string,
): string[] => {
  const startIndex = availableNotes.indexOf(startNoteWithOctave)
  const endIndex = availableNotes.indexOf(endNoteWithOctave)
  if (startIndex === -1 || endIndex === -1) return []
  const minIndex = Math.min(startIndex, endIndex)
  const maxIndex = Math.max(startIndex, endIndex)
  const rangeNotes = availableNotes.slice(minIndex, maxIndex + 1)
  switch (pattern) {
    case "ascending":
      return rangeNotes
    case "descending":
      return [...rangeNotes].reverse()
    case "upDown":
      return [...rangeNotes, ...rangeNotes.slice(1, -1).reverse()]
    case "downUp":
      return [...rangeNotes.reverse(), ...rangeNotes.slice(1, -1)]
    default:
      return rangeNotes
  }
}

export const calculateNoteAtFret = (baseNote: string, fret: number): string => {
  const baseIndex = CHROMATIC_NOTES.indexOf(baseNote)
  const newIndex = (baseIndex + fret) % 12
  return CHROMATIC_NOTES[newIndex]
}

export const calculateFullNoteAtFret = (baseNoteWithOctave: string, fret: number): string => {
  const baseNote = baseNoteWithOctave.slice(0, -1)
  const baseOctave = Number.parseInt(baseNoteWithOctave.slice(-1))
  const baseIndex = CHROMATIC_NOTES.indexOf(baseNote)
  const totalSemitones = baseIndex + fret
  const newNoteIndex = totalSemitones % 12
  const octaveIncrease = Math.floor(totalSemitones / 12)
  const newNote = CHROMATIC_NOTES[newNoteIndex]
  const newOctave = baseOctave + octaveIncrease
  return `${newNote}${newOctave}`
} 