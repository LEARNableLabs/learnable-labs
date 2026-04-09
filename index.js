/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION PLAYGROUND - JAVASCRIPT
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION & CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const PRESETS = {
  warm:     { points: 200, major: 200, minor: 25, rotspeed: 1, dotsize: 2.5, glow: 5, repel: 40, dur: 700, slide: 24, easing: 'cubic-bezier(0,0,0.2,1)', thresh: 0.15, blur: 12, blurdur: 900, stagger: 80, count: 200, speed: 0.4 },
  minimal:  { points: 100, major: 200, minor: 60, rotspeed: 0.5, dotsize: 2, glow: 0, repel: 20, dur: 500, slide: 12, easing: 'cubic-bezier(0,0,0.2,1)', thresh: 0.15, blur: 0, blurdur: 500, stagger: 50, count: 0, speed: 0 },
  dramatic: { points: 400, major: 250, minor: 80, rotspeed: 0.5, dotsize: 3, glow: 10, repel: 60, dur: 1200, slide: 60, easing: 'cubic-bezier(0.16,1,0.3,1)', thresh: 0.1, blur: 20, blurdur: 1400, stagger: 150, count: 120, speed: 0.2 },
  fast:     { points: 200, major: 180, minor: 50, rotspeed: 3, dotsize: 1.5, glow: 3, repel: 30, dur: 250, slide: 8, easing: 'cubic-bezier(0.34,1.56,0.64,1)', thresh: 0.05, blur: 4, blurdur: 300, stagger: 30, count: 30, speed: 1 },
  dreamy:   { points: 300, major: 200, minor: 80, rotspeed: 0.3, dotsize: 3.5, glow: 12, repel: 50, dur: 1800, slide: 40, easing: 'cubic-bezier(0.4,0,0.2,1)', thresh: 0.2, blur: 25, blurdur: 2000, stagger: 200, count: 100, speed: 0.15 },
};

const CONTROL_SECTIONS = [
  {
    title: 'Presets',
    type: 'presets',
    options: ['warm', 'minimal', 'dramatic', 'fast', 'dreamy'],
    labels: ['Warm', 'Minimal', 'Dramatic', 'Snappy', 'Dreamy']
  },
  {
    title: '3D Shape',
    controls: [
      { type: 'select', id: 'shape', label: 'Visualization', optgroups: [
        { label: 'Shapes', options: [
          { value: 'torus', label: 'Torus' },
          { value: 'sphere', label: 'Sphere' },
          { value: 'circle', label: 'Circle' },
          { value: 'cube', label: 'Cube' },
          { value: 'helix', label: 'Helix' }
        ]},
        { label: 'Divergent Shape', options: [
          { value: 'diverge', label: 'Diverge (order → chaos)' }
        ]},
        { label: 'Chaotic Systems', options: [
          { value: 'lorenz', label: 'Lorenz Attractor' },
          { value: 'rossler', label: 'Rössler Attractor' }
        ]},
        { label: 'Cellular Automata', options: [
          { value: 'life', label: 'Game of Life' },
          { value: 'wolfram', label: 'Wolfram 1D CA' }
        ]}
      ]},
      { type: 'range', id: 'points', label: 'Points', min: 50, max: 500, step: 10, value: 200, unit: '' },
      { type: 'range', id: 'major', label: 'Major Radius', min: 80, max: 700, step: 10, value: 200, unit: '' },
      { type: 'range', id: 'minor', label: 'Minor Radius', min: 5, max: 120, step: 5, value: 40, unit: '' },
      { type: 'range', id: 'rotspeed', label: 'Rotation Speed', min: 0, max: 4, step: 0.1, value: 1.0, unit: '' },
      { type: 'range', id: 'dotsize', label: 'Point Size', min: 1, max: 6, step: 0.5, value: 2.5, unit: '' },
      { type: 'range', id: 'glow', label: 'Glow Size', min: 0, max: 15, step: 1, value: 5, unit: '' },
      { type: 'range', id: 'repel', label: 'Mouse Repel', min: 0, max: 100, step: 5, value: 40, unit: '' }
    ]
  },
  {
    title: 'Cellular Automata',
    controls: [
      { type: 'range', id: 'gridsize', label: 'Life Grid Size', min: 10, max: 120, step: 5, value: 50, unit: '' },
      { type: 'range', id: 'wolframw', label: 'Wolfram Width', min: 20, max: 200, step: 10, value: 80, unit: '' },
      { type: 'range', id: 'wolframr', label: 'Wolfram Rows', min: 20, max: 120, step: 5, value: 60, unit: '' },
      { type: 'range', id: 'wolframrule', label: 'Wolfram Rule', min: 0, max: 255, step: 1, value: 30, unit: '' },
      { type: 'range', id: 'tick', label: 'Tick Speed', min: 1, max: 40, step: 1, value: 15, unit: '' }
    ]
  },
  {
    title: 'Scroll Reveal',
    controls: [
      { type: 'range', id: 'dur', label: 'Duration', min: 100, max: 2000, step: 50, value: 700, unit: 'ms' },
      { type: 'range', id: 'slide', label: 'Slide Distance', min: 0, max: 80, step: 2, value: 24, unit: 'px' },
      { type: 'select', id: 'easing', label: 'Easing', options: [
        { value: 'cubic-bezier(0,0,0.2,1)', label: 'ease-out (FRL default)' },
        { value: 'cubic-bezier(0.4,0,0.2,1)', label: 'ease-in-out' },
        { value: 'cubic-bezier(0.16,1,0.3,1)', label: 'ease-out-expo' },
        { value: 'cubic-bezier(0.34,1.56,0.64,1)', label: 'ease-out-back (bounce)' },
        { value: 'linear', label: 'linear' }
      ]},
      { type: 'range', id: 'thresh', label: 'Threshold', min: 0, max: 1, step: 0.05, value: 0.15, unit: '' }
    ]
  },
  {
    title: 'Blur Reveal',
    controls: [
      { type: 'range', id: 'blur', label: 'Blur Amount', min: 0, max: 30, step: 1, value: 12, unit: 'px' },
      { type: 'range', id: 'blurdur', label: 'Blur Duration', min: 200, max: 2000, step: 50, value: 900, unit: 'ms' }
    ]
  },
  {
    title: 'Stagger',
    controls: [
      { type: 'range', id: 'stagger', label: 'Nav Stagger', min: 0, max: 300, step: 10, value: 80, unit: 'ms' }
    ]
  },
  {
    title: 'Background Particles',
    controls: [
      { type: 'range', id: 'count', label: 'Count', min: 0, max: 400, step: 5, value: 200, unit: '' },
      { type: 'range', id: 'speed', label: 'Speed', min: 0, max: 2, step: 0.1, value: 0.4, unit: '' }
    ]
  }
];

const BURST_CONFIG = {
  STRENGTH: 300,
  DECAY: 0.97,
  RADIUS: 400
};

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════════════════════════════════ */

const GEOMETRIC_SHAPES = ['torus', 'sphere', 'circle', 'cube', 'helix'];

const state = {
  frameCount: 0,
  divergeBaseShape: 'torus',
  mouse: { x: 0, y: 0, active: false },
  burst: { active: false, x: 0, y: 0, strength: 0, frame: 0 },
  shapePoints: [],
  lifeGrid: [],
  lifeGeneration: 0,
  lifeTickCounter: 0,
  wolframRows: [],
  wolframTickCounter: 0,
  caOffsets: {},
  observer: null,
  shapeAnimId: null,
  bgAnimId: null,
  dynamicStyle: null
};

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function $(id) {
  return document.getElementById(id);
}

function getVal(id) {
  const el = $(id);
  if (!el) return null;
  return el.type === 'range' ? parseFloat(el.value) : el.value;
}

function setVal(id, value) {
  const el = $(id);
  if (!el) return;
  el.value = value;
  const valEl = $('v-' + id.replace('s-', '').replace('r-', ''));
  if (valEl) {
    const unit = el.dataset.unit || '';
    valEl.textContent = value + unit;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   UI GENERATION
   ═══════════════════════════════════════════════════════════════════════════ */

function generateControls() {
  const container = $('controls');
  let html = '';

  CONTROL_SECTIONS.forEach(section => {
    html += `<h2>${section.title}</h2>`;

    if (section.type === 'presets') {
      html += '<div class="preset-bar" id="preset-bar">';
      section.options.forEach((preset, i) => {
        const active = preset === 'warm' ? ' active' : '';
        html += `<button class="preset-btn${active}" data-preset="${preset}">${section.labels[i]}</button>`;
      });
      html += '</div>';
    } else if (section.controls) {
      section.controls.forEach(control => {
        if (control.type === 'range') {
          html += `
            <label>${control.label} <span class="val" id="v-${control.id}">${control.value}${control.unit}</span></label>
            <input type="range" id="r-${control.id}" min="${control.min}" max="${control.max}" step="${control.step}" value="${control.value}" data-unit="${control.unit}">
          `;
        } else if (control.type === 'select') {
          html += `<label>${control.label}</label>`;
          html += `<select id="s-${control.id}">`;
          if (control.optgroups) {
            control.optgroups.forEach(group => {
              html += `<optgroup label="${group.label}">`;
              group.options.forEach(opt => {
                html += `<option value="${opt.value}">${opt.label}</option>`;
              });
              html += `</optgroup>`;
            });
          } else {
            control.options.forEach(opt => {
              html += `<option value="${opt.value}">${opt.label}</option>`;
            });
          }
          html += `</select>`;
        }
      });
    }
  });

  html += '<button class="replay-btn" id="replay-btn">Replay All Animations</button>';

  container.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHAPE RENDERING SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

const ShapeRenderer = {
  canvas: null,
  ctx: null,

  init() {
    this.canvas = $('shape-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setupMouseTracking();
    this.setupClickBurst();
    this.initPoints();
  },

  resize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    this.canvas.width = size;
    this.canvas.height = size;
  },

  setupMouseTracking() {
    this.canvas.style.pointerEvents = 'auto';
    document.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      state.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      state.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      state.mouse.active = (
        state.mouse.x >= 0 && state.mouse.x <= this.canvas.width &&
        state.mouse.y >= 0 && state.mouse.y <= this.canvas.height
      );
    });
    document.addEventListener('mouseleave', () => { state.mouse.active = false; });
  },

  setupClickBurst() {
    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      state.burst.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      state.burst.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      state.burst.strength = BURST_CONFIG.STRENGTH;
      state.burst.active = true;
      state.burst.frame = 0;
    });
  },

  initPoints() {
    const shape = getVal('s-shape');
    if (shape === 'diverge') {
      state.divergeBaseShape = GEOMETRIC_SHAPES[Math.floor(Math.random() * GEOMETRIC_SHAPES.length)];
    }
    const count = getVal('r-points');
    state.shapePoints = [];
    for (let i = 0; i < count; i++) {
      state.shapePoints.push({
        t: i / count,
        idx: i,
        angle: (i / count) * Math.PI * 2,
        offsetX: 0,
        offsetY: 0,
        lx: 1 + (Math.random() - 0.5) * 0.5,
        ly: 1 + (Math.random() - 0.5) * 0.5,
        lz: 20 + (Math.random() - 0.5) * 0.5,
        rx: 0.1 + (Math.random() - 0.5) * 0.2,
        ry: 0.1 + (Math.random() - 0.5) * 0.2,
        rz: 0.1 + (Math.random() - 0.5) * 0.2,
        seed: Math.random() * 1000,
        divergeVx: (Math.random() - 0.5) * 0.3,
        divergeVy: (Math.random() - 0.5) * 0.3,
        divergeVz: (Math.random() - 0.5) * 0.3
      });
    }
  },

  getPosition(point, shape, frame, cx, cy) {
    const majorR = getVal('r-major');
    const minorR = getVal('r-minor');
    const rotSpeed = getVal('r-rotspeed');
    const t = point.t;
    const idx = point.idx;
    const count = state.shapePoints.length;

    switch (shape) {
      case 'torus': {
        const u = t * Math.PI * 2;
        const v = (idx % 20) / 20 * Math.PI * 2 + 0.001 * frame * rotSpeed;
        return {
          x: cx + (majorR + minorR * Math.cos(v)) * Math.cos(u),
          y: cy + (majorR + minorR * Math.cos(v)) * Math.sin(u),
          z: minorR * Math.sin(v)
        };
      }
      case 'sphere': {
        const golden = (1 + Math.sqrt(5)) / 2;
        const phi = 2 * Math.PI * idx / golden + 0.0005 * frame * rotSpeed;
        const theta = Math.acos(1 - 2 * t);
        const sx = majorR * Math.sin(theta) * Math.cos(phi);
        const sy = majorR * Math.sin(theta) * Math.sin(phi);
        const sz = majorR * Math.cos(theta);
        const rot = 0.001 * frame * rotSpeed;
        return {
          x: cx + sx * Math.cos(rot) - sz * Math.sin(rot),
          y: cy + sy,
          z: sx * Math.sin(rot) + sz * Math.cos(rot)
        };
      }
      case 'circle': {
        const r = majorR + 15 * Math.sin(frame * 0.001 + idx);
        const a = t * Math.PI * 2;
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, z: 0 };
      }
      case 'cube': {
        const side = Math.floor(idx / (count / 6));
        const st = (idx % (count / 6)) / (count / 6);
        const row = Math.floor(st * Math.sqrt(count / 6));
        const col = (st * Math.sqrt(count / 6)) % 1;
        const half = majorR * 0.7;
        let px, py, pz;
        switch (side % 6) {
          case 0: px = -half + 2*half*col; py = -half + 2*half*row/Math.sqrt(count/6); pz = half; break;
          case 1: px = -half + 2*half*col; py = -half + 2*half*row/Math.sqrt(count/6); pz = -half; break;
          case 2: px = half; py = -half + 2*half*col; pz = -half + 2*half*row/Math.sqrt(count/6); break;
          case 3: px = -half; py = -half + 2*half*col; pz = -half + 2*half*row/Math.sqrt(count/6); break;
          case 4: px = -half + 2*half*col; py = half; pz = -half + 2*half*row/Math.sqrt(count/6); break;
          default: px = -half + 2*half*col; py = -half; pz = -half + 2*half*row/Math.sqrt(count/6); break;
        }
        const rot = 0.001 * frame * rotSpeed;
        const rx = px * Math.cos(rot) - pz * Math.sin(rot);
        const rz = px * Math.sin(rot) + pz * Math.cos(rot);
        return { x: cx + rx, y: cy + py, z: rz };
      }
      case 'helix': {
        const turns = 4;
        const angle = t * turns * Math.PI * 2 + 0.001 * frame * rotSpeed;
        const helixY = (t - 0.5) * majorR * 2;
        const helixR = minorR * 1.5;
        return {
          x: cx + Math.cos(angle) * helixR,
          y: cy + helixY,
          z: Math.sin(angle) * helixR
        };
      }
      case 'lorenz': {
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = 0.002 * rotSpeed;
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const dxdt = sigma * (point.ly - point.lx);
          const dydt = point.lx * (rho - point.lz) - point.ly;
          const dzdt = point.lx * point.ly - beta * point.lz;
          point.lx += dxdt * dt;
          point.ly += dydt * dt;
          point.lz += dzdt * dt;
        }
        const scale = majorR / 45;
        const rot = 0.0003 * frame * rotSpeed;
        const px = point.lx * scale;
        const py = (point.lz - 25) * scale;
        const pz = point.ly * scale;
        const rpx = px * Math.cos(rot) - pz * Math.sin(rot);
        const rpz = px * Math.sin(rot) + pz * Math.cos(rot);
        return { x: cx + rpx, y: cy + py, z: rpz };
      }
      case 'rossler': {
        const a = 0.2, b = 0.2, c = 5.7;
        const dt = 0.012 * rotSpeed;
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const dxdt = -point.ry - point.rz;
          const dydt = point.rx + a * point.ry;
          const dzdt = b + point.rz * (point.rx - c);
          point.rx += dxdt * dt;
          point.ry += dydt * dt;
          point.rz += dzdt * dt;
          if (Math.abs(point.rx) > 100) point.rx *= 0.99;
          if (Math.abs(point.ry) > 100) point.ry *= 0.99;
          if (Math.abs(point.rz) > 100) point.rz *= 0.99;
        }
        const scale = majorR / 25;
        const rot = 0.0003 * frame * rotSpeed;
        const px = point.rx * scale;
        const py = point.ry * scale;
        const pz = (point.rz - 5) * scale;
        const rpx = px * Math.cos(rot) - pz * Math.sin(rot);
        const rpz = px * Math.sin(rot) + pz * Math.cos(rot);
        return { x: cx + rpx, y: cy + py, z: rpz };
      }
      case 'diverge': {
        const chaos = Math.min(frame * 0.0004 * rotSpeed, 1);
        const chaos3 = chaos * chaos * chaos;
        const basePos = this.getPosition(point, state.divergeBaseShape, frame, cx, cy);
        const tx = basePos.x - cx;
        const ty = basePos.y - cy;
        const tz = basePos.z;
        point.divergeVx += (Math.sin(point.seed + frame * 0.01) * 0.15) * chaos3;
        point.divergeVy += (Math.cos(point.seed * 1.3 + frame * 0.013) * 0.15) * chaos3;
        point.divergeVz += (Math.sin(point.seed * 0.7 + frame * 0.009) * 0.1) * chaos3;
        const dx = point.divergeVx * chaos3 * 80;
        const dy = point.divergeVy * chaos3 * 80;
        const dz = point.divergeVz * chaos3 * 80;
        return { x: cx + tx + dx, y: cy + ty + dy, z: tz + dz };
      }
      default:
        return { x: cx, y: cy, z: 0 };
    }
  },

  drawPoints(rendered, repelStrength, glowSize) {
    if (state.burst.active) {
      state.burst.strength *= BURST_CONFIG.DECAY;
      state.burst.frame++;
      if (state.burst.strength < 0.5) state.burst.active = false;
    }

    rendered.sort((a, b) => a.z - b.z);
    const recover = state.burst.active ? 0.015 : 0.08;

    for (let i = 0; i < rendered.length; i++) {
      const r = rendered[i];
      let mx = 0, my = 0;

      if (state.mouse.active && repelStrength > 0) {
        const dx = r.x - state.mouse.x;
        const dy = r.y - state.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (1 - dist / 150) * (1 - dist / 150) * repelStrength;
          const ang = Math.atan2(dy, dx);
          mx = Math.cos(ang) * force;
          my = Math.sin(ang) * force;
        }
      }

      if (state.burst.active) {
        const bdx = r.x - state.burst.x;
        const bdy = r.y - state.burst.y;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
        if (bdist < BURST_CONFIG.RADIUS && bdist > 0.1) {
          const bforce = (1 - bdist / BURST_CONFIG.RADIUS) * state.burst.strength;
          const bang = Math.atan2(bdy, bdx);
          mx += Math.cos(bang) * bforce;
          my += Math.sin(bang) * bforce;
        }
      }

      if (r._pi !== undefined) {
        const sp = state.shapePoints[r._pi];
        sp.offsetX += (mx - sp.offsetX) * recover;
        sp.offsetY += (my - sp.offsetY) * recover;
        r.x += sp.offsetX;
        r.y += sp.offsetY;
      } else {
        const key = Math.round(r.x) + ',' + Math.round(r.y);
        if (!state.caOffsets[key]) state.caOffsets[key] = { ox: 0, oy: 0 };
        state.caOffsets[key].ox += (mx - state.caOffsets[key].ox) * (recover * 1.5);
        state.caOffsets[key].oy += (my - state.caOffsets[key].oy) * (recover * 1.5);
        r.x += state.caOffsets[key].ox;
        r.y += state.caOffsets[key].oy;
      }

      if (glowSize > 0) {
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, glowSize, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(139, 131, 120, ' + (r.opacity * 0.07) + ')';
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(139, 131, 120, ' + r.opacity + ')';
      this.ctx.fill();
    }

    if (state.frameCount % 300 === 0) state.caOffsets = {};
  },

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const shape = getVal('s-shape');
    const dotSize = getVal('r-dotsize');
    const glowSize = getVal('r-glow');
    const repelStrength = getVal('r-repel');

    this.ctx.clearRect(0, 0, w, h);
    state.frameCount++;

    if (shape === 'life' || shape === 'wolfram') {
      const majorR = getVal('r-major');
      const rotSpeed = getVal('r-rotspeed');
      const rot = 0.0005 * state.frameCount * rotSpeed;

      if (shape === 'life') {
        CASimulator.tickLife();
        const gs = getVal('r-gridsize');
        const cellSpacing = majorR * 2 / gs;
        const rendered = [];

        for (let gy = 0; gy < gs; gy++) {
          for (let gx = 0; gx < gs; gx++) {
            if (!state.lifeGrid[gy] || !state.lifeGrid[gy][gx]) continue;

            const px = (gx - gs / 2) * cellSpacing;
            const py = (gy - gs / 2) * cellSpacing;
            const pz = 0;

            const tiltAngle = 0.5;
            const tpy = py * Math.cos(tiltAngle) - pz * Math.sin(tiltAngle);
            const tpz = py * Math.sin(tiltAngle) + pz * Math.cos(tiltAngle);

            const rpx = px * Math.cos(rot) - tpz * Math.sin(rot);
            const rpz = px * Math.sin(rot) + tpz * Math.cos(rot);

            const persp = 800 / (800 + rpz);
            const screenX = cx + rpx * persp;
            const screenY = cy + tpy * persp;

            const depthNorm = (rpz + 300) / 600;
            const opacity = 0.2 + 0.5 * Math.max(0, Math.min(1, depthNorm));

            rendered.push({ x: screenX, y: screenY, z: rpz, opacity, size: dotSize * persp, _ox: 0, _oy: 0 });
          }
        }

        this.drawPoints(rendered, repelStrength, glowSize);

      } else if (shape === 'wolfram') {
        CASimulator.tickWolfram();
        const rendered = [];
        const cylRadius = majorR * 0.8;
        const wMaxRows = getVal('r-wolframr');
        const wWidth = getVal('r-wolframw');
        const rowSpacing = majorR * 2 / wMaxRows;

        for (let rowIdx = 0; rowIdx < state.wolframRows.length; rowIdx++) {
          const row = state.wolframRows[rowIdx];
          const rowY = (rowIdx - state.wolframRows.length / 2) * rowSpacing;

          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            if (!row[colIdx]) continue;

            const angle = (colIdx / wWidth) * Math.PI * 2 + rot;
            const px = Math.cos(angle) * cylRadius;
            const pz = Math.sin(angle) * cylRadius;

            const persp = 800 / (800 + pz);
            const screenX = cx + px * persp;
            const screenY = cy + rowY * persp;

            const depthNorm = (pz + cylRadius) / (2 * cylRadius);
            const opacity = 0.15 + 0.5 * Math.max(0, Math.min(1, depthNorm));

            rendered.push({ x: screenX, y: screenY, z: pz, opacity, size: dotSize * persp, _ox: 0, _oy: 0 });
          }
        }

        this.drawPoints(rendered, repelStrength, glowSize);
      }

      state.shapeAnimId = requestAnimationFrame(() => this.draw());
      return;
    }

    const rendered = [];
    for (let i = 0; i < state.shapePoints.length; i++) {
      const p = state.shapePoints[i];
      const pos = this.getPosition(p, shape, state.frameCount, cx, cy);
      const perspective = 800 / (800 + pos.z);
      const sx = cx + (pos.x - cx) * perspective;
      const sy = cy + (pos.y - cy) * perspective;
      const depthNorm = (pos.z + 300) / 600;
      const opacity = 0.2 + 0.45 * Math.max(0, Math.min(1, depthNorm));
      rendered.push({ x: sx, y: sy, z: pos.z, opacity, size: dotSize * perspective, _pi: i });
    }

    this.drawPoints(rendered, repelStrength, glowSize);
    state.shapeAnimId = requestAnimationFrame(() => this.draw());
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   CELLULAR AUTOMATA SIMULATOR
   ═══════════════════════════════════════════════════════════════════════════ */

const CASimulator = {
  initLife() {
    const gs = getVal('r-gridsize');
    state.lifeGrid = [];
    state.lifeGeneration = 0;
    state.lifeTickCounter = 0;
    for (let y = 0; y < gs; y++) {
      state.lifeGrid[y] = [];
      for (let x = 0; x < gs; x++) {
        state.lifeGrid[y][x] = Math.random() < 0.35 ? 1 : 0;
      }
    }
  },

  stepLife() {
    const gs = getVal('r-gridsize');
    const next = [];
    for (let y = 0; y < gs; y++) {
      next[y] = [];
      for (let x = 0; x < gs; x++) {
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = (y + dy + gs) % gs;
            const nx = (x + dx + gs) % gs;
            if (state.lifeGrid[ny] && state.lifeGrid[ny][nx]) neighbors++;
          }
        }
        if (state.lifeGrid[y] && state.lifeGrid[y][x]) {
          next[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          next[y][x] = (neighbors === 3) ? 1 : 0;
        }
      }
    }
    state.lifeGrid = next;
    state.lifeGeneration++;
  },

  tickLife() {
    const tickRate = getVal('r-tick');
    state.lifeTickCounter++;
    if (state.lifeTickCounter >= tickRate) {
      state.lifeTickCounter = 0;
      this.stepLife();
    }
  },

  initWolfram() {
    const ww = getVal('r-wolframw');
    state.wolframRows = [];
    state.wolframTickCounter = 0;
    const first = [];
    for (let i = 0; i < ww; i++) first[i] = 0;
    first[Math.floor(ww / 2)] = 1;
    state.wolframRows.push(first);
  },

  stepWolfram() {
    const ww = getVal('r-wolframw');
    const rule = getVal('r-wolframrule');
    const maxRows = getVal('r-wolframr');
    const prev = state.wolframRows[state.wolframRows.length - 1];
    const next = [];
    for (let i = 0; i < ww; i++) {
      const left = prev[(i - 1 + ww) % ww];
      const center = prev[i];
      const right = prev[(i + 1) % ww];
      const pattern = (left << 2) | (center << 1) | right;
      next[i] = (rule >> pattern) & 1;
    }
    state.wolframRows.push(next);
    if (state.wolframRows.length > maxRows) {
      state.wolframRows.shift();
    }
  },

  tickWolfram() {
    const tickRate = getVal('r-tick');
    state.wolframTickCounter++;
    if (state.wolframTickCounter >= tickRate) {
      state.wolframTickCounter = 0;
      this.stepWolfram();
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   BACKGROUND PARTICLES SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

const BackgroundParticles = {
  canvas: null,
  ctx: null,
  particles: [],

  init() {
    this.canvas = $('particles');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  create() {
    if (state.bgAnimId) cancelAnimationFrame(state.bgAnimId);
    const count = getVal('r-count');
    const speed = getVal('r-speed');
    this.particles = [];
    if (count === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.25
      });
    }
    this.animate();
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(139,131,120,' + p.o + ')';
      this.ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = 'rgba(139,131,120,' + (0.15 * (1 - dist / 120)) + ')';
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    state.bgAnimId = requestAnimationFrame(() => this.animate());
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

const ScrollReveal = {
  setupObserver() {
    const thresh = getVal('r-thresh');
    if (state.observer) state.observer.disconnect();
    state.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          state.observer.unobserve(entry.target);
        }
      });
    }, { threshold: thresh, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('visible')) {
        state.observer.observe(el);
      }
    });
  },

  revealNav() {
    const stagger = getVal('r-stagger');
    const brand = document.querySelector('.site-nav .brand');
    const links = document.querySelectorAll('.site-nav a');
    brand.classList.remove('visible');
    links.forEach(a => a.classList.remove('visible'));
    setTimeout(() => brand.classList.add('visible'), 100);
    links.forEach((a, i) => {
      setTimeout(() => a.classList.add('visible'), 200 + i * stagger);
    });
  },

  revealHero() {
    const title = document.querySelector('.hero h1');
    const subtitle = document.querySelector('.hero p');
    const shapeWrap = document.querySelector('.shape-hero-wrap');

    if (title) {
      title.classList.remove('visible');
      setTimeout(() => {
        title.style.opacity = '';
        title.classList.add('visible');
      }, 1000);
    }
    if (subtitle) {
      subtitle.classList.remove('visible');
      setTimeout(() => {
        subtitle.style.opacity = '';
        subtitle.classList.add('visible');
      }, 2000);
    }
    if (shapeWrap) {
      shapeWrap.classList.remove('visible');
      setTimeout(() => {
        shapeWrap.classList.add('visible');
        ShapeRenderer.draw();
      }, 3000);
    }
  },

  replay() {
    if (state.shapeAnimId) cancelAnimationFrame(state.shapeAnimId);
    document.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
    const title = document.querySelector('.hero h1');
    const subtitle = document.querySelector('.hero p');
    if (title) title.style.opacity = '0';
    if (subtitle) subtitle.style.opacity = '0';
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      this.setupObserver();
      this.revealNav();
      this.revealHero();
    }, 50);
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   UI CONTROLLER
   ═══════════════════════════════════════════════════════════════════════════ */

const UIController = {
  init() {
    this.setupDynamicStyles();
    this.bindSliders();
    this.bindSelects();
    this.bindButtons();
    this.bindPresets();
    this.applyStyles();
  },

  setupDynamicStyles() {
    state.dynamicStyle = document.createElement('style');
    document.head.appendChild(state.dynamicStyle);
  },

  bindSliders() {
    const sliderIds = ['points', 'major', 'minor', 'rotspeed', 'dotsize', 'glow', 'repel',
                      'dur', 'slide', 'thresh', 'blur', 'blurdur', 'stagger', 'count', 'speed',
                      'gridsize', 'wolframw', 'wolframr', 'wolframrule', 'tick'];

    sliderIds.forEach(id => {
      const slider = $('r-' + id);
      if (!slider) return;

      slider.addEventListener('input', () => {
        const valEl = $('v-' + id);
        if (valEl) {
          const unit = slider.dataset.unit || '';
          valEl.textContent = slider.value + unit;
        }
        this.applyStyles();
        this.updatePrompt();
      });

      if (['points'].includes(id)) {
        slider.addEventListener('change', () => ShapeRenderer.initPoints());
      }
      if (['gridsize'].includes(id)) {
        slider.addEventListener('change', () => CASimulator.initLife());
      }
      if (['wolframw', 'wolframr', 'wolframrule'].includes(id)) {
        slider.addEventListener('change', () => CASimulator.initWolfram());
      }
      if (['count', 'speed'].includes(id)) {
        slider.addEventListener('change', () => BackgroundParticles.create());
      }
    });
  },

  bindSelects() {
    const shapeSelect = $('s-shape');
    if (shapeSelect) {
      shapeSelect.addEventListener('change', () => {
        ShapeRenderer.initPoints();
        CASimulator.initLife();
        CASimulator.initWolfram();
        state.frameCount = 0;
        this.updatePrompt();
      });
    }

    const easingSelect = $('s-easing');
    if (easingSelect) {
      easingSelect.addEventListener('change', () => {
        this.applyStyles();
        this.updatePrompt();
      });
    }
  },

  bindButtons() {
    const toggleBtn = $('toggle-btn');
    const controls = $('controls');
    const page = $('page');
    const promptBar = $('prompt-bar');

    toggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('fullpage')) return;
      controls.classList.toggle('collapsed');
      page.classList.toggle('full');
      promptBar.classList.toggle('full');
    });

    const fullpageBtn = $('fullpage-btn');
    fullpageBtn.addEventListener('click', () => {
      const isFullpage = document.body.classList.toggle('fullpage');
      fullpageBtn.textContent = isFullpage ? 'Exit Full Page' : 'Full Page';
      if (isFullpage) {
        page.classList.add('full');
      } else {
        page.classList.remove('full');
        if (!controls.classList.contains('collapsed')) {
          page.classList.remove('full');
        }
      }
    });

    const replayBtn = $('replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.applyStyles();
        ScrollReveal.replay();
        BackgroundParticles.create();
      });
    }

    const copyBtn = $('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const promptText = $('prompt-out').textContent;
        navigator.clipboard.writeText(promptText).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
        });
      });
    }
  },

  bindPresets() {
    const presetBar = $('preset-bar');
    if (presetBar) {
      presetBar.addEventListener('click', e => {
        const btn = e.target.closest('.preset-btn');
        if (!btn) return;
        const name = btn.dataset.preset;
        const preset = PRESETS[name];
        if (!preset) return;

        Object.keys(preset).forEach(key => {
          if (key !== 'easing') {
            setVal('r-' + key, preset[key]);
          }
        });
        if (preset.easing) setVal('s-easing', preset.easing);

        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.frameCount = 0;
        ShapeRenderer.initPoints();
        CASimulator.initLife();
        CASimulator.initWolfram();
        BackgroundParticles.create();
        this.applyStyles();
        ScrollReveal.replay();
        this.updatePrompt();
      });
    }
  },

  applyStyles() {
    const dur = getVal('r-dur');
    const slide = getVal('r-slide');
    const easing = getVal('s-easing');
    const blur = getVal('r-blur');
    const blurdur = getVal('r-blurdur');

    state.dynamicStyle.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(${slide}px);
        filter: blur(${blur}px);
        transition:
          opacity ${dur}ms ${easing},
          transform ${dur}ms ${easing},
          filter ${blurdur}ms ${easing};
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    `;
  },

  updatePrompt() {
    const d = PRESETS.warm;
    const parts = [];
    const shape = getVal('s-shape');
    if (shape !== 'torus') parts.push('a ' + shape + ' shape instead of torus');
    const points = getVal('r-points');
    if (points !== 200) parts.push(points + ' shape points');
    const major = getVal('r-major');
    if (major !== 200) parts.push('major radius of ' + major);
    const minor = getVal('r-minor');
    if (minor !== 60) parts.push('minor radius of ' + minor);
    const dur = getVal('r-dur');
    if (dur !== d.dur) parts.push('scroll reveal duration of ' + dur + 'ms');
    const slide = getVal('r-slide');
    if (slide !== d.slide) parts.push(slide + 'px slide-up distance');
    const easing = getVal('s-easing');
    if (easing !== d.easing) {
      const easingLabel = $('s-easing').selectedOptions[0].text;
      parts.push(easingLabel + ' easing');
    }
    const blur = getVal('r-blur');
    if (blur !== d.blur) parts.push(blur === 0 ? 'no blur effect' : blur + 'px blur reveal');
    const stagger = getVal('r-stagger');
    if (stagger !== d.stagger) parts.push(stagger + 'ms nav stagger');
    const count = getVal('r-count');
    if (count !== d.count) parts.push(count === 0 ? 'no background particles' : count + ' background particles');

    const promptOut = $('prompt-out');
    if (parts.length === 0) {
      promptOut.textContent = 'Add a 3D torus (donut) shape rendered on canvas using parametric equations projected to 2D with perspective. Include scroll-triggered fade-in/slide-up/blur-reveal animations via IntersectionObserver, staggered nav reveals (80ms), background particle system with connecting lines, and mouse-repel interaction on the shape. Use EB Garamond serif font on warm off-white (#F5F1E8). Academic/research aesthetic.';
    } else {
      promptOut.textContent = 'Add a 3D shape animation and scroll reveals to my website, with: ' + parts.join(', ') + '. Render shape on canvas with parametric math, perspective projection, and mouse repulsion. Include IntersectionObserver scroll reveals and background particles.';
    }
  },

  randomizeShape() {
    const shapeSelect = $('s-shape');
    const options = shapeSelect.options;
    const randomIdx = Math.floor(Math.random() * options.length);
    shapeSelect.selectedIndex = randomIdx;
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   PLAYGROUND EASTER EGG (Ctrl+. / Cmd+.)
   ═══════════════════════════════════════════════════════════════════════════ */

function setupPlaygroundShortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === '.' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (window.innerWidth <= 768) return;
      document.body.classList.toggle('playground');
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */

function init() {
  generateControls();
  ShapeRenderer.init();
  CASimulator.initLife();
  CASimulator.initWolfram();
  BackgroundParticles.init();
  BackgroundParticles.create();
  UIController.init();
  UIController.randomizeShape();
  ScrollReveal.revealNav();
  ScrollReveal.revealHero();
  ScrollReveal.setupObserver();
  UIController.updatePrompt();
  setupPlaygroundShortcut();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
