import { NOTE_TO_FREQUENCY } from "./constants"

export function playNoteSound(noteWithOctave: string, durationInSeconds?: number, audioContextRef?: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!audioContextRef?.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new (window.AudioContext || ((window as any).webkitAudioContext as typeof AudioContext))()
    }
    const audioContext = audioContextRef.current
    if (audioContext.state === "suspended") {
      audioContext.resume()
    }
    const frequency = NOTE_TO_FREQUENCY[noteWithOctave]
    if (!frequency) return
    const latency = 0.15
    const startTime = audioContext.currentTime + latency
    const duration = durationInSeconds || 0.5
    const attackTime = 0.1
    const osc = audioContext.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(frequency, startTime)
    const subOsc = audioContext.createOscillator()
    subOsc.type = "sine"
    subOsc.frequency.setValueAtTime(frequency / 2, startTime)
    const filter = audioContext.createBiquadFilter()
    filter.type = "lowpass"
    filter.Q.setValueAtTime(1.5, startTime)
    filter.frequency.setValueAtTime(frequency * 2.5, startTime)
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration * 0.3)
    const oscGain = audioContext.createGain()
    oscGain.gain.value = 0.3
    const subGain = audioContext.createGain()
    subGain.gain.value = 0.2
    const masterGain = audioContext.createGain()
    masterGain.gain.setValueAtTime(0, startTime)
    masterGain.gain.linearRampToValueAtTime(1, startTime + attackTime)
    masterGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    osc.connect(oscGain)
    subOsc.connect(subGain)
    oscGain.connect(filter)
    subGain.connect(filter)
    filter.connect(masterGain)
    masterGain.connect(audioContext.destination)
    osc.start(startTime)
    subOsc.start(startTime)
    osc.stop(startTime + duration)
    subOsc.stop(startTime + duration)
  } catch (error) {
    // Silenciar error
  }
} 