import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NOTE_TO_FREQUENCY } from "@/lib/constants"

interface FretboardViewProps {
  currentTuning: string[]
  selectedRoot: string
  selectedScale: string
  theme: any
  practiceMode: boolean
  currentPlayingNote: string
  nextPlayingNote: string
  playNoteSound: (noteWithOctave: string) => void
  calculateNoteAtFret: (baseNote: string, fret: number) => string
  calculateFullNoteAtFret: (baseNoteWithOctave: string, fret: number) => string
  isNoteInScale: (note: string) => boolean
  isRootNote: (note: string) => boolean
  scales: any
  realViewportHeight: number
}

export default function FretboardView({
  currentTuning,
  selectedRoot,
  selectedScale,
  theme,
  practiceMode,
  currentPlayingNote,
  nextPlayingNote,
  playNoteSound,
  calculateNoteAtFret,
  calculateFullNoteAtFret,
  isNoteInScale,
  isRootNote,
  scales,
  realViewportHeight
}: FretboardViewProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 800)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Calcular espaciado dinámico basado en cantidad de cuerdas
  const stringCount = currentTuning.length
  const getSpacing = () => {
    // En mobile rotado, ajustamos los espacios para que se vea bien
    if (isMobile) {
      if (stringCount <= 4) {
        return {
          stringSpacing: "space-y-3",
          fretHeight: "h-10",
          noteSize: "w-7 h-7",
          stringTextSize: "text-lg",
          noteTextSize: "text-xs",
        }
      } else if (stringCount <= 6) {
        return {
          stringSpacing: "space-y-2",
          fretHeight: "h-8",
          noteSize: "w-6 h-6",
          stringTextSize: "text-base",
          noteTextSize: "text-xs",
        }
      } else {
        return {
          stringSpacing: "space-y-1",
          fretHeight: "h-6",
          noteSize: "w-5 h-5",
          stringTextSize: "text-sm",
          noteTextSize: "text-xs",
        }
      }
    }
    
    // Desktop spacing normal - Ajustado para mejor uso del espacio vertical
    if (stringCount <= 4) {
      return {
        stringSpacing: "space-y-8",
        fretHeight: "h-20",
        noteSize: "w-12 h-12",
        stringTextSize: "text-2xl",
        noteTextSize: "text-base",
      }
    } else if (stringCount <= 6) {
      return {
        stringSpacing: "space-y-6",
        fretHeight: "h-16",
        noteSize: "w-10 h-10",
        stringTextSize: "text-xl",
        noteTextSize: "text-sm",
      }
    } else {
      return {
        stringSpacing: "space-y-4",
        fretHeight: "h-12",
        noteSize: "w-8 h-8",
        stringTextSize: "text-lg",
        noteTextSize: "text-xs",
      }
    }
  }

  const spacing = getSpacing()

  // Función para obtener el color de la nota según el tema
  const getNoteColor = (note: string, fullNoteWithOctave: string): string => {
    // Resaltar SOLO la nota específica que está sonando (con octava)
    if (practiceMode && fullNoteWithOctave === currentPlayingNote) {
      return `bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300/50 shadow-yellow-400/50 text-black shadow-lg`
    }

    if (practiceMode && fullNoteWithOctave === nextPlayingNote) {
      return `bg-gradient-to-br from-yellow-400/20 to-orange-500/50 border-yellow-300/25 shadow-yellow-400/25 text-black/70 shadow-lg`
    }

    if (!isNoteInScale(note)) {
      return theme.otherNote
    }

    if (isRootNote(note)) {
      return `bg-gradient-to-br ${theme.rootNote} text-white shadow-lg`
    }

    return `bg-gradient-to-br ${theme.scaleNote} text-white shadow-lg`
  }

  return (
    <div className={`flex-1 flex flex-col ${isMobile ? 'items-center justify-center overflow-hidden' : ''}`}>
      <Card 
        className={`${theme.fretboardBg} ${theme.fretboardBorder} ${
          isMobile 
            ? '' 
            : 'flex-1 w-full'
        }`}
        style={isMobile ? {
          transform: 'rotate(-90deg)',
          transformOrigin: 'center center',
          height: '90vw',
          width: realViewportHeight * 0.9,
          position: 'absolute'
        } : {}}
      >
        <CardContent className={`h-full flex flex-col ${isMobile ? 'p-2' : 'p-4'}`}>
          {/* Fretboard */}
          <div className="flex-1 flex flex-col">
            <div className={`flex-1 flex flex-col justify-center ${spacing.stringSpacing} min-h-0`}>
              {/* Marcadores de trastes */}
              <div className="flex mb-1">
                <div className={`${isMobile ? 'w-10' : 'w-16'}`}></div>
                {Array.from({ length: 13 }, (_, fret) => (
                  <div key={fret} className="flex-1 flex justify-center">
                    {[3, 5, 7, 9].includes(fret) && (
                      <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} ${theme.markerColor} rounded-full`}></div>
                    )}
                    {fret === 12 && (
                      <div className="flex flex-col gap-1">
                        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} ${theme.markerColor} rounded-full`}></div>
                        <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} ${theme.markerColor} rounded-full`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cuerdas y trastes */}
              {currentTuning.map((stringNoteWithOctave, stringIndex) => {
                const stringNote = stringNoteWithOctave.slice(0, -1) // Quitar octava para mostrar

                return (
                  <div key={stringIndex} className="flex items-center min-w-0">
                    {/* Nombre de la cuerda */}
                    <div
                      className={`${isMobile ? 'w-10' : 'w-16'} text-center font-bold ${spacing.stringTextSize} ${theme.stringText} flex-shrink-0`}
                    >
                      {stringNote}
                    </div>

                    {/* Trastes */}
                    {Array.from({ length: 13 }, (_, fret) => {
                      const noteAtFret = calculateNoteAtFret(stringNote, fret)
                      const fullNoteAtFret = calculateFullNoteAtFret(stringNoteWithOctave, fret)
                      const isInScale = isNoteInScale(noteAtFret)
                      const colorClass = getNoteColor(noteAtFret, fullNoteAtFret)

                      return (
                        <div
                          key={fret}
                          className={`flex-1 ${spacing.fretHeight} flex items-center justify-center relative min-w-0`}
                        >
                          {/* Línea de traste */}
                          {fret > 0 && (
                            <div
                              className={`absolute left-0 top-1 bottom-1 ${isMobile ? 'w-0.5' : 'w-1'} ${theme.fretColor} rounded-full`}
                            ></div>
                          )}

                          {/* Cuerda */}
                          <div
                            className={`absolute left-0 right-0 bg-gradient-to-r ${theme.stringColor} rounded-full ${
                              isMobile 
                                ? stringCount <= 4
                                  ? stringIndex === stringCount - 1 ? "h-0.5" : "h-px"
                                  : stringCount <= 6
                                    ? stringIndex >= stringCount - 2 ? "h-0.5" : "h-px"
                                    : "h-px"
                                : stringCount <= 4
                                  ? stringIndex === stringCount - 1 ? "h-1" : "h-0.5"
                                  : stringCount <= 6
                                    ? stringIndex >= stringCount - 2 ? "h-1" : "h-0.5"
                                    : stringIndex >= stringCount - 3 ? "h-0.5" : "h-px"
                            }`}
                          ></div>

                          {/* Nota */}
                          <div
                            className={`
                              ${spacing.noteSize} rounded-full flex items-center justify-center ${spacing.noteTextSize} font-bold
                              border z-10 transition-all duration-300 cursor-pointer
                              ${colorClass}
                              ${isInScale ? (isMobile ? "scale-100" : "scale-110") : "opacity-30 hover:opacity-60"}
                              hover:scale-${isMobile ? "110" : "125"} transform
                            `}
                            onClick={() => playNoteSound(fullNoteAtFret)}
                            title={`${fullNoteAtFret} (${NOTE_TO_FREQUENCY[fullNoteAtFret]?.toFixed(1) || "?"} Hz)`}
                          >
                            {noteAtFret}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leyenda integrada */}
          <div className={`flex-shrink-0 pt-2 border-t border-gray-700/50 mt-2 ${isMobile ? 'px-2' : ''}`}>
            <div className={`flex justify-center items-center ${isMobile ? 'gap-4 flex-wrap' : 'gap-8'}`}>
              <div className="flex items-center gap-2">
                <div className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-gradient-to-br ${theme.rootNote}`}></div>
                <span className={`${theme.legendText} ${isMobile ? 'text-xs' : 'text-sm'}`}>Tónica ({selectedRoot})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-gradient-to-br ${theme.scaleNote}`}></div>
                <span className={`${theme.legendText} ${isMobile ? 'text-xs' : 'text-sm'}`}>Notas de la escala</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} rounded-full ${theme.otherNote}`}></div>
                <span className={`${theme.legendTextMuted} ${isMobile ? 'text-xs' : 'text-sm'}`}>Otras notas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 