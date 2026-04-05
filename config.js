/**
 * BIOS CONFIG — Edit this file to customize your BIOS screen.
 * All other files read from this. Change stuff here only.
 */
window.BIOS_CONFIG = {

  /* ── Machine Identity ─────────────────────────────── */
  cpu:             'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz',
  cpuSpeed:        '3100MHz',
  ramMB:           4096,       // MB  (e.g. 2048, 4096, 8192)
  ramFrequency:    '1333 MHz',
  biosDate:        '04/25/11 09:12:53',
  biosVer:         '08.00.15',
  motherboard:     'ASUS P8H61-M LX',

  /* ── Disk Drives ──────────────────────────────────── */
  drives: {
    priMaster:  'LBA, ATA 133, 500.1 GB',
    priSlave:   'Not Detected',
    secMaster:  'Not Detected',
    secSlave:   'Not Detected',
  },

  /* ── Boot Order ───────────────────────────────────── */
  bootOrder: [
    'SATA: ST3500418AS',
    'USB: Not Detected',
    'CD/DVD: Not Detected',
  ],

  /* ── Timing (ms) ──────────────────────────────────── */
  timing: {
    blackFlash:      400,
    memCountDuration:4400,
    postLinePace:    320,   // avg delay between POST lines
    summaryHold:     8000,
    handoffDelay:    700,
  },

  /* ── Effects ──────────────────────────────────────── */
  effects: {
    scanlines:       true,
    phosphorGlow:    true,
    crtFlicker:      true,   // random brightness flicker
    screenJitter:    true,   // occasional horizontal shift
    postBeep:        true,   // Web Audio beep on boot
    typewriterSound: true,   // subtle tick per character
    hdSeekSound:     true,   // seek noise on disk lines
    glitchLines:     true,   // random corrupt text row flashes
  },

  /* ── Easter Eggs ──────────────────────────────────── */
  easterEggs: {
    failChance: 0.12,        // 12% chance of a fake error that retries
    konamiUnlock: true,      // Konami code → secret message
  },

};
 