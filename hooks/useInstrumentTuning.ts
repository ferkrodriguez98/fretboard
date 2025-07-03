import { useState, useMemo } from "react"
import { INSTRUMENT_TUNINGS, SCALES } from "@/lib/constants"
import { getAvailableNotesWithOctaves } from "@/lib/musicUtils"

export function useInstrumentTuning({ selectedScale, selectedRoot }: { selectedScale: string, selectedRoot: string }) {
  const [selectedInstrument, setSelectedInstrument] = useState("bass-4")
  const [selectedTuning, setSelectedTuning] = useState("standard")

  const currentInstrument = INSTRUMENT_TUNINGS[selectedInstrument as keyof typeof INSTRUMENT_TUNINGS]
  const currentTuningData = currentInstrument.tunings[selectedTuning as keyof typeof currentInstrument.tunings]
  const currentTuning = currentTuningData?.notes || Object.values(currentInstrument.tunings)[0].notes

  const availableNotes = useMemo(
    () => getAvailableNotesWithOctaves(
      currentTuning,
      SCALES[selectedScale as keyof typeof SCALES].intervals,
      selectedRoot,
    ),
    [currentTuning, selectedScale, selectedRoot],
  )

  const handleInstrumentChange = (instrument: string) => {
    setSelectedInstrument(instrument)
    setSelectedTuning("standard")
  }

  return {
    selectedInstrument,
    setSelectedInstrument: handleInstrumentChange,
    selectedTuning,
    setSelectedTuning,
    currentInstrument,
    currentTuning,
    availableNotes,
  }
} 