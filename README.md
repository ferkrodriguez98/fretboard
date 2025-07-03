# Fretboard Note Visualizer

Interactive fretboard application for practicing scales on string instruments.

## Features

- **Scale visualization** with customizable root notes and modes
- **Practice mode** with metronome and audio feedback
- **Multi-instrument support** (bass, guitar, ukulele, mandolin, banjo)
- **Multiple tunings** for each instrument
- **Responsive design** with mobile-optimized interface

## Supported Instruments

- **Bass:** 4/5/6 strings with standard and drop tunings
- **Guitar:** 6/7/8 strings with standard, drop, and open tunings
- **Ukulele:** Standard, low G, baritone tunings
- **Mandolin:** Standard tuning
- **Banjo:** 5-string standard and double C tunings

## Scales

Includes 30+ scales: Greek modes, pentatonic, blues, jazz, exotic scales (Hungarian, Arabic, Japanese, etc.).

## Usage

1. Select instrument and tuning
2. Choose scale and root note
3. Set practice range (start/end notes)
4. Select practice pattern (ascending, descending, up-down, down-up)
5. Adjust BPM and start practice mode

## Technical Details

- Built with Next.js, TypeScript, and Tailwind CSS
- Web Audio API for sound synthesis
- Responsive viewport handling for mobile devices
- Automatic rotation and scaling for mobile landscape view

## Installation

```bash
npm install
npm run dev
```

## Browser Support

Modern browsers with Web Audio API support (Chrome, Firefox, Safari).
