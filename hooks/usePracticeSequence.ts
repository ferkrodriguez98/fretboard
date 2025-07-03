import { useState, useEffect, useRef } from "react"
import { generatePracticeSequence } from "@/lib/musicUtils"

export function usePracticeSequence({
  startNote,
  endNote,
  availableNotes,
  practicePattern,
  bpm,
  playNoteSound,
  audioContextRef,
}: {
  startNote: string
  endNote: string
  availableNotes: string[]
  practicePattern: string
  bpm: number
  playNoteSound: (note: string, duration?: number, audioContextRef?: React.MutableRefObject<AudioContext | null>) => void
  audioContextRef: React.MutableRefObject<AudioContext | null>
}) {
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [practiceSequence, setPracticeSequence] = useState<string[]>([])
  const [currentPlayingNote, setCurrentPlayingNote] = useState<string>("")
  const [nextPlayingNote, setNextPlayingNote] = useState<string>("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
          setCurrentPlayingNote(currentNote)
          setNextPlayingNote(nextNote)
          if (currentNote) {
            playNoteSound(currentNote, noteDuration, audioContextRef)
          }
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
  }, [practiceMode, bpm, practiceSequence, playNoteSound, audioContextRef])

  const togglePracticeMode = () => {
    setPracticeMode((prev) => !prev)
    setCurrentNoteIndex(0)
    if (practiceMode) {
      setCurrentPlayingNote("")
      setNextPlayingNote("")
    }
  }

  return {
    practiceMode,
    togglePracticeMode,
    currentNoteIndex,
    practiceSequence,
    currentPlayingNote,
    nextPlayingNote,
    setCurrentNoteIndex,
  }
} 