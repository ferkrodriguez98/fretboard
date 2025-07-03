import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SideDrawerMenu = ({
  isOpen,
  onToggle,
  children,
  className = ""
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`
        fixed top-0 right-0 bottom-0 z-50
        w-full max-w-[420px] bg-gray-900/95 border-l border-gray-700/50
        shadow-2xl transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none opacity-0'}
        ${className}
      `}
      style={{
        height: '100vh',
        maxWidth: '90vw',
      }}
    >
      <button
        onClick={onToggle}
        className="absolute top-4 -left-6 p-2 rounded-full bg-gray-800 text-gray-100 border border-gray-600 shadow-lg z-50"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 justify-start items-stretch">
        {children}
      </div>
    </div>
  )
}

export default SideDrawerMenu 