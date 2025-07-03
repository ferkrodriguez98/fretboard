import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Play, Pause } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { INSTRUMENT_TUNINGS, SCALES, ROOT_NOTES, PRACTICE_PATTERNS, theme } from "@/lib/constants"

interface PracticeControlsProps {
  selectedInstrument: string
  setSelectedInstrument: (v: string) => void
  selectedTuning: string
  setSelectedTuning: (v: string) => void
  selectedRoot: string
  setSelectedRoot: (v: string) => void
  selectedScale: string
  setSelectedScale: (v: string) => void
  startNote: string
  setStartNote: (v: string) => void
  endNote: string
  setEndNote: (v: string) => void
  availableNotes: string[]
  practicePattern: string
  setPracticePattern: (v: string) => void
  bpm: number
  setBpm: (v: number) => void
  inputValue: string
  setInputValue: (v: string) => void
  practiceMode: boolean
  togglePracticeMode: () => void
  needsLandscape: boolean
}

export default function PracticeControls({
  selectedInstrument,
  setSelectedInstrument,
  selectedTuning,
  setSelectedTuning,
  selectedRoot,
  setSelectedRoot,
  selectedScale,
  setSelectedScale,
  startNote,
  setStartNote,
  endNote,
  setEndNote,
  availableNotes,
  practicePattern,
  setPracticePattern,
  bpm,
  setBpm,
  inputValue,
  setInputValue,
  practiceMode,
  togglePracticeMode,
  needsLandscape,
}: PracticeControlsProps) {
  const currentInstrument = INSTRUMENT_TUNINGS[selectedInstrument as keyof typeof INSTRUMENT_TUNINGS]
  return (
    <Card className={`${theme.cardBg} ${theme.cardBorder} flex-shrink-0`}>
      <CardContent className={`${needsLandscape ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center justify-center flex-wrap ${needsLandscape ? 'gap-2' : 'gap-4'}`}>
          <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-40' : 'w-48'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
              {Object.entries(INSTRUMENT_TUNINGS).map(([key, config]) => (
                <SelectItem key={key} value={key} className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTuning} onValueChange={setSelectedTuning}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-40' : 'w-52'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
              {Object.entries(currentInstrument.tunings).map(([key, tuning]) => (
                <SelectItem key={key} value={key} className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}>
                  {tuning.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className={`${theme.legendText} text-sm font-medium`}>BPM:</span>
            <Input
              type="number"
              min="60"
              max="200"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={() => {
                const newBpm = Math.max(60, Math.min(200, Number(inputValue) || 60))
                setBpm(newBpm)
                setInputValue(newBpm.toString())
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  const newBpm = Math.max(60, Math.min(200, Number(inputValue) || 60))
                  setBpm(newBpm)
                  setInputValue(newBpm.toString())
                  e.currentTarget.blur()
                }
              }}
              className={`w-20 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}
            />
          </div>

          <Select value={selectedRoot} onValueChange={setSelectedRoot}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-16' : 'w-20'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
              {ROOT_NOTES.map(note => (
                <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedScale} onValueChange={setSelectedScale}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-48' : 'w-64'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} max-h-80 custom-scrollbar`}>
              {Object.entries(SCALES).map(([key, scale]) => (
                <SelectItem key={key} value={key} className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}>
                  {scale.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={startNote} onValueChange={setStartNote}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-20' : 'w-24'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
              <SelectValue placeholder="Inicio" />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
              {availableNotes.map(note => (
                <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className={`${theme.legendText} text-sm`}>→</span>

          <Select value={endNote} onValueChange={setEndNote}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-20' : 'w-24'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
              <SelectValue placeholder="Final" />
            </SelectTrigger>
            <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
              {availableNotes.map(note => (
                <SelectItem key={note} value={note} className={`${theme.selectText} ${theme.selectItemHover}`}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={practicePattern} onValueChange={setPracticePattern}>
            <SelectTrigger className={`select-trigger ${needsLandscape ? 'w-36' : 'w-48'} ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}>
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
      </CardContent>
    </Card>
  )
} 