/**
 * AMIBIOS Boot — Full Visual + Easter Egg Edition
 * Visual:  CRT bezel · barrel distortion · phosphor burn-in · power LED · degauss
 * Pranks:  Virus scanner · ransomware fake · DOOM loader · keyboard not found joke
 */
(function () {
  'use strict';

  const CFG = window.BIOS_CONFIG;
  const SFX = window.BiosAudio;
  const FX  = CFG.effects;
  const SND = CFG.sounds;
  const T   = CFG.timing;
  const EGG = CFG.easterEggs;

  /* ══════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════ */
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const rand  = (a, b) => Math.random() * (b - a) + a;
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];

  async function typeText(el, text, charDelay = 16) {
    el.textContent = '';
    for (const ch of text) {
      el.textContent += ch;
      if (SND.typewriterSound && ch.trim()) SFX.tick();
      await delay(charDelay + rand(-4, 4));
    }
  }

  function showPhase(id) {
    document.querySelectorAll('.phase').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    const el = document.getElementById(id);
    el.style.display = 'block';
    void el.offsetWidth;
    el.classList.add('active');
  }

  /* ══════════════════════════════════════════════════
     POWER LED
  ══════════════════════════════════════════════════ */
  const led = document.getElementById('power-led');
  function setLED(state) {
    // state: 'off' | 'green' | 'amber'
    led.className = `led-${state === 'off' ? 'off' : state === 'green' ? 'green' : 'amber'}`;
  }

  /* ══════════════════════════════════════════════════
     BARREL DISTORTION (SVG filter injected into DOM)
  ══════════════════════════════════════════════════ */
  function injectBarrelFilter() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
      <defs>
        <filter id="barrel-filter" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
          <feImage result="map" preserveAspectRatio="none"
            href="data:image/svg+xml,
              %3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E
              %3CradialGradient id='g' cx='50%25' cy='50%25' r='70%25'%3E
              %3Cstop offset='0%25' stop-color='%23808080'/%3E
              %3Cstop offset='100%25' stop-color='%23404040'/%3E
              %3C/radialGradient%3E
              %3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="18"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>`;
    document.body.appendChild(svg);
    if (FX.barrelDistortion) {
      document.getElementById('screen-wrap').classList.add('barrel');
    }
  }

  /* ══════════════════════════════════════════════════
     PHOSPHOR BURN-IN
  ══════════════════════════════════════════════════ */
  const BURNIN_TEXT =
`AMIBIOS(C)2011 American Megatrends, Inc.           BIOS Date: 04/25/11 09:12:53  Ver: 08.00.15
Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz

Testing Memory:  4194304K ████████████████████

AMIBIOS(C)2011 American Megatrends Inc.
Initializing Intel(R) Boot Agent GE v1.3.43
Verifying DMI Pool Data......Update Success!
SATA Port 0: ST3500418AS     Ultra DMA Mode-5, S.M.A.R.T. OK
USB Device(s):  1 Keyboard, 1 Mouse, 1 Hub

    ___    __  ___ ____
   /   |  /  |/  //  _/
  / /| | / /|_/ / / /
 / ___ |/ /  / /_/ /
/_/  |_/_/  /_//___/

American Megatrends Inc.,`;

  function showBurnIn() {
    if (!FX.phosphorBurnIn) return;
    const layer = document.getElementById('burnin-layer');
    layer.textContent = BURNIN_TEXT;
  }

  /* ══════════════════════════════════════════════════
     CRT EFFECTS ENGINE
  ══════════════════════════════════════════════════ */
  let flickerInt = null, jitterInt = null, glitchInt = null;

  function startCRT(screenEl) {
    if (!screenEl) return;
    if (FX.crtFlicker) {
      flickerInt = setInterval(() => {
        if (Math.random() < 0.06) {
          screenEl.style.filter = `brightness(${rand(0.82, 0.96)})`;
          setTimeout(() => { screenEl.style.filter = ''; }, rand(30, 80));
        }
      }, 180);
    }
    if (FX.screenJitter) {
      jitterInt = setInterval(() => {
        if (Math.random() < 0.04) {
          screenEl.style.transform = `translateX(${rand(-3,3)}px)`;
          setTimeout(() => { screenEl.style.transform = ''; }, 55);
        }
      }, 250);
    }
    if (FX.glitchLines) {
      glitchInt = setInterval(() => {
        if (Math.random() < 0.07) spawnGlitch(screenEl);
      }, 600);
    }
  }

  function stopCRT() {
    clearInterval(flickerInt);
    clearInterval(jitterInt);
    clearInterval(glitchInt);
  }

  const GCHARS = '█▓▒░▄▀■□XXXXXXXXX////\\\\';
  function spawnGlitch(parent) {
    const g = document.createElement('div');
    g.className = 'glitch-line';
    const len = Math.floor(rand(6, 36));
    g.textContent = Array.from({length: len}, () => pick(GCHARS.split(''))).join('');
    g.style.top   = Math.floor(rand(10, 90)) + '%';
    g.style.left  = Math.floor(rand(0, 55)) + '%';
    g.style.color = pick(['#ff5555','#ffff54','#55ff55','#aaaaff','#fff']);
    parent.appendChild(g);
    setTimeout(() => g.remove(), rand(55, 175));
  }

  /* ══════════════════════════════════════════════════
     POST LINES
  ══════════════════════════════════════════════════ */
  const POST_LINES = [
    { label: 'AMIBIOS(C)2011 American Megatrends Inc.',       status: '',                              cls: 'status-ok',   ms: 200,  hd: false },
    { label: 'Initializing Intel(R) Boot Agent GE v1.3.43',  status: '',                              cls: 'status-ok',   ms: 310,  hd: false },
    { label: 'PXE-MOF: Exiting Intel Boot Agent.',            status: '',                              cls: 'status-ok',   ms: 240,  hd: false },
    { label: 'Verifying DMI Pool Data',                        status: '......Update Success!',        cls: 'status-ok',   ms: 820,  hd: false },
    { label: 'SATA Port 0: ST3500418AS',                       status: 'Ultra DMA Mode-5, S.M.A.R.T. OK', cls:'status-ok', ms: 360, hd: true  },
    { label: 'SATA Port 1:',                                   status: 'Not Detected',                 cls: 'status-warn', ms: 185,  hd: false },
    { label: 'SATA Port 2:',                                   status: 'Not Detected',                 cls: 'status-warn', ms: 185,  hd: false },
    { label: 'SATA Port 3:',                                   status: 'Not Detected',                 cls: 'status-warn', ms: 185,  hd: false },
    { label: 'USB Device(s):',                                 status: '1 Keyboard, 1 Mouse, 1 Hub',   cls: 'status-ok',   ms: 400,  hd: false },
    { label: 'Auto-detecting USB Mass Storage..',              status: '1 Device Found',               cls: 'status-ok',   ms: 570,  hd: false },
    { label: 'Checking NVRAM..',                               status: 'OK',                           cls: 'status-ok',   ms: 255,  hd: false },
    { label: 'Loading Setup Defaults..',                       status: 'Done',                         cls: 'status-ok',   ms: 295,  hd: false },
  ];

  function addPostLine(label, status, cls) {
    const wrap = document.getElementById('post-lines');
    const row  = document.createElement('div');
    row.className = 'post-line';
    row.innerHTML = `<span class="label">${label}</span><span class="${cls||'status-ok'}">${status||''}</span>`;
    wrap.appendChild(row);
  }

  /* ══════════════════════════════════════════════════
     ☠️  SCARY VIRUS PRANK
  ══════════════════════════════════════════════════ */

  const VIRUS_SCRIPTS = [
    // Script A — "CRYPTOVIPER" ransomware
    async function virusCryptoViper() {
      const o = document.getElementById('virus-overlay');
      o.style.display = 'flex';
      o.style.flexDirection = 'column';
      o.style.gap = '2px';
      o.style.padding = '14px';

      // Red tint the screen
      const sw = document.getElementById('screen-wrap');
      sw.classList.add('virus-red-tint');

      SFX.virusAlarm();

      const lines = [
        ['red',    ''],
        ['red',    '██████╗ ██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗ ██╗   ██╗██╗██████╗ ███████╗██████╗ '],
        ['red',    '██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔═══██╗██║   ██║██║██╔══██╗██╔════╝██╔══██╗'],
        ['red',    '██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║   ██║██║   ██║██║██████╔╝█████╗  ██████╔╝'],
        ['red',    '██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║   ██║╚██╗ ██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗'],
        ['red',    '╚██████╗██║  ██║   ██║   ██║        ██║   ╚██████╔╝ ╚████╔╝ ██║██║     ███████╗██║  ██║'],
        ['red',    ' ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝    ╚═════╝   ╚═══╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝'],
        ['red',    ''],
        ['yellow', '  !! WARNING: CRYPTOVIPER v3.1.4 RANSOMWARE DETECTED !!'],
        ['red',    ''],
        ['white',  '  Scanning system files...'],
      ];

      for (const [cls, text] of lines) {
        const d = document.createElement('div');
        d.className = `virus-line ${cls}`;
        d.style.fontSize = text.startsWith('█') || text.startsWith('╚') || text.startsWith('╗')
          ? 'clamp(4px,0.6vw,7px)' : '';
        d.textContent = text;
        o.appendChild(d);
        await delay(80);
      }

      // Fake file scan
      const FILES = [
        'C:\\Windows\\System32\\kernel32.dll',
        'C:\\Windows\\System32\\ntoskrnl.exe',
        'C:\\Users\\Admin\\Documents\\passwords.txt',
        'C:\\Users\\Admin\\Desktop\\banking.xlsx',
        'C:\\Windows\\System32\\drivers\\etc\\hosts',
        'C:\\Users\\Admin\\Pictures\\',
        'C:\\Program Files\\',
        'C:\\Users\\Admin\\AppData\\Roaming\\',
      ];

      for (const file of FILES) {
        const d = document.createElement('div');
        d.className = 'virus-line red';
        d.textContent = `  [ENCRYPTING] ${file}`;
        o.appendChild(d);
        SFX.hdSeek();
        await delay(rand(120, 280));
      }

      await delay(300);
      const warn = document.createElement('div');
      warn.className = 'virus-line yellow blink';
      warn.textContent = '  YOUR FILES ARE BEING ENCRYPTED. DO NOT TURN OFF YOUR COMPUTER.';
      o.appendChild(warn);
      await delay(400);

      const btc = document.createElement('div');
      btc.className = 'virus-line white';
      btc.textContent = '  Send 0.5 BTC to: 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf9Nc to recover your files.';
      o.appendChild(btc);

      SFX.virusAlarm();
      await delay(3800);

      // PLOT TWIST — just kidding
      o.innerHTML = '';
      const joke = document.createElement('div');
      joke.className = 'virus-line green';
      joke.style.fontSize = 'clamp(14px, 2vw, 22px)';
      joke.style.textAlign = 'center';
      joke.style.marginTop = '30%';
      joke.textContent = '  😂  lol just kidding. your files are fine bro.';
      o.appendChild(joke);
      SFX.beep(880, 0.2, 0.3);
      await delay(2500);

      sw.classList.remove('virus-red-tint');
      o.style.display = 'none';
      o.innerHTML = '';
    },

    // Script B — "GHOST_RAT" trojan
    async function virusGhostRAT() {
      const o = document.getElementById('virus-overlay');
      o.style.display = 'flex';
      o.style.flexDirection = 'column';
      o.style.gap = '2px';
      o.style.padding = '14px';
      o.style.color = '#00ff00'; // green terminal this time

      const sw = document.getElementById('screen-wrap');

      SFX.errorBeep();
      await delay(200);

      const introLines = [
        ['',        'Microsoft Windows [Version 5.1.2600]'],
        ['',        '(C) Copyright 1985-2001 Microsoft Corp.'],
        ['',        ''],
        ['#ff3333', 'ALERT: UNAUTHORIZED REMOTE CONNECTION DETECTED'],
        ['',        ''],
        ['',        'C:\\> netstat -an'],
        ['',        ''],
        ['',        'Active Connections:'],
        ['',        ''],
        ['',        '  Proto  Local Address        Foreign Address      State'],
        ['#ffff54', '  TCP    192.168.1.5:1337     185.220.101.47:4444  ESTABLISHED'],
        ['#ffff54', '  TCP    192.168.1.5:6969     91.108.4.0:443       ESTABLISHED'],
        ['#ff3333', '  TCP    192.168.1.5:9999     *.*.*.* :31337       SYN_SENT   '],
        ['',        ''],
        ['#ff3333', 'WARNING: GHOST_RAT v2.7 backdoor process detected'],
        ['',        'C:\\> tasklist | findstr ghost'],
        ['',        ''],
        ['#ff3333', '  ghost_rat.exe       PID: 1337   Mem: 2,048 KB'],
        ['#ff3333', '  keylogger.exe       PID: 6666   Mem: 512 KB'],
        ['#ff3333', '  screengrab.exe      PID: 4444   Mem: 768 KB'],
        ['',        ''],
        ['#ffff54', 'Uploading data to remote server...'],
      ];

      for (const [color, text] of introLines) {
        const d = document.createElement('div');
        d.className = 'virus-line';
        d.style.color = color || '#00ff00';
        d.textContent = text;
        o.appendChild(d);
        if (SND.typewriterSound && text.trim()) SFX.tick();
        await delay(rand(60, 130));
      }

      // Progress bar
      const pbar = document.createElement('div');
      pbar.className = 'virus-line';
      pbar.style.color = '#ff3333';
      o.appendChild(pbar);

      for (let i = 0; i <= 100; i += 2) {
        const bar = '█'.repeat(Math.floor(i / 5)).padEnd(20, '░');
        pbar.textContent = `  Upload: [${bar}] ${i}%`;
        await delay(55);
      }

      await delay(400);
      const d2 = document.createElement('div');
      d2.className = 'virus-line';
      d2.style.color = '#ff3333';
      d2.textContent = '  Upload complete. 2.4 GB sent.';
      o.appendChild(d2);
      SFX.virusAlarm();
      await delay(2500);

      // Punchline
      o.innerHTML = '';
      const j = document.createElement('div');
      j.className = 'virus-line';
      j.style.color = '#55ff55';
      j.style.fontSize = 'clamp(13px, 1.8vw, 20px)';
      j.style.textAlign = 'center';
      j.style.marginTop = '30%';
      j.textContent = '  🤣  gotcha. this is 100% fake. relax bro.';
      o.appendChild(j);
      SFX.beep(660, 0.15, 0.25);
      await delay(2500);
      o.style.display = 'none';
      o.innerHTML = '';
    },

    // Script C — "BIOS CORRUPTED" scary system failure
    async function virusBIOSCorrupt() {
      const o = document.getElementById('virus-overlay');
      o.style.display = 'flex';
      o.style.flexDirection = 'column';
      o.style.justifyContent = 'center';
      o.style.alignItems = 'center';
      o.style.gap = '10px';
      o.style.background = '#000';

      const sw = document.getElementById('screen-wrap');
      sw.classList.add('virus-red-tint');
      SFX.errorBeep();
      await delay(300);
      SFX.errorBeep();

      const msgs = [
        { text: '!! CRITICAL BIOS CORRUPTION DETECTED !!', color: '#ff0000', size: 'clamp(14px,2vw,22px)' },
        { text: '', color: '#fff', size: '' },
        { text: 'BIOS chip write-protected region has been modified.', color: '#ffffff', size: '' },
        { text: 'Firmware integrity check: FAILED', color: '#ff5555', size: '' },
        { text: '', color: '#fff', size: '' },
        { text: 'Attempting recovery from backup...', color: '#ffff54', size: '' },
      ];

      for (const m of msgs) {
        const d = document.createElement('div');
        d.style.color  = m.color;
        d.style.fontFamily = "'Share Tech Mono', monospace";
        if (m.size) d.style.fontSize = m.size;
        d.textContent = m.text;
        o.appendChild(d);
        await delay(350);
      }

      // Fake recovery bar
      const wrap = document.createElement('div');
      wrap.style.cssText = 'width:60%;border:1px solid #ff4400;height:14px;margin-top:8px;';
      const fill = document.createElement('div');
      fill.style.cssText = 'height:100%;background:linear-gradient(90deg,#660000,#ff2200);width:0%;transition:width 0.05s';
      wrap.appendChild(fill);
      o.appendChild(wrap);
      const pct = document.createElement('div');
      pct.style.color = '#ff8844';
      pct.style.fontFamily = "'Share Tech Mono',monospace";
      o.appendChild(pct);

      for (let i = 0; i <= 47; i++) {
        fill.style.width = i + '%';
        pct.textContent = `Recovery: ${i}%`;
        await delay(60);
      }

      // FAIL at 47%
      await delay(200);
      fill.style.background = '#ff0000';
      const fail = document.createElement('div');
      fail.style.cssText = 'color:#ff0000;font-family:Share Tech Mono,monospace;font-size:clamp(13px,1.8vw,18px);margin-top:10px;';
      fail.textContent = 'RECOVERY FAILED — SYSTEM UNBOOTABLE';
      o.appendChild(fail);
      SFX.virusAlarm();
      await delay(300);
      SFX.virusAlarm();

      // Screen goes black and "dies"
      await delay(1500);
      o.style.background = '#000';
      o.innerHTML = '';
      await delay(800);

      // Then punchline appears
      const j = document.createElement('div');
      j.style.cssText = 'color:#55ff55;font-family:Share Tech Mono,monospace;font-size:clamp(13px,1.8vw,19px);text-align:center;';
      j.textContent = '😂  psyche. your BIOS is perfectly fine. stop sweating lmao.';
      o.appendChild(j);
      SFX.beep(523, 0.15, 0.25);
      await delay(2500);

      sw.classList.remove('virus-red-tint');
      o.style.display = 'none';
      o.innerHTML = '';
    },
  ];

  async function maybeVirusPrank() {
    if (Math.random() > EGG.virusChance) return;
    const script = pick(VIRUS_SCRIPTS);
    await script();
  }

  /* ══════════════════════════════════════════════════
     💀 DOOM EASTER EGG (type D-O-O-M during POST)
  ══════════════════════════════════════════════════ */
  let doomBuffer = '';

  function checkDoom(key) {
    if (!EGG.doomUnlock) return;
    doomBuffer += key.toLowerCase();
    if (doomBuffer.length > 4) doomBuffer = doomBuffer.slice(-4);
    if (doomBuffer === 'doom') {
      doomBuffer = '';
      triggerDoom();
    }
  }

  async function triggerDoom() {
    const o = document.getElementById('doom-overlay');
    o.style.display = 'flex';

    const logo = document.createElement('div');
    logo.className = 'doom-logo';
    logo.textContent = 'DOOM';
    o.appendChild(logo);

    const sub = document.createElement('div');
    sub.className = 'doom-sub';
    sub.textContent = 'id Software · 1993  —  Loading...';
    o.appendChild(sub);

    const barWrap = document.createElement('div');
    barWrap.className = 'doom-bar';
    const barFill = document.createElement('div');
    barFill.className = 'doom-fill';
    barWrap.appendChild(barFill);
    o.appendChild(barWrap);

    const pct = document.createElement('div');
    pct.className = 'doom-pct';
    o.appendChild(pct);

    SFX.beep(220, 0.3, 0.4);
    await delay(200);
    SFX.beep(165, 0.3, 0.35);

    for (let i = 0; i <= 100; i++) {
      barFill.style.width = i + '%';
      pct.textContent = `${i}%`;
      await delay(rand(30, 60));
    }

    await delay(300);
    pct.textContent = 'Error: DOOM.EXE not found on this system.';
    pct.style.color = '#ff5555';
    SFX.errorBeep();
    await delay(2000);

    const joke = document.createElement('div');
    joke.className = 'doom-sub';
    joke.style.color = '#55ff55';
    joke.style.marginTop = '12px';
    joke.textContent = '(nice try though 👾)';
    o.appendChild(joke);
    await delay(2000);

    o.style.display = 'none';
    o.innerHTML = '';
  }

  /* ══════════════════════════════════════════════════
     ⌨️ KEYBOARD NOT FOUND JOKE
  ══════════════════════════════════════════════════ */
  async function maybeKeyboardJoke() {
    if (Math.random() > EGG.keyboardJoke) return;
    const joke = document.createElement('div');
    joke.className = 'kbd-joke';
    joke.textContent = 'Keyboard not found — Press any key to continue';
    // Append inside screen-wrap so it shows over everything
    document.getElementById('screen-wrap').appendChild(joke);
    await delay(5000);
    joke.remove();
  }

  /* ══════════════════════════════════════════════════
     😅 CMOS FAKE ERROR
  ══════════════════════════════════════════════════ */
  async function maybeFakeError() {
    if (Math.random() > EGG.failChance) return;
    SFX.errorBeep();
    addPostLine('!! CMOS Checksum Error — Defaults Loaded !!', '', 'status-fail');
    await delay(1100);
    addPostLine('Press F1 to Run SETUP, F2 to Load Defaults', '', 'status-warn');
    await delay(2100);
    addPostLine('Continuing with defaults...', '', 'status-ok');
    await delay(700);
  }

  /* ══════════════════════════════════════════════════
     PHASE 0 — BLACK + FAN SPIN + LED ON
  ══════════════════════════════════════════════════ */
  async function phaseBlack() {
    showPhase('phase-black');
    setLED('amber');

    if (SND.fanSpinUp) SFX.fanSpinUp(T.fanSpinDuration);
    await delay(T.fanSpinDuration * 0.6);

    setLED('green');
    SFX.crtOn();
    if (SND.degauss) {
      await delay(120);
      SFX.degauss();
      const sw = document.getElementById('screen-wrap');
      sw.classList.add('degauss-flash');
      setTimeout(() => sw.classList.remove('degauss-flash'), 700);
    }
    await delay(T.blackFlash);
  }

  /* ══════════════════════════════════════════════════
     PHASE 1 — POST
  ══════════════════════════════════════════════════ */
  async function phasePost() {
    showPhase('phase-post');
    showBurnIn();

    const screen = document.querySelector('#phase-post .bios-screen');
    startCRT(screen);

    await delay(280);
    if (SND.postBeep) SFX.postBeep();

    await typeText(document.getElementById('cpu-line'), CFG.cpu, 13);
    await delay(180);

    // Memory counter
    const memLine = document.getElementById('mem-test-line');
    memLine.innerHTML = '<span>Testing Memory: </span>';
    const countEl = document.createElement('span');
    countEl.className = 'mem-count';
    memLine.appendChild(countEl);
    const barOut = document.createElement('span');
    barOut.className = 'mem-bar-outer';
    const barIn = document.createElement('span');
    barIn.className = 'mem-bar-inner';
    barOut.appendChild(barIn);
    memLine.appendChild(barOut);

    const totalKB = CFG.ramMB * 1024;
    const steps   = 220;
    const step    = Math.floor(totalKB / steps);
    let cur = 0, tc = 0;
    while (cur < totalKB) {
      cur = Math.min(cur + step, totalKB);
      countEl.textContent = cur.toLocaleString() + 'K';
      barIn.style.width   = ((cur / totalKB) * 100).toFixed(1) + '%';
      tc++;
      if (SND.typewriterSound && tc % 8 === 0) SFX.memTick();
      await delay(T.memCountDuration / steps);
    }

    await delay(120);
    memLine.style.display = 'none';
    document.getElementById('mem-ok-line').style.display = 'block';
    SFX.beep(1200, 0.08, 0.2);
    await delay(280);

    for (const item of POST_LINES) {
      await delay(item.ms + rand(-40, 60));
      if (item.hd && SND.hdSeekSound) SFX.hdSeek();
      addPostLine(item.label, item.status, item.cls);
    }

    await delay(400);
    await maybeFakeError();
    await maybeKeyboardJoke();
    await maybeVirusPrank();
    await delay(500);
    stopCRT();
  }

  /* ══════════════════════════════════════════════════
     PHASE 2 — SUMMARY
  ══════════════════════════════════════════════════ */
  async function phaseSummary() {
    document.getElementById('sum-cpu').textContent     = CFG.cpu;
    document.getElementById('sum-speed').textContent   = CFG.cpuSpeed;
    document.getElementById('sum-ram').textContent     = CFG.ramMB + ' MB';
    document.getElementById('sum-ramfreq').textContent = CFG.ramFrequency;
    document.getElementById('sum-pri-m').textContent   = CFG.drives.priMaster;
    document.getElementById('sum-pri-s').textContent   = CFG.drives.priSlave;
    document.getElementById('sum-sec-m').textContent   = CFG.drives.secMaster;
    document.getElementById('sum-sec-s').textContent   = CFG.drives.secSlave;

    const boEl = document.getElementById('boot-order-list');
    boEl.innerHTML = '';
    CFG.bootOrder.forEach((b, i) => {
      const d = document.createElement('div');
      d.className = 'boot-order-item';
      d.textContent = `${i + 1}. ${b}`;
      boEl.appendChild(d);
    });

    showPhase('phase-summary');
    startCRT(document.querySelector('#phase-summary .bios-screen'));
    await delay(T.summaryHold);
    stopCRT();
  }

  /* ══════════════════════════════════════════════════
     PHASE 3 — HANDOFF
  ══════════════════════════════════════════════════ */
  async function phaseHandoff() {
    setLED('amber');
    SFX.crtOff();
    const s = document.querySelector('#phase-summary .bios-screen');
    if (s) s.classList.add('crt-off');
    await delay(280);
    showPhase('phase-handoff');
    setLED('off');
    await delay(T.handoffDelay);
    window.dispatchEvent(new CustomEvent('bios:complete', { bubbles: true }));
  }

  /* ══════════════════════════════════════════════════
     BIOS SETUP MENU (DEL)
  ══════════════════════════════════════════════════ */
  const SM = {
    tabs: ['Main', 'Advanced', 'Boot', 'Security', 'Exit'],
    tab: 0, row: 0, visible: false,
    items: {
      Main:     [['System Time','[ 12:00:00]'],['System Date','[04/05/2026]'],['SATA Config','Enhanced'],['ACPI Settings',''],['USB Config','']],
      Advanced: [['CPU Config',''],['Chipset',''],['Onboard Devices',''],['PCIPnP','']],
      Boot:     [['1st Boot Device','[Hard Drive]'],['2nd Boot Device','[USB Drive]'],['3rd Boot Device','[CDROM]'],['Boot Settings','']],
      Security: [['Supervisor Password','Not Installed'],['User Password','Not Installed'],['HDD Password','Not Installed']],
      Exit:     [['Save & Exit',''],['Discard & Exit',''],['Load Defaults',''],['Save Changes','']],
    },
    help: {
      Main:     ['Set the system time.','Set the system date.','Configure SATA mode.','Configure ACPI settings.','Configure USB devices.'],
      Advanced: ['Configure CPU settings.','Configure chipset.','Configure onboard devices.','Configure PnP settings.'],
      Boot:     ['First boot device priority.','Second boot device.','Third boot device.','Configure boot behavior.'],
      Security: ['Set supervisor password.','Set user password.','HDD password status.'],
      Exit:     ['Save all changes and exit.','Exit without saving.','Load factory defaults.','Save without exiting.'],
    },
  };

  function renderSetup() {
    const o = document.getElementById('setup-overlay');
    const tab = SM.tabs[SM.tab]; const items = SM.items[tab];
    o.innerHTML = `
      <div class="setup-box">
        <div class="setup-title">BIOS SETUP UTILITY</div>
        <div class="setup-tabs">${SM.tabs.map((t,i)=>`<span class="stab ${i===SM.tab?'active':''}">${t}</span>`).join('')}</div>
        <div class="setup-content">
          <div class="setup-items">${items.map(([l,v],i)=>`<div class="sitem ${i===SM.row?'sel':''}">${l}<span class="sval">${v}</span></div>`).join('')}</div>
          <div class="setup-helpbox"><div class="shelp-title">Item Help</div><div class="shelp-text">${(SM.help[tab]||[])[SM.row]||''}</div></div>
        </div>
        <div class="setup-footer">←→ Tab &nbsp; ↑↓ Row &nbsp; F10 Save+Exit &nbsp; ESC Exit</div>
      </div>`;
    o.style.display = 'flex'; SM.visible = true;
  }
  function closeSetup() { document.getElementById('setup-overlay').style.display='none'; SM.visible=false; SFX.navBeep('back'); }

  /* ── F8 Boot Menu ─────────────────────────────────── */
  const BM = { items: [...CFG.bootOrder, 'Enter Setup'], sel: 0, visible: false };
  function renderBootMenu() {
    const o = document.getElementById('bootmenu-overlay');
    o.innerHTML = `
      <div class="bootmenu-box">
        <div class="bm-title">Please select boot device:</div>
        <div class="bm-list">${BM.items.map((it,i)=>`<div class="bm-item ${i===BM.sel?'sel':''}">${it}</div>`).join('')}</div>
        <div class="bm-footer">↑↓ Select &nbsp; ENTER Confirm &nbsp; ESC Cancel</div>
      </div>`;
    o.style.display = 'flex'; BM.visible = true;
  }
  function closeBootMenu() { document.getElementById('bootmenu-overlay').style.display='none'; BM.visible=false; SFX.navBeep('back'); }

  /* ── Konami ───────────────────────────────────────── */
  const KC = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let ki = 0;
  function checkKonami(k) {
    if (!EGG.konamiUnlock) return;
    ki = (k === KC[ki]) ? ki + 1 : 0;
    if (ki === KC.length) {
      ki = 0;
      [440,523,659,880].forEach((f,i) => setTimeout(() => SFX.beep(f,0.1,0.3), i*110));
      const el = document.createElement('div');
      el.className = 'konami-msg';
      el.textContent = '★  KONAMI CODE — +30 LIVES ACTIVATED  ★';
      document.getElementById('screen-wrap').appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }
  }

  /* ── Keyboard Handler ─────────────────────────────── */
  let running = true;
  document.addEventListener('keydown', e => {
    checkKonami(e.key);
    checkDoom(e.key);

    if (SM.visible) {
      const tab = SM.tabs[SM.tab]; const items = SM.items[tab];
      if (e.key==='ArrowDown')   { SM.row=(SM.row+1)%items.length; SFX.navBeep('move'); renderSetup(); }
      else if(e.key==='ArrowUp') { SM.row=(SM.row-1+items.length)%items.length; SFX.navBeep('move'); renderSetup(); }
      else if(e.key==='ArrowRight'){SM.tab=(SM.tab+1)%SM.tabs.length; SM.row=0; SFX.navBeep('move'); renderSetup();}
      else if(e.key==='ArrowLeft'){SM.tab=(SM.tab-1+SM.tabs.length)%SM.tabs.length; SM.row=0; SFX.navBeep('move'); renderSetup();}
      else if(e.key==='Escape'||e.key==='F10') closeSetup();
      e.preventDefault(); return;
    }
    if (BM.visible) {
      if (e.key==='ArrowDown')   { BM.sel=(BM.sel+1)%BM.items.length; SFX.navBeep('move'); renderBootMenu(); }
      else if(e.key==='ArrowUp') { BM.sel=(BM.sel-1+BM.items.length)%BM.items.length; SFX.navBeep('move'); renderBootMenu(); }
      else if(e.key==='Enter')   { SFX.navBeep('select'); closeBootMenu(); }
      else if(e.key==='Escape')  closeBootMenu();
      e.preventDefault(); return;
    }
    if (e.key==='Delete' && running) { SFX.navBeep('select'); renderSetup(); }
    if (e.key==='F8'     && running) { SFX.navBeep('select'); renderBootMenu(); }
  });

  /* ── Main run ─────────────────────────────────────── */
  async function run() {
    injectBarrelFilter();
    try {
      await phaseBlack();
      await phasePost();
      await phaseSummary();
      running = false;
      await phaseHandoff();
    } catch(err) {
      console.error('[BIOS]', err);
      window.dispatchEvent(new CustomEvent('bios:complete'));
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run)
    : run();

})();
 