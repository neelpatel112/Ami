/**
 * AMIBIOS Boot Sequence Emulator
 * Phases:
 *   0. Black flash          (~0.4s)
 *   1. POST / Memory count  (~9s)
 *   2. Summary screen       (~8s)
 *   3. Hand-off / black     (~1s)
 *
 * Total: ~18-19 seconds
 *
 * To integrate into Windows 8 project:
 *   - Import this JS + bios.css + index.html
 *   - Listen for the 'bios:complete' CustomEvent on window
 *   - Then show your Windows 8 boot animation
 */

(function () {
  'use strict';

  /* ── Utility helpers ──────────────────────────────────────────────── */

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Type text character by character into an element.
   * @param {HTMLElement} el
   * @param {string} text
   * @param {number} charDelay  ms per character
   */
  async function typeText(el, text, charDelay = 18) {
    el.textContent = '';
    for (const ch of text) {
      el.textContent += ch;
      await delay(charDelay);
    }
  }

  /**
   * Animate a number counting up inside an element.
   */
  async function countUp(el, from, to, durationMs) {
    const steps = Math.min(200, to - from);
    const stepSize = Math.max(1, Math.floor((to - from) / steps));
    const stepDelay = durationMs / steps;
    let current = from;
    while (current < to) {
      el.textContent = current.toLocaleString() + 'K';
      current = Math.min(current + stepSize, to);
      await delay(stepDelay);
    }
    el.textContent = to.toLocaleString() + 'K';
  }

  function showPhase(id) {
    document.querySelectorAll('.phase').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    const el = document.getElementById(id);
    el.style.display = 'block';
    // Force reflow before adding active so CSS animation triggers
    void el.offsetWidth;
    el.classList.add('active');
  }

  function addPostLine(label, statusText, statusClass) {
    const container = document.getElementById('post-lines');
    const row = document.createElement('div');
    row.className = 'post-line';

    const l = document.createElement('span');
    l.className = 'label';
    l.textContent = label;

    const s = document.createElement('span');
    s.className = statusClass || 'status-ok';
    s.textContent = statusText || '...OK';

    row.appendChild(l);
    row.appendChild(s);
    container.appendChild(row);
  }

  /* ── POST line data ───────────────────────────────────────────────── */

  const POST_LINES = [
    { label: 'Initializing Intel(R) Boot Agent GE v1.3.43',  status: '',       cls: 'status-ok',   delay: 320 },
    { label: 'PXE-MOF: Exiting Intel Boot Agent.',            status: '',       cls: 'status-ok',   delay: 260 },
    { label: 'Verifying DMI Pool Data',                        status: '......Update Success!', cls: 'status-ok', delay: 900 },
    { label: 'SATA Port 0: ST3500418AS',                       status: 'Ultra DMA Mode-5, S.M.A.R.T. Capable and Status OK', cls: 'status-ok', delay: 380 },
    { label: 'SATA Port 1: Not Detected',                      status: '',       cls: 'status-warn', delay: 200 },
    { label: 'SATA Port 2: Not Detected',                      status: '',       cls: 'status-warn', delay: 200 },
    { label: 'SATA Port 3: Not Detected',                      status: '',       cls: 'status-warn', delay: 200 },
    { label: 'USB Device(s):',                                  status: '1 Keyboard, 1 Mouse, 1 Storage Device', cls: 'status-ok', delay: 420 },
    { label: 'Auto-detecting USB Mass Storage Devices..',       status: '1 USB Mass Storage Device Found', cls: 'status-ok', delay: 650 },
    { label: 'Checking NVRAM...',                               status: '',       cls: 'status-ok',   delay: 280 },
    { label: 'Starting Setup...',                               status: '',       cls: 'status-ok',   delay: 220 },
  ];

  /* ── Phase 0: Initial black flash ────────────────────────────────── */
  async function phaseBlack() {
    showPhase('phase-black');
    await delay(400);
  }

  /* ── Phase 1: POST screen ─────────────────────────────────────────── */
  async function phasePost() {
    showPhase('phase-post');

    // CPU line typewriter
    const cpuEl = document.getElementById('cpu-line');
    await delay(180);
    await typeText(cpuEl, 'Intel(R) Core(TM) i5-2400 CPU @ 3.10GHz', 14);

    await delay(200);

    // Memory test counter
    const memLine = document.getElementById('mem-test-line');
    const totalKB = 4096 * 1024; // 4 GB in KB

    // Show label first
    memLine.innerHTML = '';
    const label = document.createElement('span');
    label.textContent = 'Testing Memory: ';
    memLine.appendChild(label);

    const countEl = document.createElement('span');
    countEl.className = 'mem-count';
    memLine.appendChild(countEl);

    const barOuter = document.createElement('span');
    barOuter.className = 'mem-bar-outer';
    const barInner = document.createElement('span');
    barInner.className = 'mem-bar-inner';
    barOuter.appendChild(barInner);
    memLine.appendChild(barOuter);

    // Count from 0 to totalKB (4GB) over ~4.5s, update bar too
    const countDuration = 4500;
    const steps = 200;
    const stepDelay = countDuration / steps;
    const stepSize = Math.floor(totalKB / steps);

    let current = 0;
    while (current < totalKB) {
      current = Math.min(current + stepSize, totalKB);
      countEl.textContent = current.toLocaleString() + 'K';
      barInner.style.width = ((current / totalKB) * 100).toFixed(1) + '%';
      await delay(stepDelay);
    }

    // Memory OK
    await delay(150);
    memLine.style.display = 'none';
    const okEl = document.getElementById('mem-ok-line');
    okEl.style.display = 'block';

    await delay(300);

    // POST lines
    for (const item of POST_LINES) {
      await delay(item.delay);
      addPostLine(item.label, item.status, item.cls);
    }

    await delay(600);
  }

  /* ── Phase 2: Summary screen ─────────────────────────────────────── */
  async function phaseSummary() {
    showPhase('phase-summary');
    // Just hold for ~8 seconds
    await delay(8000);
  }

  /* ── Phase 3: Hand-off ───────────────────────────────────────────── */
  async function phaseHandoff() {
    // Trigger CRT-off animation on the summary screen
    const summaryScreen = document.querySelector('#phase-summary .bios-screen');
    if (summaryScreen) {
      summaryScreen.classList.add('crt-off');
      await delay(300);
    }
    showPhase('phase-handoff');
    await delay(700);

    // 🔔 Fire event so parent app (Windows 8 project) can listen
    window.dispatchEvent(new CustomEvent('bios:complete', { bubbles: true }));
  }

  /* ── Boot sequence orchestrator ──────────────────────────────────── */
  async function runBoot() {
    try {
      await phaseBlack();
      await phasePost();
      await phaseSummary();
      await phaseHandoff();
    } catch (err) {
      console.error('[BIOS] Boot sequence error:', err);
      // Fallback: fire complete event anyway so we don't block the OS
      window.dispatchEvent(new CustomEvent('bios:complete', { bubbles: true }));
    }
  }

  /* ── Start on DOMContentLoaded ───────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBoot);
  } else {
    runBoot();
  }

})();
