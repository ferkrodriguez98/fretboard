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
  scaleIntervals?: number[],
  rootNote?: string,
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
    case "thirds-ascending":
      return generateThirdsSequence(rangeNotes, scaleIntervals!, rootNote!, true, availableNotes)
    case "thirds-descending":
      return generateThirdsSequence(rangeNotes, scaleIntervals!, rootNote!, false, availableNotes)
    default:
      return rangeNotes
  }
}

// Función auxiliar para generar secuencias de terceras
const generateThirdsSequence = (rangeNotes: string[], scaleIntervals: number[], rootNote: string, ascending: boolean, allAvailableNotes: string[]): string[] => {
  const sequence: string[] = []
  
  // Crear el mapa de la escala con todas las notas ordenadas por grado de escala
  const scaleNotesMap = buildScaleNotesMap(scaleIntervals, rootNote)
  
  // Las notas del rango ya vienen ordenadas por frecuencia desde generatePracticeSequence
  // Solo necesitamos aplicar la dirección (ascendente o descendente)
  const workingNotes = ascending ? rangeNotes : [...rangeNotes].reverse()
  
  for (const currentNote of workingNotes) {
    // Buscar la tercera en TODAS las notas disponibles del instrumento
    const third = findThirdInScale(currentNote, allAvailableNotes, scaleNotesMap)
    if (third) {
      sequence.push(currentNote, third)
    }
  }
  
  return sequence
}

// Función para construir un mapa de nota -> grado de escala
const buildScaleNotesMap = (scaleIntervals: number[], rootNote: string): { [note: string]: number } => {
  const map: { [note: string]: number } = {}
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)
  
  scaleIntervals.forEach((interval, degree) => {
    const noteIndex = (rootIndex + interval) % 12
    const noteName = CHROMATIC_NOTES[noteIndex]
    map[noteName] = degree
  })
  
  return map
}

// Función para encontrar la tercera de una nota en la escala específica
const findThirdInScale = (currentNoteWithOctave: string, availableNotes: string[], scaleNotesMap: { [note: string]: number }): string | null => {
  const currentNoteName = currentNoteWithOctave.slice(0, -1)
  const currentOctave = parseInt(currentNoteWithOctave.slice(-1))
  const currentDegree = scaleNotesMap[currentNoteName]
  
  if (currentDegree === undefined) return null
  
  // Buscar todas las notas disponibles que sean terceras de la nota actual
  const possibleThirds = availableNotes.filter(noteWithOctave => {
    const noteName = noteWithOctave.slice(0, -1)
    const octave = parseInt(noteWithOctave.slice(-1))
    const degree = scaleNotesMap[noteName]
    
    if (degree === undefined) return false
    
    // La tercera está 2 grados más arriba en la escala
    const expectedThirdDegree = (currentDegree + 2) % Object.keys(scaleNotesMap).length
    
    // Verificar si es la tercera correcta y está en un rango de octava apropiado
    return degree === expectedThirdDegree && octave >= currentOctave && octave <= currentOctave + 1
  })
  
  if (possibleThirds.length === 0) return null
  
  // Preferir la tercera más cercana en altura
  possibleThirds.sort((a, b) => {
    const freqA = NOTE_TO_FREQUENCY[a] || 0
    const freqB = NOTE_TO_FREQUENCY[b] || 0
    const currentFreq = NOTE_TO_FREQUENCY[currentNoteWithOctave] || 0
    
    const distA = Math.abs(freqA - currentFreq)
    const distB = Math.abs(freqB - currentFreq)
    return distA - distB
  })
  
  return possibleThirds[0]
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