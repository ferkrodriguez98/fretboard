interface LegendProps {
  needsLandscape: boolean
  selectedRoot: string
  theme: any
}

export default function Legend({ needsLandscape, selectedRoot, theme }: LegendProps) {
  return (
    <div className="flex-shrink-0">
      <div className="flex justify-center items-center gap-8 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`${needsLandscape ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-gradient-to-br ${theme.rootNote}`}></div>
          <span className={`${theme.legendText} ${needsLandscape ? 'text-xs' : 'text-sm'}`}>Tónica ({selectedRoot})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${needsLandscape ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-gradient-to-br ${theme.scaleNote}`}></div>
          <span className={`${theme.legendText} ${needsLandscape ? 'text-xs' : 'text-sm'}`}>Notas de la escala</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${needsLandscape ? 'w-4 h-4' : 'w-6 h-6'} rounded-full ${theme.otherNote}`}></div>
          <span className={`${theme.legendTextMuted} ${needsLandscape ? 'text-xs' : 'text-sm'}`}>Otras notas</span>
        </div>
      </div>
    </div>
  )
} 