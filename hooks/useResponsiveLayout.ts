import { useIsLandscapeRequired, useHasSpaceForMenu } from "@/hooks/use-mobile"

export function useResponsiveLayout(currentTuning: string[]) {
  const needsLandscape = useIsLandscapeRequired()
  const hasSpaceForMenu = useHasSpaceForMenu()
  const stringCount = currentTuning.length
  const getSpacing = () => {
    if (needsLandscape) {
      if (stringCount <= 4) {
        return {
          stringSpacing: "space-y-4",
          fretHeight: "h-12",
          noteSize: "w-7 h-7",
          stringTextSize: "text-lg",
          noteTextSize: "text-xs",
        }
      } else if (stringCount <= 6) {
        return {
          stringSpacing: "space-y-3",
          fretHeight: "h-9",
          noteSize: "w-6 h-6",
          stringTextSize: "text-base",
          noteTextSize: "text-xs",
        }
      } else {
        return {
          stringSpacing: "space-y-2",
          fretHeight: "h-8",
          noteSize: "w-5 h-5",
          stringTextSize: "text-sm",
          noteTextSize: "text-xs",
        }
      }
    } else {
      if (stringCount <= 4) {
        return {
          stringSpacing: "space-y-6",
          fretHeight: "h-16",
          noteSize: "w-10 h-10",
          stringTextSize: "text-2xl",
          noteTextSize: "text-sm",
        }
      } else if (stringCount <= 6) {
        return {
          stringSpacing: "space-y-4",
          fretHeight: "h-12",
          noteSize: "w-8 h-8",
          stringTextSize: "text-xl",
          noteTextSize: "text-xs",
        }
      } else {
        return {
          stringSpacing: "space-y-2",
          fretHeight: "h-10",
          noteSize: "w-7 h-7",
          stringTextSize: "text-lg",
          noteTextSize: "text-xs",
        }
      }
    }
  }
  const spacing = getSpacing()
  return { needsLandscape, hasSpaceForMenu, spacing }
} 