/* Риддлсайд · логика сайта. Тексты лежат в content.js */
(() => {
'use strict';
const D = window.RS_DATA, TX = window.RS_TEXT;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = a => a[Math.floor(Math.random() * a.length)];
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; el.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return el;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const emph = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const ICON = {
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.4 4.2L2.9 11.3c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.4-1.5zM8.6 13.9l9.1-5.7c.4-.3.8-.1.5.2l-7.8 7-.3 3.3-1.5-4.8z"/></svg>',
  globe: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#3a8fd6" stroke="#0d3d6e" stroke-width="2"/><path d="M6 24h36M24 6c-7 8-7 28 0 36M24 6c7 8 7 28 0 36M10 14h28M10 34h28" stroke="#cfe8ff" stroke-width="2" fill="none"/></svg>',
  doc: '<svg viewBox="0 0 48 48"><path d="M10 4h20l8 8v32H10z" fill="#fff" stroke="#444" stroke-width="2"/><path d="M30 4v8h8" fill="#ddd" stroke="#444" stroke-width="2"/><path d="M15 20h18M15 26h18M15 32h12" stroke="#777" stroke-width="2"/></svg>',
  fine: '<svg viewBox="0 0 48 48"><path d="M10 4h28v40H10z" fill="#f4ecd8" stroke="#5a4630" stroke-width="2"/><path d="M15 12h18M15 18h18M15 24h10" stroke="#8a7458" stroke-width="2"/><circle cx="31" cy="34" r="7" fill="none" stroke="#b3261e" stroke-width="3"/></svg>',
  star: '<svg viewBox="0 0 48 48"><path d="M24 4l5.5 12.5L43 18l-10 9.3L36 41l-12-7-12 7 3-13.7L5 18l13.5-1.5z" fill="#d8b043" stroke="#7a5a12" stroke-width="2"/></svg>',
  lock: '<svg viewBox="0 0 48 48"><path d="M4 12h16l4 4h20v26H4z" fill="#e8c35a" stroke="#7a5a12" stroke-width="2"/><rect x="18" y="26" width="12" height="10" rx="1" fill="#555"/><path d="M20 26v-3a4 4 0 018 0v3" stroke="#555" stroke-width="2.5" fill="none"/></svg>',
  folder: '<svg viewBox="0 0 48 48"><path d="M4 12h16l4 4h20v26H4z" fill="#e8c35a" stroke="#7a5a12" stroke-width="2"/></svg>',
  trash: '<svg viewBox="0 0 48 48"><path d="M12 14h24l-2 28H14z" fill="#cfd8dc" stroke="#455a64" stroke-width="2"/><path d="M9 14h30M19 14v-4h10v4M19 20v16M24 20v16M29 20v16" stroke="#455a64" stroke-width="2" fill="none"/></svg>',
  music: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#222" stroke="#888" stroke-width="2"/><circle cx="24" cy="24" r="12" fill="none" stroke="#444" stroke-width="1.5"/><circle cx="24" cy="24" r="5" fill="#c0392b"/><circle cx="24" cy="24" r="1.5" fill="#eee"/></svg>',
  mine: '<svg viewBox="0 0 48 48"><path d="M24 6v8M24 34v8M6 24h8M34 24h8M11 11l6 6M31 31l6 6M37 11l-6 6M17 31l-6 6" stroke="#111" stroke-width="3"/><circle cx="24" cy="24" r="11" fill="#111"/><circle cx="20" cy="20" r="3" fill="#fff"/></svg>',
  phoneApp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>'
};

/* ---------------- state ---------------- */
const KEY = 'riddleside_v1';
const defaults = () => ({ lang: null, muted: false, ach: {}, seen: { places: [], people: [], threads: [] }, calls: {}, reached: [], walkie: 0, classified: 0, hack: false });
let S = defaults();
try { const raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (raw && typeof raw === 'object') S = Object.assign(defaults(), raw, { seen: Object.assign(defaults().seen, raw.seen || {}) }); } catch (e) { /* storage blocked */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
const sess = { obs: false, spilled: false, torn: new Set(), folder: 0, stClicks: {}, penI: 0, intro: true };

let lang = (() => {
  try { const q = new URLSearchParams(location.search).get('lang'); if (q === 'ru' || q === 'en') return q; } catch (e) { }
  if (S.lang === 'ru' || S.lang === 'en') return S.lang;
  const n = (navigator.language || 'en').toLowerCase();
  return /^(ru|uk|be|kk)/.test(n) ? 'ru' : 'en';
})();
let L = TX[lang];
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------------- sound ---------------- */
const SND = {};
function snd(name, vol = 0.7, loop = false) {
  if (S.muted) return null;
  let a = SND[name];
  if (!a) { a = SND[name] = new Audio(`assets/snd/${name}.mp3`); a.preload = 'auto'; }
  try { a.loop = loop; a.pause(); a.currentTime = 0; a.volume = vol; const p = a.play(); if (p && p.catch) p.catch(() => { }); } catch (e) { }
  return a;
}
const stopSnd = name => { const a = SND[name]; if (a) { try { a.pause(); a.loop = false; } catch (e) { } } };
const click = () => snd('click', 0.45);
let AC = null, noiseBuf = null, staticGain = null;
function ac() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume().catch(() => { });
  return AC;
}
function getNoise(c) {
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}
function noiseBurst(dur = 0.8, vol = 0.12) {
  if (S.muted) return; const c = ac(); if (!c) return;
  const src = c.createBufferSource(); src.buffer = getNoise(c); src.loop = true;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.6;
  const g = c.createGain(); g.gain.setValueAtTime(vol, c.currentTime); g.gain.linearRampToValueAtTime(0, c.currentTime + dur);
  src.connect(bp).connect(g).connect(c.destination); src.start(); src.stop(c.currentTime + dur + 0.05);
}
function staticLevel(v) {
  const c = ac(); if (!c) return;
  if (!staticGain) {
    const src = c.createBufferSource(); src.buffer = getNoise(c); src.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.4;
    staticGain = c.createGain(); staticGain.gain.value = 0;
    src.connect(bp).connect(staticGain).connect(c.destination); src.start();
  }
  staticGain.gain.setTargetAtTime(S.muted ? 0 : v, c.currentTime, 0.08);
}
const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], '*': [941, 1209], 0: [941, 1336], '#': [941, 1477] };
function tone(freqs, dur = 0.15, vol = 0.07) {
  if (S.muted) return; const c = ac(); if (!c) return;
  const g = c.createGain(); g.gain.setValueAtTime(vol, c.currentTime); g.gain.setValueAtTime(vol, c.currentTime + dur - 0.03); g.gain.linearRampToValueAtTime(0, c.currentTime + dur);
  g.connect(c.destination);
  freqs.forEach(f => { const o = c.createOscillator(); o.frequency.value = f; o.connect(g); o.start(); o.stop(c.currentTime + dur); });
}
const RTRACKS = ['r_neon_rust', 'r_demo', 'r_riddleside'];
const theme = new Audio('assets/snd/music.mp3'); theme.loop = true; theme.preload = 'none';
let rIdx = 0, radioTrackChanged = null;
const music = new Audio(); music.preload = 'none'; music.src = `assets/snd/${RTRACKS[0]}.mp3`;
music.addEventListener('ended', () => { rIdx = (rIdx + 1) % RTRACKS.length; music.src = `assets/snd/${RTRACKS[rIdx]}.mp3`; radioApply(); radioTrackChanged && radioTrackChanged(); });
const bed = new Audio('assets/snd/r_grain.mp3'); bed.loop = true; bed.preload = 'none';
const wloop = new Audio('assets/snd/whispers_loop.mp3'); wloop.loop = true; wloop.preload = 'none';

/* ---------------- DOM refs ---------------- */
const scene = $('#scene'), scroller = $('#scroller'), stage = $('#stage'), overlays = $('#overlays');
const W = 2272, H = 1888, RATIO = W / H;
const LAY = {
  phone: [0, 50.742, 19.806, 23.146], folder0: [38.028, 60.275, 18.662, 7.839], folder1: [37.852, 57.097, 18.838, 11.017], folder2: [24.736, 59.587, 31.954, 8.528],
  mug: [82.79, 55.191, 7.306, 8.316], mug_spill: [74.252, 53.549, 18.09, 11.758], lamp: [12.456, 38.983, 4.93, 10.646],
  radio_sh: [91.813, 50.371, 8.187, 12.076], radio: [91.813, 37.394, 5.062, 23.411], st1: [74.428, 50.106, 5.942, 4.025], st2: [43.97, 33.051, 3.257, 4.025]
};
const box = (el, [x, y, w, hh]) => { Object.assign(el.style, { left: x + '%', top: y + '%', width: w + '%', height: hh + '%' }); return el; };
const layers = {};

/* ---------------- notes & achievements ---------------- */
function note(text, ms) {
  const n = h('div', { class: 'note', role: 'status' }, text);
  const box = $('#toasts'); box.append(n);
  while (box.children.length > 2) box.firstElementChild.remove();
  setTimeout(() => { n.classList.add('out'); setTimeout(() => n.remove(), 450); }, ms || Math.max(3200, text.length * 55));
}
const STAT_IMG = { rep: 'ic_rep', shame: 'ic_shame', obs: 'ic_obs', skep: 'ic_skep' };
const statLabel = s => ({ rep: L.ui.statRep, shame: L.ui.statShame, obs: L.ui.statObs, skep: L.ui.statSkep }[s]);
function ach(id) {
  if (S.ach[id]) return;
  const a = L.ledger.list.find(x => x.id === id); if (!a) return;
  S.ach[id] = Date.now(); save();
  const t = h('div', { class: 'ach ' + a.s, role: 'status' }, h('img', { src: `assets/img/${STAT_IMG[a.s]}.webp`, alt: '' }), h('div', {}, h('small', {}, `${statLabel(a.s)} ${L.ui.plus}`), h('b', {}, a.t)));
  $('#achs').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, 4200);
  tone([660, 990], 0.12, 0.05); setTimeout(() => tone([880, 1320], 0.18, 0.05), 120);
  updateFrames();
  if (cur && cur.id === 'ledger') renderCur();
  if (Object.keys(S.ach).length >= L.ledger.list.length) setTimeout(() => note(L.ledger.allDone), 1600);
}
const achCount = () => L.ledger.list.filter(a => S.ach[a.id]).length;

/* ---------------- scene ---------------- */
const HS = () => [
  { id: 'shelf', b: [0, 2, 9.5, 55], tip: 'shelf', go: 'people' },
  { id: 'diploma', b: [11.5, 9, 10, 11.5], tip: 'diploma', act: () => openOv('people', { id: 'rose' }) },
  { id: 'frames', b: [11.5, 22.3, 10, 13], tip: 'frames', act: framesClick },
  { id: 'frames2', b: [60.3, 8, 15, 13.8], tip: 'frames', act: framesClick, down: true },
  { id: 'frames3', b: [56.2, 0, 19, 6.8], tip: 'frames', act: framesClick, down: true },
  { id: 'flag', b: [12, 0, 40, 7], tip: 'flag', act: () => note(L.scene.flag), down: true },
  { id: 'wanted', b: [24.4, 14.4, 7.7, 12], tip: 'wanted', act: () => note(sess.obs ? L.scene.wantedObs : L.scene.wanted) },
  { id: 'map', b: [33, 8.7, 23.5, 24], tip: 'map', go: 'map' },
  { id: 'calendar', b: [60.8, 24.5, 15, 15.5], tip: 'calendar', act: () => note(L.scene.calendar + (D.releaseDay ? '\n' + L.scene.calendarRelease : '')) },
  { id: 'radio', b: [80.5, 6.5, 14, 12], tip: 'radio', go: 'radio', down: true },
  { id: 'cigs', b: [80.2, 15.6, 5.8, 3.8], tip: 'cigs', act: cigsClick },
  { id: 'card', b: [25.2, 9.2, 6.4, 4.8], tip: 'note', act: () => { note(L.scene.cardNote); click(); }, down: true },
  { id: 'clip', b: [24.8, 27.2, 7.4, 7.2], tip: 'clip', act: () => { note(L.scene.clipNote); snd('paper', 0.35); } },
  { id: 'monitor', b: [21, 32.6, 26, 21.4], tip: 'monitor', go: 'pc' },
  { id: 'keyboard', b: [20.5, 55.8, 27, 4.4], tip: 'monitor', go: 'pc' },
  { id: 'lamp', b: [12.3, 36, 5.6, 22], tip: 'lamp', act: () => setObs(!sess.obs, true) },
  { id: 'pens', b: [56.5, 48.5, 5, 11], tip: 'pens', act: () => { note(L.scene.pens[sess.penI++ % L.scene.pens.length]); click(); } },
  { id: 'phone', b: LAY.phone, tip: 'phone', layer: 'phone', act: () => PH.ringing ? answer() : openOv('phone') },
  { id: 'folder', b: [38, 59.5, 18.7, 8.8], tip: 'folder', layer: 'folder0', act: openCaseAnimated },
  { id: 'mug', b: LAY.mug, tip: 'mug', layer: 'mug', act: mugClick },
  { id: 'walkie', b: LAY.radio, tip: 'walkie', layer: 'radio', act: walkie },
  { id: 'st1', b: LAY.st1, tip: 'st1', layer: 'st1', act: () => stickerClick('st1') },
  { id: 'st2', b: LAY.st2, tip: 'st2', layer: 'st2', act: () => stickerClick('st2') },
  { id: 'drawerL', b: [1, 75, 22, 14], tip: 'drawerL', act: openNapkins },
  { id: 'drawerR', b: [77.5, 72, 21.5, 16], tip: 'drawerR', act: () => { note(L.scene.drawerR); click(); } }
];
function frameArt(b, cls, inner) { return box(h('div', { class: 'frame-art ' + cls, html: inner }), b); }
function buildScene() {
  scene.innerHTML = '';
  scene.append(h('img', { class: 'bg', src: 'assets/img/bg.webp', alt: '', draggable: 'false' }));
  // monitor glow
  scene.append(h('div', { class: 'screen deco' }, h('span', { class: 'idle' }, 'CountyOS 98'), h('span', { class: 'obs-msg' }, L.scene.monitorObs)));
  // diploma + certificate frames
  scene.append(frameArt([12.6, 10.4, 7.8, 8.6], 'diploma', `<div class="cert"><b>DIPLOMA</b><i></i><i style="width:50%"></i><div class="seal"></div></div>`));
  const certHTML = `<div class="cert"><b>${esc(L.ledger.certTitle)}</b><i></i><i style="width:55%"></i><div class="seal"></div></div>`;
  scene.append(frameArt([12.6, 23.9, 7.8, 10], 'c1', certHTML), frameArt([61.6, 9.6, 12.4, 10.6], 'c2', certHTML), frameArt([57.6, 0, 16.2, 5.2], 'c3', certHTML));
  // wanted poster duplicate for glitching
  const wb = [24.4, 14.4, 7.7, 12];
  scene.append(box(h('div', { class: 'deco wanted-glitch', style: { backgroundImage: 'url(assets/img/bg.webp)', backgroundSize: `${100 / wb[2] * 100}% ${100 / wb[3] * 100}%`, backgroundPosition: `${wb[0] / (100 - wb[2]) * 100}% ${wb[1] / (100 - wb[3]) * 100}%` } }), wb));
  // tally on the board
  scene.append(box(h('div', { class: 'deco minimap', html: mapSVG().replace('xMidYMid slice', 'xMidYMid meet') }), [33.6, 9.6, 22.2, 22.4]));
  [[51.94, 19.47], [45.94, 19.47], [49.32, 26.02]].forEach(([x, y]) => scene.append(box(h('div', { class: 'deco mpin' }), [x - 0.35, y - 0.42, 0.7, 0.84])));
  scene.append(box(h('div', { class: 'deco wanted-text' }, ...L.scene.wanted.map((t, i) => h(i ? 'span' : 'b', {}, t))), [24.9, 20.9, 6.7, 5.2]));
  scene.append(box(h('div', { class: 'deco cork-card' }, h('i', { class: 'pushpin' }), L.scene.card), [25.4, 9.5, 6, 4.2]));
  scene.append(box(h('div', { class: 'deco clipping' }, h('i', { class: 'pushpin' }), h('small', {}, L.scene.clipHead), h('b', {}, L.scene.clipTitle), h('span'), h('span'), h('span'), h('span')), [24.9, 27.5, 7.2, 6.8]));
  scene.append(h('div', { class: 'deco strings', html: '<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><path d="M28.5 27.6 Q 40 25.5 51.94 19.47" /><path d="M28.3 14.6 Q 38 22 49.32 26.02" /></svg>' }));
  scene.append(h('div', { class: 'tally deco', html: tallySVG() }));
  // calendar ring
  if (D.releaseDay) {
    const idx = D.releaseDay + 3, col = idx % 7, row = Math.floor(idx / 7);
    const cx = (692 + 23.7 * (col + .5)) / 1136 * 100, cy = (275 + row * 19.7) / 944 * 100;
    scene.append(box(h('div', { class: 'cal-ring' }), [cx - 1.5, cy - 1.6, 3, 3.2]));
  }
  // layers
  const L2 = (k, src, cls) => { const el = box(h('img', { class: 'layer ' + (cls || ''), src: `assets/img/${src}.webp`, alt: '', draggable: 'false' }), LAY[k]); layers[k] = el; scene.append(el); return el; };
  L2('phone', 'l_phone');
  L2('folder0', 'l_folder0'); L2('folder1', 'l_folder1', 'off'); L2('folder2', 'l_folder2', 'off');
  L2('mug', 'l_mug', sess.spilled ? 'off' : ''); L2('mug_spill', 'l_mug_spill', sess.spilled ? '' : 'off');
  L2('lamp', 'l_lamp', 'lamp off');
  L2('radio_sh', 'l_radio_sh'); L2('radio', 'l_radio');
  for (const k of ['st1', 'st2']) {
    const el = L2(k, 'l_' + k, sess.torn.has(k) ? 'off' : '');
    const tx = box(h('div', { class: 'st-text ' + (k === 'st2' ? 's2' : '') }), LAY[k]);
    if (k === 'st1') tx.textContent = L.scene.st1Short;
    else tx.append(h('span', { class: 'norm' }, L.scene.st2.split('\n').slice(0, 2).join('\n')), h('span', { class: 'o' }, L.scene.st2Obs));
    if (sess.torn.has(k)) tx.classList.add('off');
    layers[k + 't'] = tx; tx.style.opacity = sess.torn.has(k) ? 0 : 1; scene.append(tx);
  }
  scene.append(h('div', { class: 'obs-veil' }));
  // hotspots
  for (const s of HS()) {
    const b = h('button', { class: 'hs' + (s.layer ? '' : ' zone') + (s.down ? ' tipdown' : ''), 'aria-label': L.ui.tips[s.tip], 'data-id': s.id },
      h('span', { class: 'tip' }, L.ui.tips[s.tip]), h('span', { class: 'dot' }));
    box(b, s.b);
    if (['keyboard', 'frames3', 'flag', 'shelf', 'drawerR'].includes(s.id)) b.querySelector('.dot').remove();
    b.addEventListener('click', () => { s.go ? openOv(s.go) : s.act(); dotsTap(); });
    if (s.layer) {
      b.addEventListener('pointerenter', () => layers[s.layer === 'folder0' ? 'folder' + sess.folder : (s.layer === 'mug' && sess.spilled ? 'mug_spill' : s.layer)]?.classList.add('hl'));
      b.addEventListener('pointerleave', () => $$('.layer.hl', scene).forEach(l => l.classList.remove('hl')));
    }
    scene.append(b);
  }
  updateFrames();
}
function tallySVG() {
  let p = '', x = 10;
  for (let g = 0; g < 4; g++) { for (let i = 0; i < 4; i++) p += `M${x + i * 9} 20 L${x + i * 9 + 2} 70 `; p += `M${x - 6} 60 L${x + 34} 28 `; x += 56; }
  p += `M${x} 20 L${x + 2} 70 `;
  return `<svg viewBox="0 0 250 90" width="100%" height="100%"><path d="${p}" stroke="#7a0d0d" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`;
}
function updateFrames() {
  const n = achCount(), all = n >= L.ledger.list.length;
  [['c1', 5], ['c2', 10], ['c3', 15]].forEach(([c, min]) => { const el = $('.frame-art.' + c, scene); if (el) { el.classList.toggle('on', n >= min); el.classList.toggle('gold', all); } });
}
function layout() {
  const aw = stage.clientWidth, ah = stage.clientHeight;
  const sh = Math.max(ah, Math.min(ah / 0.82, aw / RATIO)), sw = sh * RATIO;
  scene.style.width = sw + 'px'; scene.style.height = sh + 'px';
  if (!layout.done && sw > aw) scroller.scrollLeft = sw * 0.36 - aw / 2;
  layout.done = true;
}
let dotTaps = 0;
function dotsTap() { if (isTouch && ++dotTaps >= 5) document.body.classList.remove('dots'); }

/* scene actions */
function cigsClick() {
  sess.cigs = (sess.cigs || 0) + 1;
  note(L.scene.cigs[(sess.cigs - 1) % L.scene.cigs.length]);
  click(); if (sess.cigs >= 5) ach('cigs');
}
function framesClick() { note(achCount() ? L.scene.framesSome : L.scene.frames); openOv('ledger'); }
function mugClick() {
  if (!sess.spilled) {
    sess.spilled = true; snd('mug', 0.8); layers.mug.classList.add('off'); layers.mug_spill.classList.remove('off');
    note(rnd(L.scene.mugSpill)); ach('spill');
  } else { sess.spilled = false; layers.mug.classList.remove('off'); layers.mug_spill.classList.add('off'); note(L.scene.mugBack); click(); }
  $$('.layer.hl', scene).forEach(l => l.classList.remove('hl'));
}
function stickerClick(k) {
  if (sess.torn.has(k)) return;
  sess.stClicks[k] = (sess.stClicks[k] || 0) + 1;
  if (sess.stClicks[k] === 1) { note(k === 'st2' && sess.obs ? L.scene.st2Obs : L.scene[k]); click(); return; }
  sess.torn.add(k); snd('paper', 0.5);
  layers[k].classList.add('torn'); layers[k + 't'].classList.add('torn');
  setTimeout(() => { layers[k].classList.add('off'); layers[k + 't'].style.opacity = 0; }, 900);
  const btn = $(`.hs[data-id="${k}"]`, scene); if (btn) btn.remove();
  note(L.scene.torn);
  if (sess.torn.size >= 2) ach('stickers');
}
function setObs(on, byUser) {
  sess.obs = on; document.body.classList.toggle('obs', on);
  updateBadge(); radioApply();
  if (byUser) { click(); note(on ? L.scene.lampOn : L.scene.lampOff); ach(on ? 'lamp' : 'logic'); if (on) { noiseBurst(.6, .08); flicker(); } }
  if (cur && ['map', 'radio'].includes(cur.id)) renderCur();
}
function flicker() { scene.classList.remove('flicker'); void scene.offsetWidth; scene.classList.add('flicker'); setTimeout(() => scene.classList.remove('flicker'), 750); }
function updateBadge() {
  const b = $('#pathBadge');
  b.innerHTML = ''; b.append(h('img', { src: `assets/img/${sess.obs ? 'ic_obs' : 'ic_skep'}.webp`, alt: '' }), h('span', {}, sess.obs ? L.ui.pathObs : L.ui.pathSkep));
  b.setAttribute('aria-label', (sess.obs ? L.ui.pathObs : L.ui.pathSkep));
}
async function openCaseAnimated() {
  if (sess.folder) return;
  snd('paper', 0.5);
  for (const f of [1, 2]) { await sleep(120); layers['folder' + (f - 1)].classList.add('off'); layers['folder' + f].classList.remove('off'); sess.folder = f; }
  await sleep(220);
  openOv('case');
}
function resetFolder() { if (!layers.folder0) return; ['folder1', 'folder2'].forEach(k => layers[k].classList.add('off')); layers.folder0.classList.remove('off'); sess.folder = 0; }
function openNapkins() {
  snd('paper', 0.45);
  const cat = `<svg viewBox="0 0 120 120" fill="none" stroke="#2f4a6d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 92c-6-24 2-46 22-52M30 40l6-18 12 14M84 40l-6-18-12 14"/><ellipse cx="57" cy="58" rx="27" ry="22"/><circle cx="47" cy="55" r="2.5" fill="#2f4a6d"/><circle cx="67" cy="55" r="2.5" fill="#2f4a6d"/><path d="M54 63l3 3 3-3M57 66v3M52 70c3 3 7 3 10 0M30 62H14M30 67l-14 4M84 62h16M84 67l14 4M40 80c-4 10-2 18 6 20h30c10-2 12-10 8-20"/><path d="M84 92c12 0 20-8 16-20" /></svg>`;
  const mug = `<svg viewBox="0 0 120 120" fill="none" stroke="#7a2d2d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 44h50v38c0 12-10 18-25 18S30 94 30 82z"/><path d="M80 52c14 0 14 22 0 22"/><path d="M44 36c-4-8 4-10 0-18M56 36c-4-8 4-10 0-18M68 36c-4-8 4-10 0-18"/><path d="M42 66c4 4 22 4 26 0" /><text x="36" y="114" font-family="Caveat, cursive" font-size="14" fill="#7a2d2d" stroke="none">Р.Л. 7:02</text></svg>`;
  modal(h('div', {},
    h('h3', {}, L.scene.napkinTitle),
    h('div', { class: 'napkins' }, h('div', { class: 'napkin', html: cat }), h('div', { class: 'napkin', html: mug })),
    h('p', { class: 'hand', style: { color: '#1f3157' } }, L.scene.napkinNote)));
  ach('napkin');
}

/* ---------------- walkie ---------------- */
let walkieTok = 0;
async function walkie() {
  const lay = layers.radio, sh = layers.radio_sh;
  lay.classList.remove('shake'); void lay.offsetWidth; lay.classList.add('shake'); sh.style.opacity = 0;
  setTimeout(() => { lay.classList.remove('shake'); sh.style.opacity = 1; }, 1850);
  snd('radio', 0.55);
  S.walkie++; save(); if (S.walkie >= 5) ach('walkie');
  const useObs = sess.obs && Math.random() < 0.5;
  const lines = useObs ? L.walkie.obs : L.walkie.lines[(S.walkie - 1) % L.walkie.lines.length];
  const tok = ++walkieTok;
  $('.walkie-log')?.remove();
  const log = h('div', { class: 'walkie-log' + (useObs ? ' obs' : ''), role: 'status' }, h('div', { class: 'ch' }, h('span', {}, 'CH 2 · RCSO'), h('span', {}, '▮▮▮▯')));
  document.body.append(log);
  for (const [who, text] of lines) {
    await sleep(500); if (tok !== walkieTok) return;
    const p = h('p', {}, h('b', {}, (L.walkie.names[who] || who) + ': '), '');
    log.append(p);
    for (let i = 1; i <= text.length; i++) { if (tok !== walkieTok) return; p.lastChild.textContent = text.slice(0, i); await sleep(16); }
    if (who === 'x') noiseBurst(.4, .06);
    await sleep(500 + text.length * 18);
  }
  await sleep(3500); if (tok === walkieTok) log.remove();
}

/* ---------------- overlays ---------------- */
let cur = null;
const ROUTES = ['map', 'people', 'case', 'phone', 'pc', 'radio', 'ledger'];
const BUILD = {};
const titleOf = id => ({ map: L.ui.nav.map, people: L.ui.nav.people, case: L.ui.nav.case, phone: L.ui.nav.phone, pc: L.ui.nav.pc, radio: L.ui.nav.radio, ledger: L.ui.nav.ledger }[id]);
function openOv(id, opts, fromRoute) {
  if (id === 'room') { closeOv(); return; }
  if (id === 'play') { openPlay(); return; }
  if (!ROUTES.includes(id)) return;
  if (cur && cur.id === id) { if (opts) { cur.opts = opts; renderCur(); } return; }
  closeOv(true);
  click();
  const x = h('button', { class: 'x', 'aria-label': L.ui.close, html: ICON.x, onclick: () => closeOv() });
  const body = h('div', { class: 'ov-body' });
  const el = h('section', { class: 'ov', id: 'ov-' + id, role: 'dialog', 'aria-modal': 'true', 'aria-label': titleOf(id) },
    h('div', { class: 'ov-head' }, h('h2', {}, titleOf(id)), x), body);
  overlays.append(el);
  cur = { id, el, body, opts: opts || {} };
  BUILD[id](body, cur.opts);
  if (!fromRoute) { try { history.pushState(null, '', '#' + id); } catch (e) { } }
  $$('#nav button').forEach(b => b.setAttribute('aria-current', b.dataset.go === id ? 'true' : 'false'));
  setTimeout(() => x.focus({ preventScroll: true }), 30);
}
function renderCur() { if (!cur) return; const st = cur.body.scrollTop; cur.cleanup?.(); cur.cleanup = null; cur.body.innerHTML = ''; cur.el.querySelector('.ov-head h2').textContent = titleOf(cur.id); BUILD[cur.id](cur.body, cur.opts); cur.body.scrollTop = st; }
function closeOv(silent) {
  if (!cur) return;
  cur.cleanup?.(); const id = cur.id; cur.el.remove(); cur = null;
  if (id === 'case') resetFolder();
  if (!silent && location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } }
  $$('#nav button').forEach(b => b.setAttribute('aria-current', 'false'));
}
function route() { const id = location.hash.slice(1); if (ROUTES.includes(id)) { if (!cur || cur.id !== id) openOv(id, null, true); } else if (cur) closeOv(true); }
function modal(content) {
  const m = h('div', { class: 'modal', onclick: e => { if (e.target === m) m.remove(); } },
    h('div', { class: 'modal-in paper' }, h('button', { class: 'x', 'aria-label': L.ui.close, html: ICON.x, onclick: () => m.remove() }), content));
  document.body.append(m); return m;
}
const storeBtns = () => [
  h('a', { class: 'store', href: D.links.ios, target: '_blank', rel: 'noopener', html: ICON.phoneApp + '<span>App Store</span>' }),
  h('a', { class: 'store', href: D.links.android, target: '_blank', rel: 'noopener', html: ICON.phoneApp + '<span>Google Play</span>' })
];
function openPlay() {
  click();
  modal(h('div', {}, h('h3', {}, L.ui.playTitle), h('p', {}, L.ui.playText), h('div', { class: 'stores' }, storeBtns()),
    h('a', { class: 'linkbtn', href: D.links.tg, target: '_blank', rel: 'noopener', style: { color: 'var(--ink)', background: 'transparent', borderColor: 'rgba(34,26,20,.35)' }, html: ICON.tg + '<span>' + esc(L.ui.tgBtn) + '</span>' })));
}

/* ---------------- MAP ---------------- */
const MAPXY = { diner: [826, 300], motel: [890, 352], sheriff: [556, 300], bar: [500, 392], house: [408, 488], elm: [708, 546], forest: [226, 214] };
const MAPFOG = [[330, 236], [128, 350], [62, 414], [640, 444], [650, 248], [600, 396]];
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mapSVG() {
  const r = mulberry(11), lb = L.map.labels;
  const inTown = (x, y) => ((x - 570) ** 2) / (300 ** 2) + ((y - 410) ** 2) / (190 ** 2) < 1;
  const roadY = x => 318 + (1000 - x) * 0.054;
  let trees = '';
  for (let i = 0, n = 0; i < 2600 && n < 560; i++) {
    const x = r() * 1000, y = 70 + r() * 630;
    if (inTown(x, y) || Math.abs(y - roadY(x)) < 16 || (x > 770 && y > 260 && y < 400) || (x < 330 && y > 545) || (x > 860 && y > 560)) continue;
    const s = 3.5 + r() * 2.5;
    trees += `M${x.toFixed(1)} ${(y - s * 1.9).toFixed(1)}l${-s} ${s * 2.6}h${s * 2}z`; n++;
  }
  let mts = 'M0 70'; for (let x = 0; x <= 1000; x += 40) mts += ` L${x + 20} ${28 + r() * 22} L${x + 40} ${58 + r() * 14}`;
  let blocks = '';
  for (let x = 400; x < 740; x += 46) for (let y = 282; y < 520; y += 38) {
    if (!inTown(x + 20, y + 15) || Math.abs(y + 15 - roadY(x)) < 22 || r() < 0.18) continue;
    blocks += `<rect x="${x}" y="${y}" width="38" height="30" rx="1"/>`;
  }
  let elm = ''; for (let i = 0; i < 9; i++) elm += `<rect x="${640 + r() * 110}" y="${500 + r() * 50}" width="${8 + r() * 8}" height="${7 + r() * 6}" transform="rotate(${(r() * 30 - 15).toFixed(0)} 690 525)"/>`;
  return `<svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="#8a7a5e" stroke-width="1" opacity=".35"/></pattern></defs>
  <path d="${mts} L1000 0 L0 0Z" fill="url(#hatch)" stroke="#6b5b43" stroke-width="1.5"/>
  <text x="500" y="22" text-anchor="middle" font-size="13" letter-spacing="6" opacity=".7">${esc(lb.mountains.toUpperCase())}</text>
  <path d="${trees}" fill="#5a6a48" opacity=".72"/>
  <path d="M1000 120 C880 150 830 228 712 240 S520 208 430 252 S262 330 180 420 S70 560 0 610" fill="none" stroke="#7f98a3" stroke-width="9" stroke-linecap="round" opacity=".75"/>
  <path d="M1000 120 C880 150 830 228 712 240 S520 208 430 252 S262 330 180 420 S70 560 0 610" fill="none" stroke="#b9cbd0" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <text font-size="13" font-style="italic" letter-spacing="2" fill="#4c6670" transform="translate(262 342) rotate(-38)">${esc(lb.river)}</text>
  <g fill="#d9c8a3" stroke="#a48a63" stroke-width="1">${blocks}</g>
  <g fill="#bfae8a" stroke="#8e7655" stroke-width="1">${elm}</g>
  <path d="M470 334 C430 270 420 200 370 150 S330 100 322 86" fill="none" stroke="#7d6648" stroke-width="2" stroke-dasharray="6 5"/>
  <text font-size="12" letter-spacing="1" transform="translate(386 214) rotate(-62)">${esc(lb.north)}</text>
  <path d="M314 80l14 14M328 80l-14 14" stroke="#6b2b22" stroke-width="2.5"/>
  <text x="300" y="118" font-size="12" font-style="italic" text-anchor="middle" opacity=".7">${esc(lb.mill)}</text>
  <path d="M1000 318 L860 322 C760 326 700 334 620 338 L380 348 C300 352 200 362 0 372" fill="none" stroke="#7a6347" stroke-width="12" stroke-linecap="round"/>
  <path d="M1000 318 L860 322 C760 326 700 334 620 338 L380 348 C300 352 200 362 0 372" fill="none" stroke="#e8d9b6" stroke-width="8"/>
  <path d="M1000 318 L860 322 C760 326 700 334 620 338 L380 348 C300 352 200 362 0 372" fill="none" stroke="#a5875f" stroke-width="1.2" stroke-dasharray="10 8"/>
  <path d="M520 342 L520 520 M612 338 L640 520 M430 346 L420 500 M520 430 L700 470" fill="none" stroke="#a48a63" stroke-width="3"/>
  <g transform="translate(948 286)"><path d="M-22 -14h44v20c0 10-22 16-22 16s-22-6-22-16z" fill="#efe3c6" stroke="#5a4630" stroke-width="1.5"/><text y="2" text-anchor="middle" font-size="12" font-weight="600">${esc(lb.hwy)}</text></g>
  <text x="990" y="394" text-anchor="end" font-size="11" font-style="italic" opacity=".75">${esc(lb.strait)} →</text>
  <text x="600" y="330" font-size="11" letter-spacing="2" opacity=".75">${esc(lb.main)}</text>
  <text x="640" y="430" font-size="15" letter-spacing="8" opacity=".35">${esc(lb.center)}</text>
  <text x="730" y="586" font-size="12" font-style="italic">${esc(lb.elm)}</text>
  <text x="176" y="176" font-size="26" letter-spacing="14" opacity=".55">${esc(lb.forest)}</text>
  <text x="800" y="628" font-size="22" letter-spacing="12" opacity=".5">${esc(lb.forest)}</text>
  <g fill="#7a6040"><rect x="806" y="306" width="22" height="12"/><rect x="872" y="358" width="34" height="10"/></g>
  <g transform="translate(940 610)" fill="none" stroke="#4b3b29" stroke-width="1.5"><circle r="30"/><circle r="3" fill="#4b3b29"/><path d="M0 -38 L7 0 L0 38 L-7 0Z" fill="#e4d7b8"/><path d="M0 -38 L7 0 L-7 0Z" fill="#4b3b29"/><text y="-44" text-anchor="middle" font-size="13" stroke="none" fill="#4b3b29">N</text></g>
  <g transform="translate(340 668)"><path d="M0 0h120M0 -5v10M60 -5v10M120 -5v10" stroke="#4b3b29" stroke-width="2"/><rect x="0" y="-3" width="60" height="6" fill="#4b3b29"/><text x="0" y="20" font-size="11" text-anchor="middle">0</text><text x="60" y="20" font-size="11" text-anchor="middle">½</text><text x="120" y="20" font-size="11" text-anchor="middle">1 mi</text></g>
  <g transform="translate(24 568)"><rect width="282" height="112" fill="#efe3c6" stroke="#4b3b29" stroke-width="2"/><rect x="5" y="5" width="272" height="102" fill="none" stroke="#4b3b29" stroke-width="1"/>
  <text x="141" y="50" text-anchor="middle" font-size="32" font-weight="600" letter-spacing="6" textLength="246" lengthAdjust="spacingAndGlyphs">${esc(L.map.title.toUpperCase())}</text>
  <text x="141" y="74" text-anchor="middle" font-size="10" textLength="250" lengthAdjust="spacingAndGlyphs">${esc(L.map.subtitle)}</text>
  <text x="141" y="94" text-anchor="middle" font-size="11" letter-spacing="2" opacity=".75">${esc(L.map.pop)} · 1:24 000</text></g>
  </svg>`;
}
BUILD.map = (body, opts) => {
  const wrap = h('div', { class: 'map-wrap' });
  const paper = h('div', { class: 'map-paper', html: mapSVG() });
  MAPFOG.forEach(([x, y], i) => { const w = i === 0 ? 16 : 11, hh = i === 0 ? 22 : 15; paper.append(h('div', { class: 'fogblob', style: { left: (x / 10 - w / 2) + '%', top: (y / 7 - hh / 2) + '%', width: w + '%', height: hh + '%', animationDelay: (-x % 7) + 's' } })); });
  [[-6, -4, 22, 30], [86, -8, 22, 30], [-8, 78, 20, 30]].forEach(([x, y, w, hh]) => paper.append(h('div', { class: 'fogblob', style: { left: x + '%', top: y + '%', width: w + '%', height: hh + '%', opacity: .7 } })));
  const night = h('div', { class: 'map-night' }); paper.append(night);
  paper.addEventListener('pointermove', e => { const r = paper.getBoundingClientRect(); night.style.setProperty('--mx', (e.clientX - r.left) + 'px'); night.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  paper.addEventListener('pointerleave', () => { night.style.setProperty('--mx', '-500px'); });
  const card = h('aside', { class: 'loc-card paper', 'aria-live': 'polite' });
  const pins = {};
  L.map.places.forEach((p, i) => {
    const [x, y] = MAPXY[p.id];
    const b = h('button', { class: 'pin' + (S.seen.places.includes(p.id) ? ' seen' : ''), style: { left: x / 10 + '%', top: y / 7 + '%' }, 'aria-label': p.name, onclick: () => { click(); show(p.id); } }, h('span', {}, h('i', {}, i + 1)));
    pins[p.id] = b; paper.append(b);
  });
  MAPFOG.forEach(([x, y]) => paper.append(h('button', { class: 'pin fog', style: { left: x / 10 + '%', top: y / 7 + '%' }, 'aria-label': '?', onclick: () => { click(); note(rnd(L.map.fog)); noiseBurst(.25, .03); } }, h('span'))));
  function show(id) {
    const p = L.map.places.find(q => q.id === id); if (!p) return;
    Object.values(pins).forEach(b => b.removeAttribute('aria-current')); pins[id].setAttribute('aria-current', 'true'); pins[id].classList.add('seen');
    if (!S.seen.places.includes(id)) { S.seen.places.push(id); save(); }
    if (L.map.places.every(q => S.seen.places.includes(q.id))) ach('map');
    cur.opts.place = id;
    card.innerHTML = '';
    const fx = { diner: 'fx-neon', bar: 'fx-pulse', sheriff: 'fx-tube', house: 'fx-tube', elm: 'fx-pulse' }[id] || '';
    const ph = h('div', { class: 'ph' });
    if (id === 'motel') ph.append(h('div', { class: 'fogged' }, L.map.noPhoto));
    else { ph.append(h('img', { src: `assets/img/loc_${id}.webp`, alt: p.name, class: fx, loading: 'lazy' })); if (id === 'forest' || id === 'house') ph.append(h('div', { class: 'mist' })); }
    card.append(ph, h('h3', {}, p.name), h('div', { class: 'sub' }, p.sub), h('p', { class: 'txt' }, p.text));
    if (p.obs && sess.obs) card.append(h('div', { class: 'obs' }, h('small', {}, L.map.obsLabel), p.obs));
  }
  wrap.append(h('div', {}, paper, h('p', { class: 'map-hint' }, (isTouch ? L.map.hintTouch : L.map.hint) + ' · ' + L.map.legend)), card);
  body.append(wrap);
  show(opts.place || 'diner');
};

/* ---------------- PEOPLE ---------------- */
const DOODLE = {
  rose: { s: { left: '36%', top: '80.5%', width: '28%' }, svg: '<svg viewBox="0 0 100 60" fill="none" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"><circle cx="40" cy="30" r="22"/><circle cx="32" cy="24" r="2" fill="#1b1b1b"/><circle cx="48" cy="24" r="2" fill="#1b1b1b"/><path d="M28 36c6 7 18 7 24 0"/><path d="M8 52L92 6" stroke-width="4"/></svg>' },
  tyler: { s: { left: '30%', top: '1%', width: '40%' }, svg: '<svg viewBox="0 0 100 50" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M12 42L8 12l22 18L50 4l20 26 22-18-4 30z"/><circle cx="8" cy="10" r="3"/><circle cx="50" cy="3" r="3"/><circle cx="92" cy="10" r="3"/><path d="M14 42h72"/></svg>' },
  carrie: { s: { left: '5%', top: '58%', width: '22%' }, svg: '<svg viewBox="0 0 60 60" fill="none" stroke="#2f5a3b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22l3-12 8 8M46 22l-3-12-8 8"/><ellipse cx="30" cy="30" rx="17" ry="14"/><circle cx="24" cy="28" r="1.6" fill="#2f5a3b"/><circle cx="36" cy="28" r="1.6" fill="#2f5a3b"/><path d="M28 33l2 2 2-2M14 32H4M14 35l-9 3M46 32h10M46 35l9 3"/><path d="M22 44c-2 6 0 10 4 12h8c4-2 6-6 4-12"/></svg>' },
  ethan: { s: { left: '76%', top: '82%', width: '18%' }, svg: '<svg viewBox="0 0 60 60" fill="none" stroke="#2a2a2a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M44 6a12 12 0 00-12 16L8 46a5 5 0 007 7l24-24A12 12 0 0054 16l-7 7-6-2-2-6 7-7"/></svg>' },
  pamela: { s: { left: '68%', top: '6%', width: '26%' }, svg: '<svg viewBox="0 0 80 60"><path d="M10 30c8-14 22-14 30-4 8-10 22-10 30 4-8 2-18 4-30 2-12 2-22 0-30-2z" fill="#c8102e" opacity=".85"/><path d="M12 32c10 12 46 12 56 0-10 4-20 6-28 6s-18-2-28-6z" fill="#a50d26" opacity=".85"/></svg>', extra: '<svg viewBox="0 0 120 30" style="position:absolute;left:6%;top:93%;width:40%"><path d="M10 12c0-6 8-6 8 0 0-6 8-6 8 0 0 6-8 10-8 12-0-2-8-6-8-12z" fill="none" stroke="#e0218a" stroke-width="2.5"/><path d="M50 10c0-6 8-6 8 0 0-6 8-6 8 0 0 6-8 10-8 12 0-2-8-6-8-12z" fill="none" stroke="#7b2fbe" stroke-width="2.5"/><path d="M90 14c0-6 8-6 8 0 0-6 8-6 8 0 0 6-8 10-8 12 0-2-8-6-8-12z" fill="none" stroke="#1e7bd8" stroke-width="2.5"/></svg>' },
  marshall: { s: { left: '10%', top: '96%', width: '80%' }, svg: '<svg viewBox="0 0 200 10" fill="none" stroke="#111" stroke-width="2"><path d="M0 5l10-3 8 5 12-4 9 4 14-3 10 4 12-5 9 5 14-4 11 3 13-4 9 5 12-3 10 4 15-4 12 3"/></svg>' },
  judy: { s: { left: '5%', top: '4%', width: '20%' }, svg: '<svg viewBox="0 0 60 60"><defs><linearGradient id="gj" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c4"/><stop offset=".5" stop-color="#f3c330"/><stop offset="1" stop-color="#c8901a"/></linearGradient></defs><path d="M30 4l7 16 17 2-13 11 4 17-15-9-15 9 4-17L6 22l17-2z" fill="url(#gj)" stroke="#a87412" stroke-width="1.5"/><circle cx="22" cy="24" r="1.4" fill="#fff"/><circle cx="36" cy="30" r="1.2" fill="#fff"/><circle cx="30" cy="20" r="1" fill="#fff"/></svg>' },
  candice: { s: { left: '80%', top: '86%', width: '12%' }, svg: '<svg viewBox="0 0 40 36"><path d="M20 34C4 22 2 14 6 8s12-6 14 2c2-8 10-8 14-2s2 14-14 26z" fill="#ff5fa2" opacity=".85"/></svg>' }
};
BUILD.people = (body, opts) => {
  const list = L.people;
  let sel = opts.id || S.lastPerson || 'rose';
  const wrap = h('div', { class: 'files' });
  const tabs = h('nav', { class: 'file-tabs', 'aria-label': L.ui.nav.people });
  const sheet = h('article', { class: 'file-sheet paper' });
  list.forEach(p => tabs.append(h('button', { 'data-id': p.id, class: S.seen.people.includes(p.id) ? 'seen' : '', onclick: () => { render(p.id); snd('paper', 0.35); } }, p.name.replace(/ «.+»/, '').replace(/ “.+”/, ''))));
  function render(id) {
    sel = id; cur.opts.id = id; S.lastPerson = id;
    if (!S.seen.people.includes(id)) S.seen.people.push(id);
    save();
    if (list.every(p => S.seen.people.includes(p.id))) ach('people');
    $$('button', tabs).forEach(b => { b.setAttribute('aria-current', b.dataset.id === id ? 'true' : 'false'); if (S.seen.people.includes(b.dataset.id)) b.classList.add('seen'); });
    const p = list.find(x => x.id === id);
    sheet.innerHTML = '';
    const pol = h('figure', { class: 'polaroid', style: { margin: 0 } }, h('img', { src: `assets/img/p_${id}.webp`, alt: p.name }));
    if (p.cap) pol.append(h('figcaption', { class: 'cap ' + id }, p.cap));
    if (p.capV) pol.append(h('span', { style: { position: 'absolute', right: '1.5%', top: '42%', writingMode: 'vertical-rl', font: '600 6.6cqw/1 var(--f-hand)', color: '#b0185a', whiteSpace: 'nowrap' } }, p.capV));
    const dd = DOODLE[id]; if (dd) { pol.append(h('div', { class: 'doodle', style: dd.s, html: dd.svg })); if (dd.extra) pol.insertAdjacentHTML('beforeend', dd.extra); }
    const rows = h('dl', { class: 'rows' });
    p.rows.forEach(([k, v, kind]) => rows.append(h('div', {}, h('dt', {}, k), h('dd', {}, kind === 'insta' ? h('a', { href: D.links.insta, target: '_blank', rel: 'noopener' }, v) : v))));
    const head = h('div', { class: 'sheet-head' }, h('h3', {}, p.name), h('div', { class: 'sub' }, p.head || L.ui.fileBy), rows);
    if (p.body) head.append(h('p', { class: 'body-typed' }, p.body));
    if (p.rows2) { const r2 = h('dl', { class: 'rows', style: { marginTop: '14px' } }); p.rows2.forEach(([k, v]) => r2.append(h('div', {}, h('dt', {}, k), h('dd', {}, v)))); head.append(r2); }
    const nt = h('div', { class: 'note-hand' }, h('b', {}, p.noteLabel)); p.note.split('\n').forEach(par => nt.append(h('p', {}, par)));
    sheet.append(h('div', { class: 'clip' }), h('span', { class: 'stamp' }, L.ui.confidential), h('div', { class: 'sheet-top' }, pol, head), nt);
  }
  wrap.append(tabs, sheet); body.append(wrap); render(sel);
};

/* ---------------- CASE ---------------- */
BUILD.case = (body, opts) => {
  ach('case');
  let ep = opts.ep ?? 0;
  const wrap = h('div', { class: 'case-wrap' });
  const stageEl = h('div', { class: 'case-stage' }), mob = h('div', { class: 'case-mobile' });
  wrap.append(stageEl, mob); body.append(wrap);
  const photoFor = i => i === 2 ? h('div', { class: 'flap-photo' }, h('div', { class: 'fogged' }, '?'), h('span', {}, '#3')) :
    h('div', { class: 'flap-photo' }, h('img', { src: `assets/img/loc_${i === 0 ? 'diner' : 'bar'}.webp`, alt: '' }), h('span', {}, '#' + (i + 1)));
  const card = () => h('button', { class: 'bizcard', onclick: () => { note(L.case.card); ach('card'); click(); } }, h('b', {}, 'NATHAN HUGHES'), h('i', {}, 'Attorney at Law'), h('small', {}, 'Seattle, WA · 555-0131'));
  function lockedTry() {
    S.classified = (S.classified || 0) + 1; save();
    sess.cl = (sess.cl || 0) + 1;
    note(L.case.lockedTries[(sess.cl - 1) % L.case.lockedTries.length]);
    noiseBurst(.2, .04);
    if (S.classified >= 5) ach('classified');
  }
  function pageContent(i, mobile) {
    const e = L.case.eps[i], out = [];
    if (mobile || i === 2) out.push(h('span', { class: 'stamp' }, e.stamp)); out.push(h('h3', {}, e.n), h('h4', {}, e.t));
    e.text.split('\n').forEach(t => out.push(h('p', {}, t)));
    if (i < 2) { out.push(h('p', { class: 'path' }, L.case.path), h('div', { class: 'stores' }, storeBtns())); }
    else out.push(h('div', { class: 'stores' }, h('a', { class: 'store', href: D.links.tg, target: '_blank', rel: 'noopener', html: ICON.tg + '<span>' + esc(L.ui.tgBtn) + '</span>' })));
    return out;
  }
  function render(i) {
    if (i === 2 && ep === 2) lockedTry();
    ep = i; cur.opts.ep = i;
    stageEl.innerHTML = '';
    const flap = h('div', { class: 'case-flap' }, photoFor(i)); if (i < 2) flap.append(h('span', { class: 'stamp flap-stamp' }, L.case.eps[i].stamp)); if (i === 1) flap.append(card());
    const page = h('div', { class: 'case-page' }, ...pageContent(i));
    if (i === 2) { const lk = h('button', { class: 'locked-3', onclick: lockedTry }, h('span', { class: 'stamp' }, L.case.eps[2].stamp)); page.append(lk); }
    const tabs = h('div', { class: 'case-tabs' }, L.case.tabs.map((t, k) => h('button', { 'aria-current': k === i ? 'true' : 'false', onclick: () => { snd('paper', 0.4); render(k); } }, t)));
    stageEl.append(flap, page, tabs);
    mob.innerHTML = '';
    const mt = h('div', { class: 'cm-tabs' }, L.case.tabs.map((t, k) => h('button', { 'aria-current': k === i ? 'true' : 'false', onclick: () => { snd('paper', 0.4); render(k); } }, t)));
    const row = h('div', { class: 'cm-row' }, photoFor(i)); if (i === 1) row.append(card());
    const sh = h('div', { class: 'cm-sheet paper' }, row, ...pageContent(i, true));
    if (i === 2) sh.addEventListener('click', e => { if (!e.target.closest('a')) lockedTry(); });
    mob.append(mt, sh);
  }
  render(ep);
};

/* ---------------- PHONE ---------------- */
const PH = { state: 'idle', digits: '', last: '', tok: 0, ringing: null, inCount: 0, inT: null, nightUsed: {}, ui: null };
const KEYS = { 1: [877, 497], 2: [953, 497], 3: [1030, 497], 4: [877, 549], 5: [953, 549], 6: [1030, 549], 7: [877, 601], 8: [953, 601], 9: [1030, 601], '*': [877, 654], 0: [953, 654], '#': [1030, 654] };
const PW = 1445, PHH = 1088;
const SPEED = ['5550142', '5550163', '101', '911', '', ''];
BUILD.phone = body => {
  const wrap = h('div', { class: 'phone-wrap' });
  const img = h('div', { class: 'phone-img' }, h('img', { src: 'assets/img/phone_top.webp', alt: L.phone.title }));
  const lcd = h('div', { class: 'lcd', 'aria-live': 'polite' }, h('div', { class: 'r1' }, h('span', { class: 'st' }), h('span', { class: 'tm' })), h('div', { class: 'r2' }));
  img.append(lcd);
  Object.entries(KEYS).forEach(([k, [x, y]]) => img.append(h('button', { class: 'pkey', 'data-k': k, 'aria-label': k, style: { left: x / PW * 100 + '%', top: y / PHH * 100 + '%' }, onclick: () => press(k) })));
  [[875, 447, 56, 'SPKR'], [1006, 447, 56, 'MSG'], [1130, 702, 66, 'VOL ±']].forEach(([x, y, w, t]) => img.append(h('button', { class: 'pmini', style: { left: (x - w / 2) / PW * 100 + '%', top: y / PHH * 100 + '%', width: w / PW * 100 + '%' }, onclick: () => { click(); lcdMsg(t); } }, t)));
  [[780, 525, 'hold'], [780, 569, 'mute'], [782, 614, 'redial'], [785, 658, 'trans'], [787, 702, 'conf']].forEach(([x, y, f]) => img.append(h('button', { class: 'pkey', 'aria-label': f, style: { left: x / PW * 100 + '%', top: y / PHH * 100 + '%', width: '4.4%', height: '2.8%', margin: '-1.4% 0 0 -2.2%' }, onclick: () => { if (f === 'redial') { if (PH.last) { PH.digits = PH.last; doCall(); } } else { click(); lcdMsg(f.toUpperCase()); } } })));
  const sp = h('div', { class: 'speed' });
  L.phone.speed.forEach((n, i) => sp.append(h('button', { 'aria-label': n || '—', onclick: () => { if (SPEED[i]) { PH.digits = SPEED[i]; doCall(); } else click(); } }, n)));
  img.append(sp, h('div', { class: 'led' + (PH.ringing ? ' on' : '') }), h('button', { class: 'ph-hand', 'aria-label': L.phone.hang, onclick: () => hang() }));
  const crop = h('div', { class: 'phone-crop' }, img);
  const ctr = h('div', { class: 'ph-controls' });
  const subs = h('div', { class: 'subs', 'aria-live': 'polite' }, h('p', { class: 'hintline' }, isTouch ? L.phone.hintTouch : L.phone.hint));
  wrap.append(crop, ctr, subs); body.append(wrap);
  PH.ui = { lcd, ctr, subs, img };
  renderCtr(); renderLCD();
  const onKey = e => {
    if (!cur || cur.id !== 'phone' || e.target.closest('input,textarea')) return;
    if (/^[0-9*#]$/.test(e.key)) { press(e.key); e.preventDefault(); }
    else if (e.key === 'Enter') { if (PH.ringing) answer(); else doCall(); }
    else if (e.key === 'Backspace') { PH.digits = PH.digits.slice(0, -1); renderLCD(); }
  };
  document.addEventListener('keydown', onKey);
  const tick = setInterval(renderLCD, 15000);
  cur.cleanup = () => { document.removeEventListener('keydown', onKey); clearInterval(tick); if (PH.state !== 'idle') hang(true); PH.ui = null; };
};
function renderCtr() {
  const u = PH.ui; if (!u) return; u.ctr.innerHTML = '';
  if (PH.ringing) u.ctr.append(h('button', { class: 'pbtn go', onclick: answer }, L.phone.answer), h('button', { class: 'pbtn end', onclick: () => { stopRing(); hang(); } }, L.phone.hang));
  else if (PH.state === 'idle') u.ctr.append(h('button', { class: 'pbtn go', onclick: doCall }, L.phone.call), h('button', { class: 'pbtn', onclick: () => { PH.digits = PH.digits.slice(0, -1); renderLCD(); click(); } }, L.phone.clear));
  else u.ctr.append(h('button', { class: 'pbtn end', onclick: () => hang() }, L.phone.hang));
}
const pad2 = n => String(n).padStart(2, '0');
function renderLCD(st) {
  const u = PH.ui; if (!u) return;
  const d = new Date();
  $('.tm', u.lcd).textContent = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  const status = st || ({ idle: PH.digits ? L.phone.dialing : L.phone.ready, calling: L.phone.calling, connected: PH.who ? (L.phone.names[PH.who] || '') : L.phone.connected }[PH.state]) || '';
  $('.st', u.lcd).textContent = PH.ringing ? L.phone.incoming : status;
  $('.r2', u.lcd).textContent = PH.ringing ? (L.phone.names[PH.ringing] || L.phone.unknown) : fmtNum(PH.state === 'idle' ? PH.digits : PH.dialed || '');
  u.lcd.classList.toggle('lit', PH.state !== 'idle' || !!PH.digits || !!PH.ringing);
  u.lcd.classList.toggle('blink', !!PH.ringing);
  $('.led', u.img)?.classList.toggle('on', !!PH.ringing);
}
function lcdMsg(t) { renderLCD(t); setTimeout(() => renderLCD(), 1200); }
const fmtNum = d => d.length === 7 ? d.slice(0, 3) + '-' + d.slice(3) : d;
function press(k) {
  if (PH.ringing) return;
  if (PH.state !== 'idle') { tone(DTMF[k], .12, .05); return; }
  if (PH.digits.length >= 12) return;
  PH.digits += k; tone(DTMF[k]); renderLCD();
  const b = PH.ui && $(`.pkey[data-k="${CSS.escape(k)}"]`, PH.ui.img); if (b) { b.classList.add('down'); setTimeout(() => b.classList.remove('down'), 140); }
}
function resolveNum(num) {
  const d = num.replace(/\D/g, '');
  if (d === '911') return 'e911'; if (d === '101') return 'sheriff';
  let last = null; if (d.length === 7 && d.startsWith('555')) last = d.slice(3); else if (d.length === 4) last = d;
  if (last) {
    for (const k of ['tyler', 'mom', 'diner', 'nate']) if (D.numbers[k] === last) return k;
    if (last === D.numbers.creepy) return sess.obs ? 'creepy' : 'wrong';
  }
  return Math.random() < 0.3 ? 'lady' : 'wrong';
}
function subLine(speaker, text, cls) {
  const u = PH.ui; if (!u) return null;
  $('.hintline', u.subs)?.remove();
  const p = h('p', { class: cls || '' }); if (speaker != null) p.append(h('b', {}, speaker));
  const span = h('span'); p.append(span); u.subs.append(p);
  while (u.subs.children.length > 6) u.subs.firstElementChild.remove();
  return span;
}
async function typeLine(speaker, text, tok, speed = 20) {
  const span = subLine(speaker, '', ''); if (!span) return;
  const plain = text.replace(/\*/g, '');
  for (let i = 1; i <= plain.length; i++) { if (tok !== PH.tok) return; span.textContent = plain.slice(0, i); await sleep(speed); }
  span.innerHTML = emph(text);
}
function doCall() {
  if (PH.state !== 'idle' || !PH.digits) return;
  const num = PH.digits; PH.last = num; PH.dialed = num; PH.digits = '';
  const who = resolveNum(num); startCall(who, false);
}
async function startCall(who, incoming) {
  const tok = ++PH.tok;
  if (PH.ui) PH.ui.subs.innerHTML = '';
  PH.who = null; PH.state = incoming ? 'connected' : 'calling'; radioApply(); renderCtr(); renderLCD();
  if (!incoming) {
    const a = snd('calling', 0.45);
    await sleep(who === 'wrong' || who === 'lady' ? 1700 : who === 'creepy' ? 2600 : 2200 + Math.random() * 1800);
    stopSnd('calling');
    if (tok !== PH.tok) return;
  }
  PH.state = 'connected'; PH.who = who; renderLCD(); renderCtr();
  const C = L.phone.calls, name = L.phone.names[who];
  let get = null, key = null, glitch = false;
  if (incoming) { get = X => X.incoming[who]; key = { tyler: 'incoming_tyler', diner: 'incoming_diner', mom: 'incoming_mom' }[who] || null; if (who === 'creepy') setTimeout(() => { if (tok === PH.tok) snd('whisper2', 0.75); }, 1300); }
  else if (who === 'wrong') { get = X => X.wrong; key = 'clip_wrong_operator'; }
  else if (who === 'lady') { get = X => X.lady; key = 'clip_wrong_neighbor'; }
  else if (who === 'creepy') { get = X => X.creepy; key = 'call_voice_0117'; }
  else {
    const c = C[who], n = S.calls[who] || 0, vm = VO_MAP[who] || {};
    S.calls[who] = n + 1;
    if (!S.reached.includes(who)) S.reached.push(who);
    save();
    if (new Date().getHours() < 6 && c.night && !PH.nightUsed[who]) { get = X => X[who].night; key = vm.night; PH.nightUsed[who] = 1; }
    else if (who === 'nate' && n >= 3) { get = X => X[who].after; key = 'clip_nate_voicemail'; }
    else if (n < c.seq.length) { get = X => X[who].seq[n]; key = vm.seq && vm.seq[n]; }
    else if (c.pool) { const j = Math.floor(Math.random() * c.pool.length); get = X => X[who].pool[j]; key = vm.pool && vm.pool[j]; }
    else { const j = Math.floor(Math.random() * c.seq.length); get = X => X[who].seq[j]; key = vm.seq && vm.seq[j]; }
    if (['tyler', 'nate', 'mom', 'diner', 'e911', 'sheriff'].every(k => S.reached.includes(k))) ach('book');
    if (who === 'e911' && S.calls.e911 >= 3) ach('e911');
  }
  const lines = get(C), linesEn = get(TX.en.phone.calls) || lines;
  if (!incoming && !['wrong', 'lady', 'creepy'].includes(who)) glitch = sess.obs && Math.random() < 0.3 && !lines.some(l => l.startsWith('{'));
  if (who === 'wrong' || who === 'lady') ach('wrong');
  if (who === 'creepy') ach('creepy');
  let done = null;
  if (key && !S.muted && window.RS_VO && window.RS_VO[key]) done = await runVO(lines, who, name, tok, key, glitch, linesEn);
  if (done === null && tok === PH.tok) done = await runLines(glitch ? [lines[0], ...C.glitch] : lines, who, name, tok);
  if (done && tok === PH.tok && PH.state !== 'idle') { await sleep(600); if (tok === PH.tok) hang(); }
}
const VO_MAP = {
  tyler: { seq: ['call_tyler_1', 'call_tyler_2', 'call_tyler_3'], pool: ['call_tyler_any_1', 'call_tyler_any_2'], night: 'call_tyler_night' },
  nate: { seq: ['call_nate_1', 'call_nate_2', 'call_nate_3'] },
  mom: { seq: ['call_mom_1', 'call_mom_2', 'call_mom_3'], night: 'call_mom_night' },
  diner: { seq: ['call_diner_1', 'call_diner_2', 'call_diner_3'], pool: ['call_diner_any'], night: 'call_diner_night' },
  e911: { seq: ['call_911_1', 'call_911_2', 'call_911_3'] },
  sheriff: { seq: ['call_sheriff_1', 'call_sheriff_2', 'call_sheriff_3_judy'], pool: ['call_sheriff_any'] }
};
const CUTOUT = { tyler: 'clip_cutout_tyler', nate: 'clip_cutout_nate', mom: 'clip_cutout_mom', diner: 'clip_cutout_carrie', e911: 'clip_cutout_911', sheriff: 'clip_cutout_marshall' };
let voEl = null;
function stopVO() { if (voEl) { try { voEl.pause(); } catch (e) { } voEl = null; } }
function playVO(key) {
  if (S.muted) return null;
  stopVO(); const a = new Audio(`assets/vo/${key}.mp3`); a.volume = 1; voEl = a;
  a._failed = false; a.addEventListener('error', () => { a._failed = true; });
  const p = a.play(); if (p && p.catch) p.catch(() => { a._failed = true; });
  return a;
}
function voGroups(key, n, lens) {
  const v = window.RS_VO && window.RS_VO[key]; if (!v || !n) return null;
  const sp = v.s.length ? v.s : [[0, v.d]];
  const starts = [], ends = [];
  if (sp.length === n) {
    sp.forEach(([a, b]) => { starts.push(a); ends.push(b); });
  } else if (sp.length > n) {
    // map each line's share of the text onto speaking time (silences skipped), then snap to the nearest phrase start
    const total = sp.reduce((t, [a, b]) => t + (b - a), 0), chars = lens.reduce((x, y) => x + y, 0) || 1;
    const at = f => { let left = f * total; for (const [a, b] of sp) { if (left <= b - a) return a + left; left -= b - a; } return sp[sp.length - 1][1]; };
    let acc = 0;
    lens.forEach((l, i) => {
      let t = at(acc / chars);
      if (i > 0) { const near = sp.map(x => x[0]).filter(x => x > starts[i - 1] + 0.2).sort((x, y) => Math.abs(x - t) - Math.abs(y - t))[0]; if (near != null && Math.abs(near - t) < 2.2) t = near; }
      starts.push(t); acc += l;
    });
    for (let i = 0; i < n; i++) ends.push(i < n - 1 ? starts[i + 1] : sp[sp.length - 1][1]);
  } else {
    const a = sp[0][0], b = sp[sp.length - 1][1], tot = lens.reduce((x, y) => x + y, 0) || 1; let t = a;
    lens.forEach(l => { starts.push(t); t += (b - a) * l / tot; ends.push(t); });
  }
  return { starts, ends, dur: v.d };
}
function audioUntil(a, t, tok, maxS) {
  const t0 = performance.now();
  return new Promise(res => { const f = () => { if (tok !== PH.tok || !a || a._failed || a.ended || a.currentTime >= t || performance.now() - t0 > maxS * 1000) return res(); requestAnimationFrame(f); }; f(); });
}
async function runVO(lines, who, name, tok, key, glitch, linesEn) {
  const C = L.phone.calls;
  let i0 = 0;
  while (i0 < lines.length && lines[i0].startsWith('{note}')) { const s = subLine(null, '', 'stage-dir'); if (s) s.textContent = lines[i0].slice(6); i0++; await sleep(1200); if (tok !== PH.tok) return false; }
  const spoken = [], tail = [];
  for (const l of lines.slice(i0)) {
    if (l === '{mono}') C.mom.mono.forEach(m => spoken.push({ sp: name, t: m }));
    else if (l === '{hang}' || l === '{hold}') tail.push(l);
    else if (l.startsWith('{note}')) continue;
    else {
      let sp = name, t = l, vm = false; const m = t.match(/^\{as:(\w+)\}/);
      if (m) { sp = m[1] === 'other' ? C[who]?.otherName : L.phone.names[m[1]]; t = t.slice(m[0].length); }
      if (t.startsWith('{voicemail}')) { sp = L.phone.names.voicemail; t = t.slice(11); vm = true; }
      spoken.push({ sp, t, vm });
    }
  }
  const enLens = [];
  for (const l of (linesEn || lines).slice(i0)) {
    if (l === '{mono}') TX.en.phone.calls.mom.mono.forEach(m => enLens.push(m.length));
    else if (l === '{hang}' || l === '{hold}' || l.startsWith('{note}')) continue;
    else enLens.push(l.replace(/^\{[a-z]+(:\w+)?\}/, '').length);
  }
  const lens = enLens.length === spoken.length ? enLens : spoken.map(x => x.t.length);
  const g = voGroups(key, spoken.length, lens); if (!g) return null;
  const a = playVO(key); if (!a) return null;
  const t0 = performance.now();
  const n = glitch ? 1 : spoken.length;
  for (let i = 0; i < n; i++) {
    await audioUntil(a, g.starts[i], tok, g.starts[i] + 2);
    if (tok !== PH.tok) { a.pause(); return false; }
    if (a._failed && performance.now() - t0 < 400) { stopVO(); return null; }
    const segMs = Math.max(400, (g.ends[i] - g.starts[i]) * 1000 * 0.75);
    typeLine(spoken[i].sp, spoken[i].t, tok, Math.max(6, Math.min(22, segMs / Math.max(1, spoken[i].t.length))));
  }
  if (glitch) {
    await audioUntil(a, g.ends[0] + 0.15, tok, g.ends[0] + 3); a.pause(); if (tok !== PH.tok) return false;
    snd('interference', 0.55); PH.ui?.subs.classList.add('glitch'); setTimeout(() => PH.ui?.subs.classList.remove('glitch'), 900);
    const s0 = subLine(null, '', 'stage-dir'); if (s0) s0.textContent = C.glitch[0].slice(6);
    await sleep(1500); stopSnd('interference'); if (tok !== PH.tok) return false;
    const gl = playVO('clip_glitch_voice'); typeLine(L.phone.names.creepy, C.glitch[1].replace(/^\{as:\w+\}/, ''), tok, 40);
    await audioUntil(gl, 99, tok, 3.5); if (tok !== PH.tok) return false;
    const s2 = subLine(null, '', 'stage-dir'); if (s2) s2.textContent = C.glitch[2].slice(6); await sleep(900); if (tok !== PH.tok) return false;
    const ck = playVO(CUTOUT[who]); typeLine(name, C.glitch[3], tok, 22);
    await audioUntil(ck, 99, tok, 6.5);
    return tok === PH.tok;
  }
  await audioUntil(a, 9999, tok, g.dur + 3);
  if (tok !== PH.tok) return false;
  if (key === 'call_mom_3') ach('mom');
  if (spoken.some(x => x.vm)) { await sleep(300); tone([1000], .4, .06); await sleep(900); hang(); return false; }
  if (tail.includes('{hold}')) {
    const holdA = S.muted ? null : new Audio('assets/snd/music.mp3'); if (holdA) { holdA.volume = 0.18; holdA.play().catch(() => { }); }
    await sleep(7500); holdA?.pause(); if (tok !== PH.tok) return false;
    const s = subLine(null, '', 'stage-dir'); if (s) s.textContent = C.mom.holdEnd; await sleep(1800); hang(); return false;
  }
  if (tail.includes('{hang}')) { await sleep(250); hang(); return false; }
  return true;
}
async function runLines(lines, who, name, tok) {
  const C = L.phone.calls;
  for (const raw of lines) {
    if (tok !== PH.tok) return false;
    let line = raw, sp = name;
    if (line === '{hang}') { await sleep(300); hang(); return false; }
    if (line === '{hold}') {
      const was = music.volume; const holdA = S.muted ? null : new Audio('assets/snd/music.mp3'); if (holdA) { holdA.volume = 0.18; holdA.play().catch(() => { }); }
      await sleep(7500); holdA?.pause(); if (tok !== PH.tok) return false;
      subLine(null, '', 'stage-dir').textContent = C.mom.holdEnd; await sleep(1800); hang(); return false;
    }
    if (line === '{mono}') {
      for (const m of C.mom.mono) { if (tok !== PH.tok) return false; await typeLine(name, m, tok); await sleep(1500 + m.length * 22); }
      if (tok === PH.tok) ach('mom');
      continue;
    }
    if (line.startsWith('{note}')) { const s = subLine(null, '', 'stage-dir'); if (s) s.textContent = line.slice(6); if (/Треск|Static/.test(line)) { snd('interference', 0.5); setTimeout(() => stopSnd('interference'), 1300); PH.ui?.subs.classList.add('glitch'); setTimeout(() => PH.ui?.subs.classList.remove('glitch'), 800); } await sleep(1300); continue; }
    const m = line.match(/^\{as:(\w+)\}/);
    if (m) { sp = m[1] === 'other' ? C[who]?.otherName : L.phone.names[m[1]]; line = line.slice(m[0].length); }
    let vm = false; if (line.startsWith('{voicemail}')) { sp = L.phone.names.voicemail; line = line.slice(11); vm = true; }
    await typeLine(sp, line, tok);
    if (vm) { await sleep(700); tone([1000], .4, .06); await sleep(900); hang(); return false; }
    await sleep(900 + line.length * 26);
  }
  return true;
}
function hang(silent) {
  PH.tok++; stopSnd('calling'); stopVO(); stopSnd('interference');
  const was = PH.state;
  PH.state = 'idle'; PH.who = null; PH.dialed = '';
  if (was !== 'idle' && !silent) { snd('hangup', 0.6); const s = subLine(null, '', 'stage-dir'); if (s) s.textContent = '— ' + L.phone.ended + ' —'; }
  radioApply(); renderCtr(); renderLCD();
}
function scheduleIncoming(ms) { clearTimeout(PH.inT); PH.inT = setTimeout(tryIncoming, ms); }
function tryIncoming() {
  if (sess.intro || PH.state !== 'idle' || PH.ringing || (cur && cur.id !== 'phone') || PH.inCount >= 3 || document.hidden) { scheduleIncoming(45000); return; }
  PH.inCount++;
  if (!sess.inQ || !sess.inQ.length) sess.inQ = ['tyler', 'diner', 'mom'].sort(() => Math.random() - 0.5);
  if (sess.obs && !sess.creepyIn && Math.random() < 0.5) { sess.creepyIn = true; PH.ringing = 'creepy'; } else PH.ringing = sess.inQ.shift();
  let n = 0; const ringOnce = () => { if (!PH.ringing) return; snd('ring', 0.55); if (++n < 4) PH.ringT = setTimeout(ringOnce, 4000); else PH.ringT = setTimeout(() => { stopRing(); scheduleIncoming(240000); }, 4000); };
  ringOnce();
  layers.phone?.classList.add('shake');
  renderCtr(); renderLCD();
}
function stopRing() { PH.ringing = null; clearTimeout(PH.ringT); stopSnd('ring'); layers.phone?.classList.remove('shake'); renderCtr(); renderLCD(); }
function answer() {
  const who = PH.ringing; if (!who) return;
  stopRing(); scheduleIncoming(240000);
  const go = () => { PH.dialed = ''; startCall(who, true); };
  if (!cur || cur.id !== 'phone') { openOv('phone'); setTimeout(go, 250); } else go();
}

/* ---------------- RADIO ---------------- */
const R = { on: false, f: 88.3, vol: 0.5 };
const FREQS = [88.3, 92.4, 96.1, 103.7];
const stationAt = f => FREQS.findIndex(x => Math.abs(f - x) < 0.5);
let tickerT = null, whisperT = null;
function radioApply() {
  const st = stationAt(R.f), off = S.muted || !R.on || sess.intro || sess.extMusic || PH.state !== 'idle';
  const duck = 1; const onCall = PH.state !== 'idle';
  const play = (el, on, vol) => { if (on) { el.volume = Math.max(0, Math.min(1, vol)); if (el.paused) { el.preload = 'auto'; const p = el.play(); if (p && p.catch) p.catch(() => { }); } } else if (!el.paused) el.pause(); };
  play(theme, !off && st === 0, R.vol * duck);
  play(music, !off && st === 1, R.vol * duck);
  play(bed, !off && st === 2, R.vol * duck * 0.55);
  play(wloop, !off && st === 3 && sess.obs, R.vol * duck * 0.8);
  let sv = 0; if (!off) sv = st === -1 ? 0.07 : st === 3 ? (sess.obs ? 0.02 : 0.06) : 0;
  if (AC || sv) staticLevel(sv * R.vol * duck * 2);
}
BUILD.radio = body => {
  const r = L.radio;
  const needle = h('div', { class: 'needle' }), stName = h('div', { class: 'st' });
  const scale = h('div', { class: 'scale' }, ['88', '92', '96', '100', '104', '108'].map(t => h('span', {}, t)));
  const win = h('div', { class: 'dial-win' }, scale, needle, stName);
  const knob = h('div', { class: 'knob', 'aria-hidden': 'true' });
  const tune = h('input', { type: 'range', id: 'rtune', min: 875, max: 1080, step: 1, value: Math.round(R.f * 10), 'aria-label': r.tune });
  const vol = h('input', { type: 'range', id: 'rvol', min: 0, max: 100, value: Math.round(R.vol * 100), 'aria-label': r.vol });
  const pwr = h('button', { class: 'pwr', 'aria-pressed': String(R.on), onclick: () => { R.on = !R.on; pwr.setAttribute('aria-pressed', String(R.on)); click(); radioApply(); upd(); } }, 'ON / OFF');
  const presets = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, FREQS.map(f => h('button', { class: 'pwr', onclick: () => { R.f = f; tune.value = Math.round(f * 10); if (!R.on) { R.on = true; pwr.setAttribute('aria-pressed', 'true'); } click(); upd(true); } }, f.toFixed(1))));
  const ticker = h('div', { class: 'ticker', 'aria-live': 'polite' });
  const radio = h('div', { class: 'radio' }, h('div', { class: 'grille' }), h('div', { class: 'radio-face' }, win, h('label', { for: 'rtune' }, r.tune, tune), h('div', { class: 'knobs' }, knob, h('label', { for: 'rvol', style: { flex: 1 } }, r.vol, vol)), h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } }, pwr, presets)));
  const pl = h('button', { class: 'linkbtn', onclick: () => openOv('pc', { win: 'music' }) }, '♪ ' + r.playlist + ' →');
  body.append(h('div', { class: 'radio-wrap' }, radio, ticker, pl));
  let lastSt = null, newsI = Math.floor(Math.random() * r.news.length), heardSince = 0;
  function upd(force) {
    R.f = tune.value / 10; R.vol = vol.value / 100;
    needle.style.left = `calc(12px + (100% - 24px) * ${(R.f - 87.5) / 20.5})`;
    knob.style.transform = `rotate(${(R.f - 87.5) * 14}deg)`;
    const st = stationAt(R.f);
    stName.textContent = R.f.toFixed(1) + ' FM · ' + (st >= 0 ? r.stations[st].name : '…');
    radioApply();
    if (st !== lastSt || force) {
      lastSt = st; clearInterval(tickerT); clearInterval(whisperT); radioTrackChanged = null; ticker.classList.remove('whisper');
      if (!R.on) { ticker.textContent = '—'; return; }
      if (st === 0) ticker.textContent = r.stations[0].now;
      else if (st === 1) { const showT = () => { ticker.textContent = r.stations[1].now + ' ' + r.tracks[rIdx]; }; showT(); radioTrackChanged = showT; }
      else if (st === 2) { const show = () => { ticker.textContent = r.news[newsI++ % r.news.length]; }; show(); tickerT = setInterval(show, 7000); }
      else if (st === 3 && sess.obs) {
        ticker.classList.add('whisper'); heardSince = Date.now();
        const w = () => { ticker.textContent = rnd(r.whisper); noiseBurst(.3, .05); if (Date.now() - heardSince > 2500) ach('whisper'); };
        w(); whisperT = setInterval(w, 2600);
      } else ticker.textContent = r.static;
    }
  }
  tune.addEventListener('input', () => upd()); vol.addEventListener('input', () => upd());
  upd(true);
  cur.cleanup = () => { clearInterval(tickerT); clearInterval(whisperT); radioTrackChanged = null; };
};

/* ---------------- LEDGER ---------------- */
BUILD.ledger = body => {
  const g = L.ledger, list = g.list;
  const by = s => list.filter(a => a.s === s);
  const tally = h('div', { class: 'tally-row' }, ['rep', 'obs', 'skep', 'shame'].map(s => h('div', {}, h('img', { src: `assets/img/${STAT_IMG[s]}.webp`, alt: '' }), h('div', {}, h('b', {}, `${by(s).filter(a => S.ach[a.id]).length}/${by(s).length}`), h('small', {}, statLabel(s))))));
  const ul = h('ul', { class: 'ach-list' }, list.map(a => h('li', { class: S.ach[a.id] ? 'got' : '' }, h('img', { src: `assets/img/${STAT_IMG[a.s]}.webp`, alt: '' }), h('div', {}, h('b', {}, a.t), h('span', {}, a.d)), h('span', { class: 'chk' }, '✓'))));
  const n = achCount(), all = n >= list.length;
  let sure = false;
  const reset = h('button', { class: 'mini-btn', onclick: () => { if (!sure) { sure = true; reset.textContent = g.resetSure; return; } S.ach = {}; S.seen = { places: [], people: [], threads: [] }; S.calls = {}; S.reached = []; S.walkie = 0; S.classified = 0; S.hack = false; save(); updateFrames(); renderCur(); } }, g.reset);
  const foot = h('div', { class: 'ledger-foot' }, h('span', { class: 'done' }, `${n} ${g.of} ${list.length}`), h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, all ? h('button', { class: 'mini-btn dark', onclick: () => certDownload() }, g.certBtn) : null, reset));
  body.append(h('div', { class: 'ledger paper' }, h('h3', {}, g.title), h('div', { class: 'sub' }, g.sub), tally, ul, foot));
};

/* ---------------- PC ---------------- */
BUILD.pc = body => {
  const P = L.pc;
  const os = h('div', { class: 'os' });
  os.append(h('div', { class: 'wall' }, h('img', { src: 'assets/img/ic_rep.webp', alt: '' }), h('b', {}, P.owner), h('small', {}, P.os)));
  const icons = h('div', { class: 'icons' });
  const items = [['forum', ICON.globe, winForum], ['music', ICON.music, winMusic], ['fine', ICON.fine, winFine], ['mines', ICON.mine, winMines], ['ledger', ICON.star, () => openOv('ledger')], ['secret', ICON.lock, openSecret], ['trash', ICON.trash, () => winFolder(P.icons.trash, P.trashFiles)], ['about', ICON.doc, () => winText(P.icons.about, P.about)]];
  items.forEach(([k, svg, fn]) => icons.append(h('button', { class: 'dicon', onclick: () => { click(); fn(); } }, h('span', { html: svg }), h('span', {}, P.icons[k]))));
  const clock = h('div', { class: 'clock' });
  let menu = null;
  const startBtn = h('button', { class: 'startbtn', onclick: () => { click(); if (menu) { menu.remove(); menu = null; return; } menu = h('div', { class: 'startmenu' }, h('div', { class: 'side' }, P.os), h('div', { class: 'items' }, h('div', { class: 'who' }, P.user), h('button', { onclick: () => winForum() }, P.icons.forum), h('button', { onclick: () => winFine() }, P.icons.fine), h('button', { onclick: () => closeOv() }, P.shutdown))); os.append(menu); } }, h('img', { src: 'assets/img/ic_rep.webp', alt: '' }), P.start);
  const bar = h('div', { class: 'taskbar' }, startBtn, clock);
  os.append(icons, bar);
  os.addEventListener('click', e => { if (menu && !e.target.closest('.startmenu,.startbtn')) { menu.remove(); menu = null; } });
  body.append(h('div', { class: 'pc-wrap' }, h('div', { class: 'monitor' }, os)));
  const tick = () => { const d = new Date(); clock.textContent = pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
  tick(); const ti = setInterval(tick, 20000);
  cur.cleanup = () => { clearInterval(ti); clearInterval(sess.msTimer); if (sess.extMusic) { sess.extMusic = false; radioApply(); } };
  cur.os = os;
  if (cur.opts.win === 'forum') winForum(); else if (cur.opts.win === 'music') winMusic(); else if (cur.opts.win === 'mines') winMines();
};
function openWin(title, content, small) {
  const os = cur && cur.os; if (!os) return null;
  $$('.win', os).forEach(w => w.remove());
  const w = h('div', { class: 'win' + (small ? ' small' : ''), role: 'dialog', 'aria-label': title },
    h('div', { class: 'bar' }, h('span', {}, title), h('button', { class: 'wx', 'aria-label': L.ui.close, onclick: () => { click(); w.remove(); } }, '×')),
    h('div', { class: 'content' }, content));
  os.append(w); return w;
}
function winText(name, text) { openWin(name + ' — Notepad', h('pre', { class: 'notepad' }, text)); }
function winFolder(title, files) {
  const ul = h('ul', { class: 'folderlist' }, files.length ? files.map(f => h('li', {}, h('button', { onclick: () => { click(); winText(f.name, f.text); } }, h('span', { html: ICON.doc }), f.name))) : h('li', { style: { padding: '8px' } }, L.pc.empty));
  openWin(title, ul);
}
function openSecret() {
  const P = L.pc;
  if (S.hack) { winFolder(P.icons.secret, P.secretFiles); return; }
  const inp = h('input', { type: 'password', id: 'pcpw', autocomplete: 'off', 'aria-label': P.pw });
  const err = h('div', { class: 'err' });
  const form = h('form', { class: 'pw-form', onsubmit: e => {
    e.preventDefault();
    const v = inp.value.trim().toLowerCase();
    if (['17', 'семнадцать', 'seventeen'].includes(v)) { S.hack = true; save(); ach('hack'); winFolder(P.icons.secret, P.secretFiles); }
    else { err.textContent = P.pwBad; inp.select(); tone([180], .25, .06); }
  } }, h('div', {}, P.pwTitle), h('label', { for: 'pcpw' }, P.pw), inp, h('small', {}, P.pwHint), err,
    h('div', { class: 'row' }, h('button', { class: 'w98btn', type: 'submit' }, P.ok), h('button', { class: 'w98btn', type: 'button', onclick: e => e.target.closest('.win').remove() }, P.cancel)));
  openWin(P.icons.secret, form, true); setTimeout(() => inp.focus(), 50);
}

/* forum */
const hash = s => { let x = 0; for (const c of s) x = (x * 31 + c.codePointAt(0)) | 0; return Math.abs(x); };
const AVA = ['#7b4b2a', '#3d5a80', '#6b8f71', '#8d3b72', '#5c5c8a', '#a0522d', '#2f6b6b', '#7a6a2e'];
const BASE_DAY = { dodge: 22, mill: 9, pie: 20, coat: 23, radio: 21, market: 16, yell: 18, insomnia: 24 };
function fDate(thread, i) {
  const day = BASE_DAY[thread] || 20; const mins = (hash(thread) % 600) + i * (17 + hash(thread + i) % 90);
  const d = new Date(2026, 9, day, 0, 0); d.setMinutes(d.getMinutes() + 60 + mins);
  if (d.getMonth() !== 9 || d.getDate() > 24) d.setDate(24);
  return lang === 'ru' ? `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
    : d.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function winForum(threadId) {
  const F = L.forum;
  const root = h('div', { class: 'forum' });
  const addr = h('span', {}, 'http://riddle-online.net/forum/');
  const wrap = h('div', {}, h('div', { class: 'browser-bar' }, h('b', {}, '◀ ▶'), addr), root);
  const w = openWin(F.name + ' — Internet Explorer', wrap); if (!w) return;
  const content = w.querySelector('.content');
  const head = () => [h('div', { class: 'f-head' }, h('b', {}, F.name), h('small', {}, F.tagline)), h('div', { class: 'f-user' }, h('span', {}, `${F.logged}: `, h('b', {}, 'night_owl_RL'), ` (${F.posts}: 0)`), h('span', {}, F.online))];
  function list() {
    addr.textContent = 'http://riddle-online.net/forum/';
    root.innerHTML = ''; root.append(...head());
    const tb = h('table', { class: 'f-list' }, h('thead', {}, h('tr', {}, h('th', {}, F.cols[0]), h('th', { style: { textAlign: 'center' } }, F.cols[1]), h('th', { class: 'v', style: { textAlign: 'center' } }, F.cols[2]))));
    const tbody = h('tbody');
    [...F.threads].sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0)).forEach(t => tbody.append(h('tr', {},
      h('td', {}, t.pin ? h('span', { class: 'pin' }, lang === 'ru' ? 'Важно:' : 'Pinned:') : null, h('button', { class: S.seen.threads.includes(t.id) ? 'read' : '', onclick: () => { click(); thread(t.id); } }, t.t), h('span', { class: 'brd' }, F.boards[t.b])),
      h('td', { class: 'n' }, t.posts.length - 1), h('td', { class: 'n v' }, t.views.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')))));
    tb.append(tbody); root.append(tb); content.scrollTop = 0;
  }
  function thread(id) {
    const t = F.threads.find(x => x.id === id); if (!t) return;
    addr.textContent = `http://riddle-online.net/forum/topic.php?t=${hash(id) % 9000 + 1000}`;
    if (!S.seen.threads.includes(id)) { S.seen.threads.push(id); save(); }
    if (F.threads.every(x => S.seen.threads.includes(x.id))) ach('forum');
    root.innerHTML = ''; root.append(...head());
    const back = h('button', { class: 'f-back', onclick: () => { click(); list(); } }, F.back);
    const posts = h('div', { class: 'f-thread' }, h('h4', {}, t.t));
    t.posts.forEach(([nick, text], i) => {
      const u = F.users[nick] || { r: 'local' };
      const n = nick === 'night_owl_RL' ? 0 : (u.r === 'new' ? 3 + hash(nick) % 20 : 40 + hash(nick) % 1900);
      const isDel = text === '{deleted}';
      const caps = !isDel && /[A-ZА-ЯЁ]/.test(text) && text === text.toUpperCase() && text.replace(/[^A-Za-zА-Яа-яЁё]/g, '').length > 6;
      const who = h('div', { class: 'who' }, h('div', { class: 'ava', style: { background: AVA[hash(nick) % AVA.length] } }, nick.replace(/[^A-Za-zА-Яа-яЁё]/g, '').charAt(0).toUpperCase() || '?'), h('div', {}, h('b', {}, nick), h('div', {}, F.ranks[u.r] || ''), h('div', {}, `${F.posts}: ${n}`)));
      const msg = h('div', { class: 'msg' }, h('div', { class: 'dt' }, `#${i + 1} · ${fDate(id, i)}`));
      if (isDel) msg.append(h('p', { class: 'del' }, F.deleted)); else text.split('\n\n').forEach(par => msg.append(h('p', {}, par)));
      if (u.sig && !isDel) msg.append(h('div', { class: 'sig' }, u.sig));
      posts.append(h('div', { class: 'post' + (caps ? ' caps' : '') }, who, msg));
    });
    root.append(back, posts, h('button', { class: 'f-back', onclick: () => { click(); list(); } }, F.back)); content.scrollTop = 0;
  }
  threadId ? thread(threadId) : list();
}

/* music players */
function winMusic() {
  const P = L.pc.music; let tab = lang === 'ru' ? 'ya' : 'sp';
  const frameBox = h('div', { class: 'mframe' }), tabs = h('div', { class: 'mtabs' });
  const show = t => {
    tab = t; $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === t)));
    frameBox.innerHTML = ''; frameBox.classList.toggle('ya', t === 'ya');
    frameBox.append(h('iframe', { src: t === 'ya' ? D.links.yandexEmbed : D.links.spotifyEmbed, title: t === 'ya' ? P.ya : P.sp, allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture', loading: 'lazy' }));
  };
  ['ya', 'sp'].forEach(t => tabs.append(h('button', { class: 'w98btn', 'data-t': t, onclick: () => { click(); show(t); } }, t === 'ya' ? P.ya : P.sp)));
  const links = h('div', { class: 'mlinks' }, h('a', { href: D.links.playlist, target: '_blank', rel: 'noopener' }, P.ya + ' · ' + P.open), h('a', { href: D.links.spotify, target: '_blank', rel: 'noopener' }, P.sp + ' · ' + P.open));
  const banner = h('div', { class: 'mbanner' }, h('img', { src: 'assets/img/loc_forest.webp', alt: '' }), h('div', {}, h('b', {}, 'RIDDLESIDE'), h('span', {}, P.banner)));
  const w = openWin(P.title, h('div', { class: 'music' }, banner, h('p', { class: 's' }, P.sub), tabs, frameBox, h('p', { class: 'fb' }, P.fallback), links)); if (!w) return;
  show(tab);
  sess.extMusic = true; radioApply();
  clearTimeout(sess.musicT); sess.musicT = setTimeout(() => { if (w.isConnected) ach('music'); }, 30000);
  const mo = new MutationObserver(() => { if (!w.isConnected) { sess.extMusic = false; radioApply(); mo.disconnect(); } });
  mo.observe(w.parentNode, { childList: true });
}
/* minesweeper */
function winMines() {
  const M = L.pc.mines, NR = 9, NC = 9, NM = 10;
  let grid = [], started = false, over = false, flags = 0, secs = 0, flagMode = false;
  const cnt = h('div', { class: 'ms-lcd' }), tm = h('div', { class: 'ms-lcd' });
  const face = h('button', { class: 'ms-face', 'aria-label': 'reset', onclick: () => { click(); reset(); } });
  const flagBtn = h('button', { class: 'w98btn', 'aria-pressed': 'false', onclick: () => { flagMode = !flagMode; flagBtn.setAttribute('aria-pressed', String(flagMode)); } }, '⚑ ' + M.flag);
  const board = h('div', { class: 'ms-board' }), msg = h('div', { class: 'ms-msg' });
  const at = (r, c) => (r >= 0 && r < NR && c >= 0 && c < NC ? grid[r * NC + c] : null);
  const nb = x => { const o = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) { const y = at(x.r + dr, x.c + dc); if (y) o.push(y); } return o; };
  const upd = () => { cnt.textContent = String(Math.max(0, NM - flags)).padStart(3, '0'); };
  function reset() {
    clearInterval(sess.msTimer); grid = []; started = false; over = false; flags = 0; secs = 0; tm.textContent = '000'; face.textContent = '🙂'; msg.textContent = M.hint; board.innerHTML = '';
    for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
      const x = { r, c, m: false, n: 0, open: false, flag: false };
      x.el = h('button', { class: 'ms-c', 'aria-label': `${r + 1}:${c + 1}` });
      x.el.addEventListener('click', () => hit(x));
      x.el.addEventListener('contextmenu', e => { e.preventDefault(); toggle(x); });
      let lt = null; x.el.addEventListener('touchstart', () => { lt = setTimeout(() => { toggle(x); x.lp = true; }, 450); }, { passive: true });
      x.el.addEventListener('touchend', () => clearTimeout(lt)); x.el.addEventListener('touchmove', () => clearTimeout(lt), { passive: true });
      grid.push(x); board.append(x.el);
    }
    upd();
  }
  function toggle(x) { if (over || x.open) return; x.flag = !x.flag; flags += x.flag ? 1 : -1; x.el.textContent = x.flag ? '⚑' : ''; x.el.classList.toggle('f', x.flag); upd(); }
  function open(x) { if (x.open || x.flag) return; x.open = true; x.el.classList.add('o'); if (x.m) return; if (x.n) { x.el.textContent = x.n; x.el.dataset.n = x.n; } else nb(x).forEach(open); }
  function hit(x) {
    if (x.lp) { x.lp = false; return; }
    if (over) return; if (flagMode) { toggle(x); return; } if (x.flag) return;
    if (!started) {
      started = true; const ex = new Set([x, ...nb(x)]); let k = 0;
      while (k < NM) { const y = grid[Math.floor(Math.random() * grid.length)]; if (y.m || ex.has(y)) continue; y.m = true; k++; }
      grid.forEach(y => { y.n = nb(y).filter(z => z.m).length; });
      sess.msTimer = setInterval(() => { secs = Math.min(999, secs + 1); tm.textContent = String(secs).padStart(3, '0'); }, 1000);
    }
    click();
    if (x.m) { over = true; clearInterval(sess.msTimer); grid.filter(y => y.m).forEach(y => { y.el.classList.add('o'); y.el.textContent = '✹'; }); x.el.classList.add('boom'); face.textContent = '😵'; msg.textContent = M.lose; noiseBurst(.4, .08); return; }
    open(x);
    if (grid.every(y => y.m || y.open)) { over = true; clearInterval(sess.msTimer); face.textContent = '😎'; msg.textContent = M.win; grid.filter(y => y.m && !y.flag).forEach(y => { y.flag = true; y.el.textContent = '⚑'; }); flags = NM; upd(); ach('mines'); }
  }
  const w = openWin(M.title, h('div', { class: 'ms' }, h('div', { class: 'ms-top' }, cnt, face, tm), board, flagBtn, msg), true);
  if (w) { w.classList.add('ms-win'); reset(); }
}

/* fine generator */
let imgCache = {};
const loadImg = src => imgCache[src] || (imgCache[src] = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
async function fontsReady() {
  if (!document.fonts || !document.fonts.load) return;
  const fs = ['600 34px Oswald', '24px "PT Mono"', '52px Caveat', '54px "Marck Script"', '700 52px Caveat'];
  await Promise.race([Promise.all(fs.map(f => document.fonts.load(f).catch(() => { }))), sleep(2500)]);
}
function wrapText(ctx, text, maxW) {
  const words = String(text).split(/\s+/), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
function paperBG(ctx, w, hh, seed) {
  ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, 0, w, hh);
  const r = mulberry(seed);
  for (let i = 0; i < 5000; i++) { ctx.fillStyle = `rgba(110,80,40,${r() * .06})`; ctx.fillRect(r() * w, r() * hh, 1.5, 1.5); }
  const g = ctx.createRadialGradient(w / 2, hh / 2, hh * .3, w / 2, hh / 2, hh * .8); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,60,20,.18)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, hh);
}
function stampAt(ctx, x, y, text, rot, size) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = .8;
  ctx.font = `600 ${size}px Oswald, "Arial Narrow", sans-serif`; const tw = ctx.measureText(text).width;
  ctx.strokeStyle = '#b3261e'; ctx.lineWidth = 7; ctx.strokeRect(-tw / 2 - 26, -size * .8, tw + 52, size * 1.45);
  ctx.fillStyle = '#b3261e'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -size * .06);
  ctx.globalCompositeOperation = 'destination-out'; const r = mulberry(7);
  for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(0,0,0,${r() * .6})`; ctx.fillRect(-tw / 2 - 30 + r() * (tw + 60), -size + r() * size * 1.8, 2 + r() * 3, 2 + r() * 3); }
  ctx.restore();
}
function footer(ctx, w, hh, text) {
  ctx.fillStyle = '#221a14'; ctx.fillRect(0, hh - 84, w, 84);
  ctx.fillStyle = '#efe3cb'; ctx.font = '600 24px Oswald, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text.toUpperCase()).width;
  ctx.font = '20px "PT Mono", monospace'; const uw = ctx.measureText(D.links.site).width;
  const two = 60 + tw + 30 + uw > w - 60;
  ctx.font = '600 24px Oswald, sans-serif'; ctx.fillText(text.toUpperCase(), 60, two ? hh - 56 : hh - 42);
  ctx.font = '20px "PT Mono", monospace'; ctx.fillStyle = '#b9ab92';
  if (two) { ctx.fillText(D.links.site, 60, hh - 24); } else { ctx.textAlign = 'right'; ctx.fillText(D.links.site, w - 60, hh - 42); }
}
async function renderFine(d) {
  await fontsReady();
  const W2 = 1080, H2 = 1350, c = document.createElement('canvas'); c.width = W2; c.height = H2;
  const x = c.getContext('2d'), T = L.fine.doc;
  paperBG(x, W2, H2, 3);
  x.fillStyle = '#d9cdb2'; for (let i = 30; i < W2; i += 28) { x.beginPath(); x.arc(i, 26, 5, 0, 7); x.fill(); }
  const star = await loadImg('assets/img/ic_rep.webp'); if (star) x.drawImage(star, 60, 64, 120, 120);
  x.fillStyle = '#221a14'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  x.font = '600 32px Oswald, sans-serif'; wrapText(x, T.org, 560).forEach((l, i) => x.fillText(l, 200, 112 + i * 38));
  x.font = '20px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(T.state, 200, 180);
  x.textAlign = 'right'; x.fillStyle = '#221a14'; x.font = '22px "PT Mono", monospace';
  x.fillText(`${T.no} RC-26-${String(1000 + Math.floor(Math.random() * 8999))}`, 1020, 110);
  const dt = new Date(); x.fillText(`${T.date}: ${lang === 'ru' ? pad2(dt.getDate()) + '.' + pad2(dt.getMonth() + 1) + '.' + dt.getFullYear() : dt.toLocaleDateString('en-US')}`, 1020, 146);
  x.textAlign = 'left'; x.strokeStyle = '#221a14'; x.lineWidth = 3; x.beginPath(); x.moveTo(60, 216); x.lineTo(1020, 216); x.stroke(); x.lineWidth = 1; x.beginPath(); x.moveTo(60, 224); x.lineTo(1020, 224); x.stroke();
  x.font = '600 58px Oswald, sans-serif'; x.fillStyle = '#1b140f'; x.fillText(T.form, 60, 300);
  const label = (t, y) => { x.font = '20px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(t.toUpperCase(), 60, y); };
  const rule = y => { x.strokeStyle = 'rgba(34,26,20,.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(60, y); x.lineTo(1020, y); x.stroke(); };
  const ink = '#1d2f5c';
  label(T.to, 372); x.font = '700 58px Caveat, cursive'; x.fillStyle = ink; x.fillText(d.to, 70, 438); rule(452);
  label(T.what, 510); x.font = '700 50px Caveat, cursive'; let y = 568; wrapText(x, d.what, 930).slice(0, 3).forEach(l => { x.fillStyle = ink; x.fillText(l, 70, y); rule(y + 14); y += 60; });
  label(T.sum, 768); x.font = '700 66px Caveat, cursive'; x.fillStyle = ink; x.fillText(d.sum, 70, 836); rule(850);
  if (d.note) { label(T.note, 904); x.font = '700 44px Caveat, cursive'; let y2 = 956; wrapText(x, d.note, 930).slice(0, 2).forEach(l => { x.fillStyle = ink; x.fillText(l, 70, y2); y2 += 50; }); }
  label(T.officer, 1080); x.font = '58px "Marck Script", cursive'; x.fillStyle = ink; x.fillText(lang === 'ru' ? 'Р. Линч' : 'R. Lynch', 80, 1150); x.strokeStyle = '#221a14'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(60, 1166); x.lineTo(520, 1166); x.stroke();
  x.font = '20px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(T.officerName, 60, 1196);
  stampAt(x, 790, 1120, T.stamp, -0.2, 62);
  x.font = '18px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(T.pay, 60, 1240);
  footer(x, W2, H2, T.foot);
  return c;
}
async function certDownload() {
  await fontsReady();
  const W2 = 1080, H2 = 1350, c = document.createElement('canvas'); c.width = W2; c.height = H2; const x = c.getContext('2d'), g = L.ledger;
  paperBG(x, W2, H2, 9);
  x.strokeStyle = '#8a6a2a'; x.lineWidth = 10; x.strokeRect(40, 40, W2 - 80, H2 - 164); x.lineWidth = 2; x.strokeRect(62, 62, W2 - 124, H2 - 208);
  const star = await loadImg('assets/img/ic_rep.webp'); if (star) x.drawImage(star, W2 / 2 - 90, 110, 180, 180);
  x.textAlign = 'center'; x.fillStyle = '#1b140f'; x.font = '600 92px Oswald, sans-serif'; x.fillText(g.certTitle, W2 / 2, 400);
  x.font = '22px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(L.fine.doc.org, W2 / 2, 450);
  x.font = '700 52px Caveat, cursive'; x.fillStyle = '#1d2f5c'; let y = 580; wrapText(x, g.certText, 860).forEach(l => { x.fillText(l, W2 / 2, y); y += 62; });
  x.font = '54px "Marck Script", cursive'; x.fillText('D. Marshall', W2 / 2, 1010); x.font = '20px "PT Mono", monospace'; x.fillStyle = '#6a5a48'; x.fillText(g.certSign, W2 / 2, 1050);
  stampAt(x, W2 / 2 + 250, 920, L.fine.doc.stamp, -0.25, 50);
  footer(x, W2, H2, L.fine.doc.foot);
  saveCanvas(c, 'riddleside-certificate.png');
}
function saveCanvas(c, name) {
  try { const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = name; document.body.append(a); a.click(); a.remove(); } catch (e) { note(L.fine.shareFail); }
}
function winFine() {
  const F = L.fine;
  const to = h('input', { id: 'fto', value: F.toEx, placeholder: F.toPh, maxlength: 40 });
  const what = h('select', { id: 'fwhat' }, F.violations.map(v => h('option', {}, v)), h('option', { value: '__own' }, F.own));
  const own = h('input', { id: 'fown', placeholder: F.ownPh, maxlength: 90, hidden: true });
  what.addEventListener('change', () => { own.hidden = what.value !== '__own'; if (!own.hidden) own.focus(); });
  const sum = h('select', { id: 'fsum' }, F.sums.map(v => h('option', {}, v)));
  const nt = h('input', { id: 'fnote', placeholder: F.notePh, maxlength: 70 });
  const out = h('div', { class: 'out' }, h('div', { class: 'ph' }, F.sub));
  const form = h('form', { onsubmit: async e => {
    e.preventDefault(); snd('typing', 0.35); setTimeout(() => stopSnd('typing'), 1100);
    const data = { to: to.value.trim() || F.toEx, what: what.value === '__own' ? (own.value.trim() || F.violations[0]) : what.value, sum: sum.value, note: nt.value.trim() };
    const c = await renderFine(data); const url = c.toDataURL('image/png');
    out.innerHTML = '';
    const im = h('img', { src: url, alt: F.title });
    const btns = h('div', { class: 'btns' },
      h('button', { class: 'w98btn', type: 'button', onclick: () => saveCanvas(c, 'riddleside-fine.png') }, F.save),
      navigator.share ? h('button', { class: 'w98btn', type: 'button', onclick: () => c.toBlob(async b => { try { const f = new File([b], 'riddleside-fine.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: L.ui.title }); else note(F.shareFail); } catch (err) { if (err && err.name !== 'AbortError') note(F.shareFail); } }) }, F.share) : null,
      h('button', { class: 'w98btn', type: 'button', onclick: () => { out.innerHTML = ''; out.append(h('div', { class: 'ph' }, F.sub)); to.select(); } }, F.again));
    out.append(im, btns, h('div', { class: 'lp' }, F.longpress));
    ach('fine');
  } },
  h('label', { for: 'fto' }, F.to, to), h('label', { for: 'fwhat' }, F.what, what), own, h('label', { for: 'fsum' }, F.sum, sum), h('label', { for: 'fnote' }, F.note, nt),
  h('div', {}, h('button', { class: 'w98btn', type: 'submit' }, F.make)));
  openWin(F.title, h('div', { class: 'fine' }, h('div', {}, h('h4', {}, F.title), h('p', { class: 's' }, F.sub), form), out));
}

/* ---------------- shell: topbar, menu, intro, lang ---------------- */
function buildChrome() {
  const nav = $('#nav'); nav.innerHTML = '';
  ['map', 'people', 'case', 'phone', 'pc', 'radio', 'ledger'].forEach(k => nav.append(h('button', { 'data-go': k, 'aria-current': cur && cur.id === k ? 'true' : 'false', onclick: () => openOv(k) }, L.ui.nav[k])));
  $('#logoT').textContent = L.ui.title; $('#logoS').textContent = L.ui.county;
  $('#playBtn').textContent = L.ui.play;
  $('#langBtn').textContent = lang === 'ru' ? 'EN' : 'RU';
  $('#langBtn').setAttribute('aria-label', lang === 'ru' ? 'English' : 'Русский');
  $('#soundBtn').innerHTML = S.muted ? ICON.mute : ICON.sound; $('#soundBtn').setAttribute('aria-label', L.ui.sound);
  $('#burger').innerHTML = ICON.burger; $('#burger').setAttribute('aria-label', L.ui.menu);
  $('#hint').textContent = isTouch ? L.ui.hintTouch : L.ui.hintDesk;
  document.documentElement.lang = lang; document.title = L.ui.title;
  updateBadge();
}
function setLang(l) {
  lang = l; L = TX[l]; S.lang = l; save();
  buildChrome(); buildScene();
  if (cur) renderCur();
  if (sess.intro) buildIntro();
}
function toggleMute() { S.muted = !S.muted; save(); if (S.muted) { Object.keys(SND).forEach(stopSnd); } radioApply(); buildChrome(); }
function openMenu() {
  const close = () => d.remove();
  const nav = h('nav', {}, ['room', 'map', 'people', 'case', 'phone', 'pc', 'radio', 'ledger'].map(k => h('button', { onclick: () => { close(); openOv(k); } }, L.ui.nav[k])));
  const d = h('div', { class: 'drawer', onclick: e => { if (e.target === d) close(); } }, h('div', { class: 'drawer-in' },
    h('button', { class: 'x', 'aria-label': L.ui.close, html: ICON.x, onclick: close }), nav,
    h('div', { class: 'row' }, storeBtns()),
    h('div', { class: 'row' }, h('a', { class: 'linkbtn', href: D.links.tg, target: '_blank', rel: 'noopener', html: ICON.tg + '<span>' + esc(L.ui.tgBtn) + '</span>' })),
    h('div', { class: 'row' }, h('button', { class: 'linkbtn', onclick: () => { close(); setLang(lang === 'ru' ? 'en' : 'ru'); } }, lang === 'ru' ? 'English' : 'Русский'), h('button', { class: 'linkbtn', onclick: () => { toggleMute(); close(); } }, L.ui.sound + (S.muted ? ' ✕' : ' ✓')))));
  document.body.append(d);
}
function buildIntro() {
  const el = $('#intro'); el.innerHTML = '';
  const choose = obs => enter(obs);
  el.append(h('div', { class: 'intro-bg' }), h('div', { class: 'intro-fog' }),
    h('button', { class: 'btn-ico btn-lang lang', onclick: () => setLang(lang === 'ru' ? 'en' : 'ru') }, lang === 'ru' ? 'EN' : 'RU'),
    h('div', { class: 'intro-in' },
      h('h1', {}, L.ui.title), h('div', { class: 'county' }, L.ui.county),
      h('p', { class: 'logline' }, L.ui.loglineA, h('br'), L.ui.loglineB),
      h('p', { class: 'q' }, L.ui.introQ),
      h('div', { class: 'choices' },
        h('button', { class: 'choice skep', onclick: () => choose(false) }, h('img', { src: 'assets/img/ic_skep.webp', alt: '' }), L.ui.introSkep),
        h('button', { class: 'choice obs', onclick: () => choose(true) }, h('img', { src: 'assets/img/ic_obs.webp', alt: '' }), L.ui.introObs)),
      h('div', { class: 'small' }, L.ui.introNote), h('div', { class: 'small' }, L.ui.age)));
}
function enter(obs) {
  ac();
  sess.intro = false;
  const el = $('#intro'); el.classList.add('out'); setTimeout(() => { el.hidden = true; }, 1200);
  setObs(obs, false);
  R.on = true; R.f = 88.3; radioApply();
  if (obs) { noiseBurst(.7, .08); setTimeout(flicker, 600); }
  if (!isTouch) setTimeout(() => document.body.classList.remove('dots'), 7000);
  setTimeout(() => $('#hint').classList.add('gone'), 9000);
  scheduleIncoming(75000);
  if (new Date().getHours() < 5) setTimeout(() => ach('night'), 2500);
  route();
}

/* ---------------- boot ---------------- */
function boot() {
  buildChrome(); buildScene(); layout(); buildIntro();
  document.body.classList.add('dots');
  addEventListener('resize', layout);
  $('#langBtn').addEventListener('click', () => setLang(lang === 'ru' ? 'en' : 'ru'));
  $('#soundBtn').addEventListener('click', toggleMute);
  $('#burger').addEventListener('click', openMenu);
  $('#playBtn').addEventListener('click', openPlay);
  $('#logo').addEventListener('click', () => closeOv());
  $('#pathBadge').addEventListener('click', () => setObs(!sess.obs, true));
  addEventListener('popstate', route);
  addEventListener('hashchange', route);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const m = $('.modal, .drawer'); if (m) { m.remove(); return; }
    if (cur && cur.os) { const w = $('.win', cur.os); if (w) { w.remove(); return; } }
    if (cur) closeOv();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { [theme, music, bed, wloop].forEach(a => a.pause()); if (AC) staticLevel(0); } else radioApply(); });
  setInterval(() => { if (sess.obs && !cur && !sess.intro && Math.random() < 0.35) { flicker(); noiseBurst(.35, .03); if (Math.random() < 0.35) snd(Math.random() < .5 ? 'whisper1' : 'whisper2', 0.22); } }, 9000);
}
boot();
})();
