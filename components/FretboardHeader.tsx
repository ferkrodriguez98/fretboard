import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FretboardHeaderProps {
  selectedInstrument: string
  setSelectedInstrument: (v: string) => void
  instrumentTunings: any
  selectedTuning: string
  setSelectedTuning: (v: string) => void
  bpm: number
  inputValue: string
  setInputValue: (v: string) => void
  setBpm: (v: number) => void
  theme: any
}

export default function FretboardHeader({
  selectedInstrument,
  setSelectedInstrument,
  instrumentTunings,
  selectedTuning,
  setSelectedTuning,
  bpm,
  inputValue,
  setInputValue,
  setBpm,
  theme,
}: FretboardHeaderProps) {
  return (
    <div className="flex gap-3 justify-center items-center flex-wrap">
      <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
        <SelectTrigger
          className={`w-48 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
          {Object.entries(instrumentTunings).map(([key, config]: any) => (
            <SelectItem
              key={key}
              value={key}
              className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
            >
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTuning} onValueChange={setSelectedTuning}>
        <SelectTrigger
          className={`w-52 ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover} transition-colors`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder} custom-scrollbar`}>
          {Object.entries(instrumentTunings[selectedInstrument].tunings).map(([key, tuning]: any) => (
            <SelectItem
              key={key}
              value={key}
              className={`${theme.selectText} ${theme.selectItemHover} cursor-pointer`}
            >
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
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            const newBpm = Math.max(60, Math.min(200, Number(inputValue) || 60))
            setBpm(newBpm)
            setInputValue(newBpm.toString())
          }}
          onKeyDown={(e) => {
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
    </div>
  )
} 