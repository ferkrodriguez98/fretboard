"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Play, Pause, ChevronDown } from "lucide-react"
import FretboardHeader from "@/components/FretboardHeader"
import FretboardView from "@/components/ui/FretboardView"

// Notas cromáticas
const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// MAPEO DIRECTO NOTA:FRECUENCIA - SIN ERRORES POSIBLES
const NOTE_TO_FREQUENCY: { [key: string]: number } = {
  // Octava 0
  C0: 16.35,
  "C#0": 17.32,
  D0: 18.35,
  "D#0": 19.45,
  E0: 20.6,
  F0: 21.83,
  "F#0": 23.12,
  G0: 24.5,
  "G#0": 25.96,
  A0: 27.5,
  "A#0": 29.14,
  B0: 30.87,
  // Octava 1
  C1: 32.7,
  "C#1": 34.65,
  D1: 36.71,
  "D#1": 38.89,
  E1: 41.2,
  F1: 43.65,
  "F#1": 46.25,
  G1: 49.0,
  "G#1": 51.91,
  A1: 55.0,
  "A#1": 58.27,
  B1: 61.74,
  // Octava 2
  C2: 65.41,
  "C#2": 69.3,
  D2: 73.42,
  "D#2": 77.78,
  E2: 82.41,
  F2: 87.31,
  "F#2": 92.5,
  G2: 98.0,
  "G#2": 103.83,
  A2: 110.0,
  "A#2": 116.54,
  B2: 123.47,
  // Octava 3
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  G3: 196.0,
  "G#3": 207.65,
  A3: 220.0,
  "A#3": 233.08,
  B3: 246.94,
  // Octava 4
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  // Octava 5
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.25,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880.0,
  "A#5": 932.33,
  B5: 987.77,
  // Octava 6
  C6: 1046.5,
  "C#6": 1108.73,
  D6: 1174.66,
  "D#6": 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  "F#6": 1479.98,
  G6: 1567.98,
  "G#6": 1661.22,
  A6: 1760.0,
  "A#6": 1864.66,
  B6: 1975.53,
}

// TEMA ÚNICO
const theme = {
    name: "Oscuro",
    background: "bg-gray-900",
    cardBg: "bg-gray-800/50",
    cardBorder: "border-gray-700",
    selectBg: "bg-gray-800/80",
    selectBorder: "border-gray-600",
    selectText: "text-gray-100",
    selectHover: "hover:bg-gray-700/80",
    selectContentBg: "bg-gray-800",
    selectItemHover: "hover:bg-gray-700",
    fretboardBg: "bg-gray-800/30",
    fretboardBorder: "border-gray-700",
    stringColor: "from-gray-600 via-gray-500 to-gray-600",
    fretColor: "bg-gray-600",
    markerColor: "bg-gray-500",
    stringText: "text-gray-100",
    rootNote: "from-emerald-500 to-teal-600 border-emerald-400/50 shadow-emerald-500/25",
    scaleNote: "from-slate-600 to-slate-700 border-slate-500/50 shadow-slate-500/20",
    otherNote: "bg-gray-700/30 text-gray-500 border-gray-600/50",
    legendText: "text-gray-300",
    legendTextMuted: "text-gray-500",
}

// PATRONES DE PRÁCTICA
const PRACTICE_PATTERNS = {
  ascending: { name: "Grave → Aguda", direction: "up" },
  descending: { name: "Aguda → Grave", direction: "down" },
  upDown: { name: "Subiendo y Bajando", direction: "up-down" },
  downUp: { name: "Bajando y Subiendo", direction: "down-up" },
}

// TODOS LOS INSTRUMENTOS RESTAURADOS
const INSTRUMENT_TUNINGS = {
  "bass-4": {
    name: "Bajo 4 Cuerdas",
    tunings: {
      standard: { name: "Standard (EADG)", notes: ["G2", "D2", "A1", "E1"] },
      "drop-d": { name: "Drop D (DADG)", notes: ["G2", "D2", "A1", "D1"] },
      "drop-c": { name: "Drop C (CGCF)", notes: ["F2", "C2", "G1", "C1"] },
      "d-standard": { name: "D Standard (DGCF)", notes: ["F2", "C2", "G1", "D1"] },
    },
  },
  "bass-5": {
    name: "Bajo 5 Cuerdas",
    tunings: {
      standard: { name: "Standard (BEADG)", notes: ["G2", "D2", "A1", "E1", "B0"] },
      "drop-a": { name: "Drop A (AEADG)", notes: ["G2", "D2", "A1", "E1", "A0"] },
      "drop-g": { name: "Drop G (GDADG)", notes: ["G2", "D2", "A1", "D1", "G0"] },
    },
  },
  "bass-6": {
    name: "Bajo 6 Cuerdas",
    tunings: {
      standard: { name: "Standard (BEADGC)", notes: ["C3", "G2", "D2", "A1", "E1", "B0"] },
      "drop-a": { name: "Drop A (AEADGC)", notes: ["C3", "G2", "D2", "A1", "E1", "A0"] },
    },
  },
  "guitar-6": {
    name: "Guitarra 6 Cuerdas",
    tunings: {
      standard: { name: "Standard (EADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "E2"] },
      "drop-d": { name: "Drop D (DADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "D2"] },
      "drop-c": { name: "Drop C (CGCFAD)", notes: ["D4", "A3", "F3", "C3", "G2", "C2"] },
      dadgad: { name: "DADGAD", notes: ["D4", "A3", "G3", "D3", "A2", "D2"] },
      "open-g": { name: "Open G (DGDGBD)", notes: ["D4", "B3", "G3", "D3", "G2", "D2"] },
      "open-d": { name: "Open D (DADF#AD)", notes: ["D4", "A3", "F#3", "D3", "A2", "D2"] },
    },
  },
  "guitar-7": {
    name: "Guitarra 7 Cuerdas",
    tunings: {
      standard: { name: "Standard (BEADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1"] },
      "drop-a": { name: "Drop A (AEADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "A1"] },
      "drop-g": { name: "Drop G (GDADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "D2", "G1"] },
    },
  },
  "guitar-8": {
    name: "Guitarra 8 Cuerdas",
    tunings: {
      standard: { name: "Standard (F#BEADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "F#1"] },
      "drop-e": { name: "Drop E (EBEADGBE)", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "E1"] },
      "drop-d": { name: "Drop D (F#BEADGBD)", notes: ["D4", "B3", "G3", "D3", "A2", "E2", "B1", "F#1"] },
    },
  },
  ukulele: {
    name: "Ukulele",
    tunings: {
      standard: { name: "Standard (GCEA)", notes: ["A4", "E4", "C4", "G4"] },
      "low-g": { name: "Low G (gCEA)", notes: ["A4", "E4", "C4", "G3"] },
      baritone: { name: "Baritone (DGBE)", notes: ["E4", "B3", "G3", "D3"] },
    },
  },
  mandolin: {
    name: "Mandolina",
    tunings: {
      standard: { name: "Standard (GDAE)", notes: ["E5", "A4", "D4", "G3"] },
    },
  },
  "banjo-5": {
    name: "Banjo 5 Cuerdas",
    tunings: {
      standard: { name: "Standard (gDGBD)", notes: ["D4", "B3", "G3", "D3", "G4"] },
      "double-c": { name: "Double C (gCGCD)", notes: ["D4", "C4", "G3", "C3", "G4"] },
    },
  },
}

// TODAS LAS ESCALAS RESTAURADAS
const SCALES = {
  // Modos griegos
  ionian: { name: "Jónico (Mayor)", intervals: [0, 2, 4, 5, 7, 9, 11] },
  dorian: { name: "Dórico", intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: "Frigio", intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: "Lidio", intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: "Mixolidio", intervals: [0, 2, 4, 5, 7, 9, 10] },
  aeolian: { name: "Eólico (Menor Natural)", intervals: [0, 2, 3, 5, 7, 8, 10] },
  locrian: { name: "Locrio", intervals: [0, 1, 3, 5, 6, 8, 10] },

  // Escalas menores
  "harmonic-minor": { name: "Menor Armónica", intervals: [0, 2, 3, 5, 7, 8, 11] },
  "melodic-minor": { name: "Menor Melódica", intervals: [0, 2, 3, 5, 7, 9, 11] },

  // Pentatónicas
  "pentatonic-major": { name: "Pentatónica Mayor", intervals: [0, 2, 4, 7, 9] },
  "pentatonic-minor": { name: "Pentatónica Menor", intervals: [0, 3, 5, 7, 10] },

  // Blues
  "blues-major": { name: "Blues Mayor", intervals: [0, 2, 3, 4, 7, 9] },
  "blues-minor": { name: "Blues Menor", intervals: [0, 3, 5, 6, 7, 10] },

  // Escalas exóticas
  "hungarian-minor": { name: "Húngara Menor", intervals: [0, 2, 3, 6, 7, 8, 11] },
  arabic: { name: "Árabe", intervals: [0, 1, 4, 5, 7, 8, 11] },
  japanese: { name: "Japonesa", intervals: [0, 1, 5, 7, 8] },
  gypsy: { name: "Gitana", intervals: [0, 1, 4, 5, 7, 8, 10] },

  // Jazz y modernas
  "bebop-dominant": { name: "Bebop Dominante", intervals: [0, 2, 4, 5, 7, 9, 10, 11] },
  "bebop-major": { name: "Bebop Mayor", intervals: [0, 2, 4, 5, 7, 8, 9, 11] },
  "super-locrian": { name: "Súper Locria (Alterada)", intervals: [0, 1, 3, 4, 6, 8, 10] },
  "whole-tone": { name: "Tonos Enteros", intervals: [0, 2, 4, 6, 8, 10] },
  diminished: { name: "Disminuida (Octatónica)", intervals: [0, 2, 3, 5, 6, 8, 9, 11] },

  // Otras escalas populares
  hirajoshi: { name: "Hirajoshi", intervals: [0, 2, 3, 7, 8] },
  "in-sen": { name: "In Sen", intervals: [0, 1, 5, 7, 10] },
  iwato: { name: "Iwato", intervals: [0, 1, 5, 6, 10] },
  kumoi: { name: "Kumoi", intervals: [0, 2, 3, 7, 9] },
  pelog: { name: "Pelog", intervals: [0, 1, 3, 7, 8] },
  prometheus: { name: "Prometeo", intervals: [0, 2, 4, 6, 9, 10] },
  tritone: { name: "Tritono", intervals: [0, 1, 4, 6, 7, 10] },
  "ukrainian-dorian": { name: "Dórico Ucraniano", intervals: [0, 2, 3, 6, 7, 9, 10] },
}

// Función para generar todas las notas disponibles en el diapasón con octavas
const getAvailableNotesWithOctaves = (tuning: string[], scaleIntervals: number[], rootNote: string): string[] => {
  const allNotes: string[] = []
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)

  // Para cada cuerda
  tuning.forEach((stringNoteWithOctave) => {
    const stringNote = stringNoteWithOctave.slice(0, -1)

    // Para cada traste (0-12)
    for (let fret = 0; fret <= 12; fret++) {
      const noteAtFret = calculateNoteAtFret(stringNote, fret)
      const fullNoteAtFret = calculateFullNoteAtFret(stringNoteWithOctave, fret)

      // Verificar si la nota está en la escala
      const noteIndex = CHROMATIC_NOTES.indexOf(noteAtFret)
      const distance = (noteIndex - rootIndex + 12) % 12

      if (scaleIntervals.includes(distance)) {
        allNotes.push(fullNoteAtFret)
      }
    }
  })

  // Eliminar duplicados y ordenar
  const uniqueNotes = [...new Set(allNotes)]
  return uniqueNotes.sort((a, b) => {
    const freqA = NOTE_TO_FREQUENCY[a] || 0
    const freqB = NOTE_TO_FREQUENCY[b] || 0
    return freqA - freqB
  })
}

// Función para generar secuencia de práctica con octavas específicas
const generatePracticeSequence = (
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

// Función para calcular la nota exacta en un traste
const calculateNoteAtFret = (baseNote: string, fret: number): string => {
  const baseIndex = CHROMATIC_NOTES.indexOf(baseNote)
  const newIndex = (baseIndex + fret) % 12
  return CHROMATIC_NOTES[newIndex]
}

// Función para calcular la nota completa con octava en un traste
const calculateFullNoteAtFret = (baseNoteWithOctave: string, fret: number): string => {
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

// Tonalidades disponibles
const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export default function Component() {
  const [selectedRoot, setSelectedRoot] = useState("C")
  const [selectedScale, setSelectedScale] = useState("ionian")
  const [selectedInstrument, setSelectedInstrument] = useState("bass-4")
  const [selectedTuning, setSelectedTuning] = useState("standard")

  const [practiceMode, setPracticeMode] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [inputValue, setInputValue] = useState(bpm.toString())
  const [startNote, setStartNote] = useState("")
  const [endNote, setEndNote] = useState("")
  const [practicePattern, setPracticePattern] = useState("ascending")
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [practiceSequence, setPracticeSequence] = useState<string[]>([])
  const [currentPlayingNote, setCurrentPlayingNote] = useState<string>("")
  const [nextPlayingNote, setNextPlayingNote] = useState<string>("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [realViewportHeight, setRealViewportHeight] = useState(0)

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 800
      setIsMobile(mobile)
      setRealViewportHeight(window.innerHeight)
      // En desktop empezar abierto, en mobile cerrado
      setShowPanel(!mobile)
    }
    
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    window.addEventListener("orientationchange", updateDimensions)
    
    // También detectar cuando aparece/desaparece el teclado virtual
    const handleVisualViewport = () => {
      if (window.visualViewport) {
        setRealViewportHeight(window.visualViewport.height)
      }
    }
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVisualViewport)
    }
    
    return () => {
      window.removeEventListener("resize", updateDimensions)
      window.removeEventListener("orientationchange", updateDimensions)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVisualViewport)
      }
    }
  }, [])

  const currentInstrument = INSTRUMENT_TUNINGS[selectedInstrument as keyof typeof INSTRUMENT_TUNINGS]
  const currentTuningData = currentInstrument.tunings[selectedTuning as keyof typeof currentInstrument.tunings]
  const currentTuning = currentTuningData?.notes || Object.values(currentInstrument.tunings)[0].notes

  // Obtener notas disponibles con octavas
  const availableNotes = useMemo(
    () =>
      getAvailableNotesWithOctaves(
    currentTuning,
    SCALES[selectedScale as keyof typeof SCALES].intervals,
    selectedRoot,
      ),
    [currentTuning, selectedScale, selectedRoot],
  )

  // Filtrar notas según el patrón de práctica
  const getFilteredStartNotes = useMemo(() => {
    if (!availableNotes.length) return []
    
    const direction = PRACTICE_PATTERNS[practicePattern as keyof typeof PRACTICE_PATTERNS].direction
    
    if (direction.startsWith("up")) {
      // Para "grave → aguda": mostrar todas las notas excepto la más aguda
      return availableNotes.slice(0, -1)
    } else {
      // Para "aguda → grave": mostrar todas las notas excepto la más grave
      return availableNotes.slice(1)
    }
  }, [availableNotes, practicePattern])

  const getFilteredEndNotes = useMemo(() => {
    if (!availableNotes.length || !startNote) return []
    
    const startIndex = availableNotes.indexOf(startNote)
    if (startIndex === -1) return []
    
    const direction = PRACTICE_PATTERNS[practicePattern as keyof typeof PRACTICE_PATTERNS].direction
    
    if (direction.startsWith("up")) {
      // Para "grave → aguda": mostrar solo notas más agudas que la inicial
      return availableNotes.slice(startIndex + 1)
    } else {
      // Para "aguda → grave": mostrar solo notas más graves que la inicial
      return availableNotes.slice(0, startIndex)
    }
  }, [availableNotes, startNote, practicePattern])

  // Validar nota final cuando cambia la nota inicial o el patrón
  useEffect(() => {
    if (!startNote || !endNote || !availableNotes.length) return
    
    const filteredEndNotes = getFilteredEndNotes
    const isEndNoteValid = filteredEndNotes.includes(endNote)
    
    if (!isEndNoteValid && filteredEndNotes.length > 0) {
      // Si la nota final actual no es válida, seleccionar la primera válida
      setEndNote(filteredEndNotes[0])
    }
  }, [startNote, practicePattern, getFilteredEndNotes, endNote, availableNotes.length])

  // Establecer valores por defecto cuando cambian los parámetros
  useEffect(() => {
    if (availableNotes.length > 0) {
      const newStartNote = availableNotes[0]
      const startFreq = NOTE_TO_FREQUENCY[newStartNote]
      const targetFreq = startFreq * 2 // One octave higher

      // Find the first note with frequency >= targetFreq
      let newEndNote = availableNotes.find((note) => NOTE_TO_FREQUENCY[note] >= targetFreq)

      // If no such note exists, use the last available note.
      if (!newEndNote || newEndNote === newStartNote) {
        newEndNote = availableNotes[availableNotes.length - 1]
      }

      setStartNote(newStartNote)
      setEndNote(newEndNote)

      // También actualizamos según el patrón de práctica seleccionado
      updatePracticeRange(practicePattern)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableNotes, practicePattern])

  useEffect(() => {
    setInputValue(bpm.toString())
  }, [bpm])

  // Nueva función para actualizar el rango de práctica basado en el patrón
  const updatePracticeRange = (pattern: string) => {
    if (!availableNotes.length) return

    // Encontrar la nota raíz más grave y la más aguda con la misma nota base
    const rootNoteName = selectedRoot
    const rootNotes = availableNotes.filter((note) => note.startsWith(rootNoteName))
    
    if (rootNotes.length < 1) return

    // Ordenar por frecuencia
    rootNotes.sort((a, b) => NOTE_TO_FREQUENCY[a] - NOTE_TO_FREQUENCY[b])
    
    const lowestRoot = rootNotes[0]
    const highestRoot = rootNotes[rootNotes.length - 1]
    
    // Intentar encontrar una octava completa para la nota raíz
    // Ejemplo: Si tenemos C2, buscar C3
    const noteBase = lowestRoot.slice(0, -1) // "C" de "C2"
    const octave = parseInt(lowestRoot.slice(-1)) // 2 de "C2"
    const higherOctaveNote = `${noteBase}${octave + 1}` // "C3"
    
    // Buscar la nota en la octava superior o usar la más alta disponible
    const octaveUp = availableNotes.find(note => note === higherOctaveNote) || highestRoot
    
    // Decidir qué notas usar según el patrón de práctica
    const direction = PRACTICE_PATTERNS[pattern as keyof typeof PRACTICE_PATTERNS].direction
    
    if (direction.startsWith("up")) {
      // De grave a aguda
      setStartNote(lowestRoot)
      setEndNote(octaveUp)
    } else if (direction.startsWith("down")) {
      // De aguda a grave
      setStartNote(octaveUp)
      setEndNote(lowestRoot)
    }
  }

  // Función mejorada para reproducir sonido
  const playNoteSound = useCallback((noteWithOctave: string, durationInSeconds?: number) => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new (window.AudioContext || ((window as any).webkitAudioContext as typeof AudioContext))()
      }
      const audioContext = audioContextRef.current

      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      const frequency = NOTE_TO_FREQUENCY[noteWithOctave]
      if (!frequency) {
        console.log(`Frecuencia no encontrada para: ${noteWithOctave}`)
        return
      }

      // === FIX DE LATENCIA ===
      // Programamos todo para que empiece en un futuro cercano (50ms)
      // para dar tiempo al render de React a actualizar el color de la nota.
      const latency = 0.15 // 50ms
      const startTime = audioContext.currentTime + latency

      const duration = durationInSeconds || 0.5
      const attackTime = 0.1

      // --- SINTETIZADOR DE BAJO MEJORADO ---

      // 1. Oscilador Principal (onda de sierra para armónicos)
      const osc = audioContext.createOscillator()
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(frequency, startTime)

      // 2. Sub-Oscilador (onda triangular una octava abajo para cuerpo)
      const subOsc = audioContext.createOscillator()
      subOsc.type = "sine"
      subOsc.frequency.setValueAtTime(frequency / 2, startTime)

      // 3. Filtro (la clave del "pluck")
      const filter = audioContext.createBiquadFilter()
      filter.type = "lowpass"
      filter.Q.setValueAtTime(1.5, startTime)
      filter.frequency.setValueAtTime(frequency * 2.5, startTime)
      filter.frequency.exponentialRampToValueAtTime(300, startTime + duration * 0.3)

      // 4. Ganancia y Mezcla
      const oscGain = audioContext.createGain()
      oscGain.gain.value = 0.6

      const subGain = audioContext.createGain()
      subGain.gain.value = 0.4

      // 5. Envelope Principal (controla el volumen general)
      const masterGain = audioContext.createGain()
      masterGain.gain.setValueAtTime(0, startTime)
      masterGain.gain.linearRampToValueAtTime(1.2, startTime + attackTime)
      masterGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      // 6. Conexiones (Routing)
      osc.connect(oscGain)
      subOsc.connect(subGain)
      oscGain.connect(filter)
      subGain.connect(filter)
      filter.connect(masterGain)
      masterGain.connect(audioContext.destination)

      // Iniciar y detener todo
      osc.start(startTime)
      subOsc.start(startTime)
      osc.stop(startTime + duration)
      subOsc.stop(startTime + duration)

    } catch (error) {
      console.log("Audio no disponible:", error)
    }
  }, [])

  // Limpiar AudioContext al desmontar
  useEffect(() => {
    const audioCtx = audioContextRef.current
    return () => {
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close()
      }
    }
  }, [])



  // Reset tuning when instrument changes
  const handleInstrumentChange = (instrument: string) => {
    setSelectedInstrument(instrument)
    setSelectedTuning("standard")
  }

  const handleRootChange = (root: string) => {
    // Actualizar nota raíz
    setSelectedRoot(root)
  }

  const handleScaleChange = (scale: string) => {
    // Actualizar escala
    setSelectedScale(scale)
  }

  // Función para obtener el índice de una nota
  const getNoteIndex = (note: string): number => {
    return CHROMATIC_NOTES.indexOf(note)
  }

  // Función para verificar si una nota está en la escala seleccionada
  const isNoteInScale = (note: string): boolean => {
    const rootIndex = getNoteIndex(selectedRoot)
    const noteIndex = getNoteIndex(note)
    const intervals = SCALES[selectedScale as keyof typeof SCALES].intervals

    // Calcular la distancia desde la raíz
    const distance = (noteIndex - rootIndex + 12) % 12

    return intervals.includes(distance)
  }

  // Función para verificar si es la nota raíz
  const isRootNote = (note: string): boolean => {
    return note === selectedRoot
  }



  // Función para alternar modo práctica
  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode)
    setCurrentNoteIndex(0) // Reset index
    if (practiceMode) {
      setCurrentPlayingNote("")
      setNextPlayingNote("")
    }
  }

  // Controlador de cambio de patrón de práctica
  const handlePracticePatternChange = (newPattern: string) => {
    setPracticePattern(newPattern)
    
    // Validar y corregir las notas según el nuevo patrón
    if (!availableNotes.length) return
    
    const direction = PRACTICE_PATTERNS[newPattern as keyof typeof PRACTICE_PATTERNS].direction
    const startIndex = availableNotes.indexOf(startNote)
    const endIndex = availableNotes.indexOf(endNote)
    
    if (startIndex === -1 || endIndex === -1) return
    
    // Verificar si la configuración actual es válida para el nuevo patrón
    const isValidConfig = direction.startsWith("up") 
      ? startIndex < endIndex  // Para "grave → aguda": inicio debe ser menor que final
      : startIndex > endIndex  // Para "aguda → grave": inicio debe ser mayor que final
    
    if (!isValidConfig) {
      // Si no es válida, intercambiar las notas
      setStartNote(endNote)
      setEndNote(startNote)
    }
  }

  // Generar secuencia cuando cambian los parámetros
  useEffect(() => {
    if (startNote && endNote && availableNotes.length > 0) {
      const sequence = generatePracticeSequence(startNote, endNote, availableNotes, practicePattern)
      setPracticeSequence(sequence)
      setCurrentNoteIndex(0)
    }
  }, [startNote, endNote, availableNotes, practicePattern])

  // Manejar reproducción automática de la práctica
  useEffect(() => {
    if (practiceMode && practiceSequence.length > 0) {
      const intervalMs = 60000 / bpm
      const noteDuration = intervalMs / 1000
      intervalRef.current = setInterval(() => {
        setCurrentNoteIndex(prevIndex => {
          const currentNote = practiceSequence[prevIndex]
          const nextIndex = (prevIndex + 1) % practiceSequence.length
          const nextNote = practiceSequence[nextIndex]

          // 1. Actualizar el estado visual PRIMERO
          setCurrentPlayingNote(currentNote)
          setNextPlayingNote(nextNote)

          // 2. Reproducir el sonido DESPUÉS
          if (currentNote) {
            playNoteSound(currentNote, noteDuration)
          }

          // 3. Preparar el índice para el siguiente ciclo
          return nextIndex
        })
      }, intervalMs)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCurrentPlayingNote("")
      setNextPlayingNote("")
    }
  }, [practiceMode, bpm, practiceSequence, playNoteSound])

  return (
    <div 
      className={`${theme.background} overflow-hidden`}
      style={{ height: isMobile ? realViewportHeight : '100vh' }}
    >
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
      `}</style>

      <div className={`h-full flex flex-col gap-4 ${isMobile ? 'pt-12 px-4 pb-4' : 'p-4'}`}>
        {/* Panel superior unificado */}
        {isMobile ? (
          <>
            {/* Chevron para mostrar el panel si está oculto */}
            {!showPanel && (
              <button
                onClick={() => setShowPanel(true)}
                className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
                style={{
                  top: 0,
                  marginTop: 4,
                  width: 40,
                  height: 40,
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                <ChevronDown className="w-6 h-6 text-gray-200" />
              </button>
            )}
            {/* Panel flotante */}
            <div
              className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${
                showPanel ? "translate-y-0" : "-translate-y-full"
              }`}
              style={{
                background: "rgba(31, 41, 55, 0.98)",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                paddingTop: 0,
              }}
            >
              <button
                onClick={() => setShowPanel(false)}
                className="mx-auto flex items-center justify-center"
                style={{ width: 40, height: 40, marginTop: 0, background: "transparent", border: "none", boxShadow: "none", padding: 0 }}
              >
                <ChevronDown className="w-6 h-6 text-gray-200 transition-transform duration-200" style={{ transform: showPanel ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              <div className="p-2">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="p-2">
                    <div className="flex flex-col gap-4">
                      <FretboardHeader
                        selectedInstrument={selectedInstrument}
                        setSelectedInstrument={handleInstrumentChange}
                        instrumentTunings={INSTRUMENT_TUNINGS}
                        selectedTuning={selectedTuning}
                        setSelectedTuning={setSelectedTuning}
                        bpm={bpm}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        setBpm={setBpm}
                        theme={theme}
                      />
                      <div className="flex gap-4 items-center justify-center flex-wrap">
                        <Select value={selectedRoot} onValueChange={handleRootChange}>
              <SelectTrigger
                            className={`w-20 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
                            {ROOT_NOTES.map((note) => (
                  <SelectItem
                                key={note}
                                value={note}
                    className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
                  >
                                {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

                        <Select value={selectedScale} onValueChange={handleScaleChange}>
              <SelectTrigger
                            className={`w-64 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
              >
                <SelectValue />
              </SelectTrigger>
                          <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} max-h-80 custom-scrollbar`}>
                            {Object.entries(SCALES).map(([key, scale]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
                  >
                                {scale.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

                        <Select value={startNote} onValueChange={setStartNote}>
                          <SelectTrigger className={`w-24 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                            <SelectValue placeholder="Inicio" />
                          </SelectTrigger>
                          <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                            {getFilteredStartNotes.map((note) => (
                              <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                                {note}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className={`${theme.legendText} text-sm`}>→</span>

                        <Select value={endNote} onValueChange={setEndNote}>
                          <SelectTrigger className={`w-24 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                            <SelectValue placeholder="Final" />
                          </SelectTrigger>
                          <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                            {getFilteredEndNotes.map((note) => (
                              <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                                {note}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={practicePattern} onValueChange={handlePracticePatternChange}>
                          <SelectTrigger className={`w-48 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                <SelectValue />
              </SelectTrigger>
                          <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                            {Object.entries(PRACTICE_PATTERNS).map(([key, pattern]) => (
                              <SelectItem key={key} value={key} className={`${theme.selectText} ${theme.selectItemHover}`}>
                                {pattern.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

                        <button
                          onClick={togglePracticeMode}
                          className={`p-2 rounded-full transition-colors ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} ${theme.selectHover} border`}
                        >
                          {practiceMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <Card className={`${theme.cardBg} ${theme.cardBorder} flex-shrink-0`}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <FretboardHeader
                  selectedInstrument={selectedInstrument}
                  setSelectedInstrument={handleInstrumentChange}
                  instrumentTunings={INSTRUMENT_TUNINGS}
                  selectedTuning={selectedTuning}
                  setSelectedTuning={setSelectedTuning}
                  bpm={bpm}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  setBpm={setBpm}
                  theme={theme}
                />
                <div className="flex gap-4 items-center justify-center flex-wrap">
                  <Select value={selectedRoot} onValueChange={handleRootChange}>
              <SelectTrigger
                className={`w-20 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
                {ROOT_NOTES.map((note) => (
                  <SelectItem
                    key={note}
                    value={note}
                    className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
                  >
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

                  <Select value={selectedScale} onValueChange={handleScaleChange}>
              <SelectTrigger
                className={`w-64 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} max-h-80 custom-scrollbar`}>
                {Object.entries(SCALES).map(([key, scale]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
                  >
                    {scale.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

              <Select value={startNote} onValueChange={setStartNote}>
                <SelectTrigger className={`w-24 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                  <SelectValue placeholder="Inicio" />
                </SelectTrigger>
                <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                  {getFilteredStartNotes.map((note) => (
                    <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className={`${theme.legendText} text-sm`}>→</span>

              <Select value={endNote} onValueChange={setEndNote}>
                <SelectTrigger className={`w-24 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                  <SelectValue placeholder="Final" />
                </SelectTrigger>
                <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                  {getFilteredEndNotes.map((note) => (
                    <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

                  <Select value={practicePattern} onValueChange={handlePracticePatternChange}>
                <SelectTrigger className={`w-48 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                  {Object.entries(PRACTICE_PATTERNS).map(([key, pattern]) => (
                    <SelectItem key={key} value={key} className={`${theme.selectText} ${theme.selectItemHover}`}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

                  <button
                    onClick={togglePracticeMode}
                    className={`p-2 rounded-full transition-colors ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} ${theme.selectHover} border`}
                  >
                    {practiceMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Fretboard con leyenda integrada */}
        <FretboardView
          currentTuning={currentTuning}
          selectedRoot={selectedRoot}
          selectedScale={selectedScale}
          theme={theme}
          practiceMode={practiceMode}
          currentPlayingNote={currentPlayingNote}
          nextPlayingNote={nextPlayingNote}
          playNoteSound={playNoteSound}
          calculateNoteAtFret={calculateNoteAtFret}
          calculateFullNoteAtFret={calculateFullNoteAtFret}
          isNoteInScale={isNoteInScale}
          isRootNote={isRootNote}
          scales={SCALES}
          realViewportHeight={realViewportHeight}
        />
      </div>
    </div>
  )
}