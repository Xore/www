/* ============================================================
   xore.rocks — app.js
   Terminal-noir: commands type themselves, output streams in.
   ============================================================ */
'use strict';

/* ── live clock (local timezone) ── */
(function () {
  const el = document.getElementById('clock');
  if (!el) return;
  function tick() {
    el.textContent = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'Europe/Berlin',
    }) + ' CET';
  }
  tick(); setInterval(tick, 1000);
})();

/* ── status section: uptime counter ── */
(function () {
  const el = document.getElementById('uptime-val');
  if (!el) return;
  const boot = Date.now() - (14 * 86400 + 7 * 3600 + 23 * 60 + 11) * 1000;
  function pad2(n) { return String(n).padStart(2, '0'); }
  function render() {
    const s   = Math.floor((Date.now() - boot) / 1000);
    const d   = Math.floor(s / 86400);
    const h   = Math.floor((s % 86400) / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    el.textContent = d + 'd ' + pad2(h) + 'h ' + pad2(m) + 'm ' + pad2(sec) + 's';
  }
  render(); setInterval(render, 1000);
})();

/* ── helpers ── */
function pad(n) { return String(n).padStart(2, '0'); }
const now  = new Date();
const tStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

/* ── MOTD ASCII art ── */
const MOTD_LINES = [
  '██╗  ██╗ ██████╗ ██████╗ ███████╗   ██████╗  ██████╗  ██████╗██╗  ██╗███████╗',
  '╚██╗██╔╝██╔═══██╗██╔══██╗██╔════╝   ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██╔════╝',
  ' ╚███╔╝ ██║   ██║██████╔╝█████╗     ██████╔╝██║   ██║██║     █████╔╝ ███████╗',
  ' ██╔██╗ ██║   ██║██╔══██╗██╔══╝     ██╔══██╗██║   ██║██║     ██╔═██╗ ╚════██║',
  '██╔╝ ██╗╚██████╔╝██║  ██║███████╗██╗██║  ██║╚██████╔╝╚██████╗██║  ██╗███████║',
  '╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝',
].join('\n');

/* ── SCRIPT ── */
const SCRIPT = [

  { motd: true },

  {
    cmd: 'whoami && hostname',
    out: [
      { c: 'g', h: 'xore' },
      { c: 'g', h: 'ops.xore.rocks' },
    ],
  },

  {
    cmd: 'cat /etc/motd',
    out: [
      { c: 'b', h: 'Welcome to xore.rocks — network security &amp; homelab.' },
      { c: 'd', h: 'Heinsberg, DE &nbsp;&middot;&nbsp; zero-trust, zero-drama &nbsp;&middot;&nbsp; no open ports.' },
    ],
  },

  {
    cmd: 'cat ~/about.txt',
    out: [
      { c: 'divider', h: '────────────────────────────────────────────────────────' },
      { c: 'b', h: '  Self-hosted infrastructure and network security.' },
      { c: 'b', h: '  Running on hardware I own. No cloud, no SaaS &mdash;' },
      { c: 'b', h: '  just configs, packets, and intent.' },
      { c: 'divider', h: '────────────────────────────────────────────────────────' },
    ],
  },

  {
    cmd: 'ls -1 ~/links/',
    out: [
      { c: 'g', h: '  <a href="https://static.xore.rocks" target="_blank" rel="noopener">docs/</a>'
                + '  <span class="d"># cgnat documentation &amp; guides</span>' },
      { c: 'g', h: '  <a href="mailto:hi@xore.rocks">contact/</a>' },
    ],
  },

  {
    cmd: 'uptime -p',
    out: [
      { c: 'g2', h: 'up 14 days, 7 hours, 23 minutes' },
    ],
  },

];

/* ── RENDERER ── */
const tbody = document.getElementById('tbody');

function mk(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls)                e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function spacer()     { tbody.appendChild(mk('span', 'spacer')); }
function scrollDown() { tbody.scrollTop = tbody.scrollHeight; }

function typeText(span, text, cb) {
  let i = 0;
  (function tick() {
    span.textContent = text.slice(0, ++i);
    scrollDown();
    if (i < text.length) setTimeout(tick, 30 + Math.random() * 22);
    else setTimeout(cb, 100);
  })();
}

function showOutput(lines, cb) {
  let i = 0;
  (function next() {
    if (i >= lines.length) { setTimeout(cb, 180); return; }
    const line = lines[i++];
    const cls  = 'out ' + (typeof line === 'string' ? '' : (line.c || ''));
    const html = typeof line === 'string' ? line : line.h;
    tbody.appendChild(mk('span', cls.trim(), html));
    scrollDown();
    setTimeout(next, 44 + Math.random() * 32);
  })();
}

function run(steps, i) {
  i = i || 0;
  if (i >= steps.length) {
    spacer();
    const row = mk('span', 'cmd-row');
    row.appendChild(mk('span', 'prompt', 'xore@ops'));
    row.appendChild(mk('span', 'cmd-txt', ':~$ '));
    row.appendChild(mk('span', 'caret', '█'));
    tbody.appendChild(row);
    scrollDown();
    return;
  }

  const step = steps[i];

  if (step.motd) {
    const pre = mk('pre', 'motd-art', MOTD_LINES);
    pre.setAttribute('data-text', MOTD_LINES);
    tbody.appendChild(pre);
    tbody.appendChild(mk('div', 'motd-sub',
      'running on hardware I own &nbsp;&mdash;&nbsp; Heinsberg, DE &nbsp;&mdash;&nbsp; self-hosted'));
    spacer();
    setTimeout(() => run(steps, i + 1), 380);
    return;
  }

  const row   = mk('span', 'cmd-row');
  const cmdSp = mk('span', 'cmd-txt', ':~$ ');
  row.appendChild(mk('span', 'prompt', 'xore@ops'));
  row.appendChild(cmdSp);
  tbody.appendChild(row);
  scrollDown();

  typeText(cmdSp, ':~$ ' + step.cmd, () => {
    if (!step.out || !step.out.length) { spacer(); run(steps, i + 1); return; }
    showOutput(step.out, () => { spacer(); run(steps, i + 1); });
  });
}

setTimeout(() => run(SCRIPT), 500);
