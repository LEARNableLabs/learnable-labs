(function(root) {
'use strict';

var Core = {};

Core.torusPoint = function(t, idx, majorR, minorR, rotSpeed, frame, cx, cy) {
  var u = t * Math.PI * 2;
  var v = (idx % 20) / 20 * Math.PI * 2 + 0.001 * frame * rotSpeed;
  return {
    x: cx + (majorR + minorR * Math.cos(v)) * Math.cos(u),
    y: cy + (majorR + minorR * Math.cos(v)) * Math.sin(u),
    z: minorR * Math.sin(v)
  };
};

Core.spherePoint = function(t, idx, majorR, rotSpeed, frame, cx, cy) {
  var golden = (1 + Math.sqrt(5)) / 2;
  var phi = 2 * Math.PI * idx / golden + 0.0005 * frame * rotSpeed;
  var theta = Math.acos(1 - 2 * t);
  var sx = majorR * Math.sin(theta) * Math.cos(phi);
  var sy = majorR * Math.sin(theta) * Math.sin(phi);
  var sz = majorR * Math.cos(theta);
  var rot = 0.001 * frame * rotSpeed;
  return {
    x: cx + sx * Math.cos(rot) - sz * Math.sin(rot),
    y: cy + sy,
    z: sx * Math.sin(rot) + sz * Math.cos(rot)
  };
};

Core.helixPoint = function(t, majorR, minorR, rotSpeed, frame, cx, cy) {
  var turns = 4;
  var angle = t * turns * Math.PI * 2 + 0.001 * frame * rotSpeed;
  var helixY = (t - 0.5) * majorR * 2;
  var helixR = minorR * 1.5;
  return {
    x: cx + Math.cos(angle) * helixR,
    y: cy + helixY,
    z: Math.sin(angle) * helixR
  };
};

Core.perspectiveScale = function(fov, z) {
  return fov / (fov + z);
};

Core.countLifeNeighbors = function(grid, x, y, gridSize) {
  var neighbors = 0;
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      var ny = (y + dy + gridSize) % gridSize;
      var nx = (x + dx + gridSize) % gridSize;
      if (grid[ny] && grid[ny][nx]) neighbors++;
    }
  }
  return neighbors;
};

Core.applyWolframRule = function(left, center, right, rule) {
  var pattern = (left << 2) | (center << 1) | right;
  return (rule >> pattern) & 1;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Core;
} else {
  root.Core = Core;
}

})(typeof window !== 'undefined' ? window : this);
