import { ReactNode } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FretboardHeaderProps {
  selectedInstrument: string
  setSelectedInstrument: (v: string) => void
  instrumentTunings: any
  selectedTuning: string
  setSelectedTuning: (v: string) => void
  theme: any
  children?: ReactNode
}

export default function FretboardHeader({
  selectedInstrument,
  setSelectedInstrument,
  instrumentTunings,
  selectedTuning,
  setSelectedTuning,
  theme,
  children
}: FretboardHeaderProps) {
  return (
    <div className="relative flex justify-center items-center w-full">
      <div className="flex gap-3 items-center">
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
      </div>
      <div className="absolute right-0">
        {children}
      </div>
    </div>
  )
} 