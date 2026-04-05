/**
 * BIOS CONFIG — Edit this file to customize everything.
 */
window.BIOS_CONFIG = {

  /* ── Machine Identity ─────────────────────────────── */
  cpu:             'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz',
  cpuSpeed:        '3100MHz',
  ramMB:           4096,
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
    blackFlash:       400,
    fanSpinDuration:  1800,   // fan noise before screen turns on
    memCountDuration: 4400,
    postLinePace:     320,
    summaryHold:      8000,
    handoffDelay:     700,
  },

  /* ── Visual Effects ───────────────────────────────── */
  effects: {
    crtBezel:        true,   // monitor frame around screen
    barrelDistortion:true,   // curved screen warp
    phosphorBurnIn:  true,   // ghost text behind content
    powerLED:        true,   // blinking green LED dot
    scanlines:       true,
    phosphorGlow:    true,
    crtFlicker:      true,
    screenJitter:    true,
    glitchLines:     true,
  },

  /* ── Sound Effects ────────────────────────────────── */
  sounds: {
    fanSpinUp:       true,
    degauss:         true,   // magnetic WHOOM on screen on
    postBeep:        true,
    typewriterSound: true,
    hdSeekSound:     true,
  },

  /* ── Easter Eggs ──────────────────────────────────── */
  easterEggs: {
    failChance:      0.12,   // CMOS error
    virusChance:     0.25,   // scary virus prank chance
    keyboardJoke:    0.20,   // "keyboard not found" joke
    konamiUnlock:    true,
    doomUnlock:      true,   // type DOOM during POST
  },
};
 