import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"

interface SettingsModalProps {
  bpm: number
  inputValue: string
  setInputValue: (v: string) => void
  setBpm: (v: number) => void
  noteValue: string
  setNoteValue: (v: string) => void
  volume: number
  setVolume: (v: number) => void
  metronomeVolume: number
  setMetronomeVolume: (v: number) => void
  theme: any
}

export default function SettingsModal({
  bpm,
  inputValue,
  setInputValue,
  setBpm,
  noteValue,
  setNoteValue,
  volume,
  setVolume,
  metronomeVolume,
  setMetronomeVolume,
  theme,
}: SettingsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`p-1.5 rounded-full transition-colors ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} ${theme.selectHover} border cursor-pointer`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className={`${theme.cardBg} ${theme.cardBorder} border-2 max-w-md bg-gray-800`}>
        <DialogHeader>
          <DialogTitle className={`${theme.legendText} text-xl font-bold`}>
            Configuración
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* BPM */}
          <div className="space-y-2">
            <label className={`${theme.legendText} text-sm font-medium`}>
              BPM
            </label>
            <Input
              type="number"
              min="60"
              max="200"
              value={inputValue || ""}
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
              className={`w-full ${theme.selectBg} ${theme.selectBorder} ${theme.selectText}`}
            />
          </div>

          {/* Subdivisión */}
          <div className="space-y-2">
            <label className={`${theme.legendText} text-sm font-medium`}>
              Subdivisión
            </label>
            <Select value={noteValue} onValueChange={setNoteValue}>
              <SelectTrigger
                className={`w-full ${theme.selectBg} ${theme.selectBorder} ${theme.selectText} cursor-pointer ${theme.selectHover}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${theme.selectContentBg} ${theme.cardBorder}`}>
                <SelectItem value="quarter" className={`${theme.selectText} ${theme.selectItemHover}`}>Negra</SelectItem>
                <SelectItem value="eighth" className={`${theme.selectText} ${theme.selectItemHover}`}>Corchea</SelectItem>
                <SelectItem value="sixteenth" className={`${theme.selectText} ${theme.selectItemHover}`}>Semicorchea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volumen Notas */}
          <div className="space-y-2">
            <label className={`${theme.legendText} text-sm font-medium`}>
              Volumen Notas
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={`flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider ${theme.selectBg} ${theme.selectBorder}`}
              />
              <span className={`${theme.legendText} text-xs w-12 text-center`}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Volumen Metrónomo */}
          <div className="space-y-2">
            <label className={`${theme.legendText} text-sm font-medium`}>
              Volumen Metrónomo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={metronomeVolume}
                onChange={(e) => setMetronomeVolume(parseFloat(e.target.value))}
                className={`flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider ${theme.selectBg} ${theme.selectBorder}`}
              />
              <span className={`${theme.legendText} text-xs w-12 text-center`}>
                {Math.round(metronomeVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 