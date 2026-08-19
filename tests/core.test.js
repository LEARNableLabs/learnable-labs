const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../lib/core.js');

describe('torusPoint', () => {
  it('returns an object with x, y, z', () => {
    const p = Core.torusPoint(0.5, 0, 300, 40, 0.6, 0, 400, 400);
    assert.ok(typeof p.x === 'number');
    assert.ok(typeof p.y === 'number');
    assert.ok(typeof p.z === 'number');
  });

  it('produces points centered around cx, cy', () => {
    const cx = 400, cy = 400, majorR = 300, minorR = 40;
    const p = Core.torusPoint(0, 0, majorR, minorR, 0, 0, cx, cy);
    assert.ok(Math.abs(p.x - cx) <= majorR + minorR + 1);
    assert.ok(Math.abs(p.y - cy) <= majorR + minorR + 1);
  });

  it('z stays within minor radius bounds', () => {
    const minorR = 40;
    for (let i = 0; i < 100; i++) {
      const p = Core.torusPoint(i / 100, i, 300, minorR, 0.6, 50, 400, 400);
      assert.ok(Math.abs(p.z) <= minorR + 0.01);
    }
  });

  it('generates distinct points for different t values', () => {
    const p1 = Core.torusPoint(0.0, 0, 300, 40, 0, 0, 400, 400);
    const p2 = Core.torusPoint(0.5, 0, 300, 40, 0, 0, 400, 400);
    const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    assert.ok(dist > 1);
  });
});

describe('spherePoint', () => {
  it('returns an object with x, y, z', () => {
    const p = Core.spherePoint(0.5, 10, 300, 0.6, 0, 400, 400);
    assert.ok(typeof p.x === 'number');
    assert.ok(typeof p.y === 'number');
    assert.ok(typeof p.z === 'number');
  });

  it('produces points within majorR of center', () => {
    const cx = 400, cy = 400, majorR = 300;
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      const p = Core.spherePoint(t, i, majorR, 0, 0, cx, cy);
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dz = p.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      assert.ok(dist <= majorR + 1, `point ${i} at distance ${dist} exceeds majorR ${majorR}`);
    }
  });

  it('generates distinct points for different indices', () => {
    const p1 = Core.spherePoint(0.1, 0, 300, 0, 0, 400, 400);
    const p2 = Core.spherePoint(0.1, 10, 300, 0, 0, 400, 400);
    const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2);
    assert.ok(dist > 0.1);
  });
});

describe('helixPoint', () => {
  it('returns an object with x, y, z', () => {
    const p = Core.helixPoint(0.5, 300, 40, 0.6, 0, 400, 400);
    assert.ok(typeof p.x === 'number');
    assert.ok(typeof p.y === 'number');
    assert.ok(typeof p.z === 'number');
  });

  it('y spans the height range based on majorR', () => {
    const majorR = 300;
    const pTop = Core.helixPoint(0.0, majorR, 40, 0, 0, 400, 400);
    const pBot = Core.helixPoint(1.0, majorR, 40, 0, 0, 400, 400);
    assert.ok(pTop.y < 400);
    assert.ok(pBot.y > 400);
  });

  it('x and z stay within helix radius', () => {
    const minorR = 40;
    const helixR = minorR * 1.5;
    for (let i = 0; i < 50; i++) {
      const p = Core.helixPoint(i / 50, 300, minorR, 0.6, 100, 400, 400);
      assert.ok(Math.abs(p.x - 400) <= helixR + 0.01);
      assert.ok(Math.abs(p.z) <= helixR + 0.01);
    }
  });
});

describe('perspectiveScale', () => {
  it('returns 1.0 when z is 0', () => {
    assert.strictEqual(Core.perspectiveScale(800, 0), 1.0);
  });

  it('returns value < 1 for positive z (farther away)', () => {
    const scale = Core.perspectiveScale(800, 200);
    assert.ok(scale < 1.0);
    assert.ok(scale > 0);
  });

  it('returns value > 1 for negative z (closer)', () => {
    const scale = Core.perspectiveScale(800, -200);
    assert.ok(scale > 1.0);
  });

  it('computes expected values', () => {
    const eps = 1e-10;
    assert.ok(Math.abs(Core.perspectiveScale(800, 0) - 1.0) < eps);
    assert.ok(Math.abs(Core.perspectiveScale(800, 800) - 0.5) < eps);
    assert.ok(Math.abs(Core.perspectiveScale(800, 200) - 0.8) < eps);
  });

  it('approaches 0 as z approaches infinity', () => {
    const scale = Core.perspectiveScale(800, 100000);
    assert.ok(scale < 0.01);
  });
});

describe('countLifeNeighbors', () => {
  it('returns 0 for isolated cell', () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    assert.strictEqual(Core.countLifeNeighbors(grid, 1, 1, 3), 0);
  });

  it('counts all 8 neighbors when surrounded', () => {
    const grid = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    assert.strictEqual(Core.countLifeNeighbors(grid, 1, 1, 3), 8);
  });

  it('counts blinker neighbors correctly', () => {
    const grid = [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    assert.strictEqual(Core.countLifeNeighbors(grid, 2, 2, 5), 2);
    assert.strictEqual(Core.countLifeNeighbors(grid, 1, 2, 5), 3);
    assert.strictEqual(Core.countLifeNeighbors(grid, 3, 2, 5), 3);
  });

  it('wraps around edges (toroidal)', () => {
    const grid = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ];
    assert.strictEqual(Core.countLifeNeighbors(grid, 0, 0, 3), 1);
  });

  it('block pattern: center cells have 3 neighbors each', () => {
    const grid = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    assert.strictEqual(Core.countLifeNeighbors(grid, 1, 1, 4), 3);
    assert.strictEqual(Core.countLifeNeighbors(grid, 2, 1, 4), 3);
    assert.strictEqual(Core.countLifeNeighbors(grid, 1, 2, 4), 3);
    assert.strictEqual(Core.countLifeNeighbors(grid, 2, 2, 4), 3);
  });
});

describe('applyWolframRule', () => {
  it('rule 30: 111 -> 0', () => {
    assert.strictEqual(Core.applyWolframRule(1, 1, 1, 30), 0);
  });

  it('rule 30: 000 -> 0', () => {
    assert.strictEqual(Core.applyWolframRule(0, 0, 0, 30), 0);
  });

  it('rule 30: 001 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(0, 0, 1, 30), 1);
  });

  it('rule 30: 010 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(0, 1, 0, 30), 1);
  });

  it('rule 30: 011 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(0, 1, 1, 30), 1);
  });

  it('rule 30: 100 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(1, 0, 0, 30), 1);
  });

  it('rule 30: full first generation from single center cell', () => {
    const width = 5;
    const prev = [0, 0, 1, 0, 0];
    const next = [];
    for (let i = 0; i < width; i++) {
      const left = prev[(i - 1 + width) % width];
      const center = prev[i];
      const right = prev[(i + 1) % width];
      next.push(Core.applyWolframRule(left, center, right, 30));
    }
    assert.deepStrictEqual(next, [0, 1, 1, 1, 0]);
  });

  it('rule 110: 111 -> 0', () => {
    assert.strictEqual(Core.applyWolframRule(1, 1, 1, 110), 0);
  });

  it('rule 110: 110 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(1, 1, 0, 110), 1);
  });

  it('rule 110: 000 -> 0', () => {
    assert.strictEqual(Core.applyWolframRule(0, 0, 0, 110), 0);
  });

  it('rule 110: 001 -> 1', () => {
    assert.strictEqual(Core.applyWolframRule(0, 0, 1, 110), 1);
  });

  it('rule 110: full first generation from single center cell', () => {
    const width = 5;
    const prev = [0, 0, 1, 0, 0];
    const next = [];
    for (let i = 0; i < width; i++) {
      const left = prev[(i - 1 + width) % width];
      const center = prev[i];
      const right = prev[(i + 1) % width];
      next.push(Core.applyWolframRule(left, center, right, 110));
    }
    assert.deepStrictEqual(next, [0, 1, 1, 0, 0]);
  });
});
