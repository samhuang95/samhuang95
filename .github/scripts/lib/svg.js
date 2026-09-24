// Minimal, dependency-free SVG string builder. Deliberately not a charting
// library — every chart in charts/*.js composes these primitives directly so
// the output stays auditable and has zero npm attack surface for a workflow
// that runs on a schedule with write access to the repo.

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Rough but stable width estimate (no headless browser in CI): CJK code
// points render ~1em wide, everything else ~0.56em. Good enough to decide
// "does this label fit" per the dataviz skill's "measure first" rule —
// callers should still leave a few px of slack.
export function measureText(str, fontSize) {
  let w = 0;
  for (const ch of String(str)) {
    const cp = ch.codePointAt(0);
    const isCJK = (cp >= 0x2e80 && cp <= 0x9fff) || (cp >= 0xac00 && cp <= 0xd7ff) || (cp >= 0xff00 && cp <= 0xffef);
    w += (isCJK ? 1.0 : 0.56) * fontSize;
  }
  return w;
}

export function fitText(str, fontSize, maxWidth, ellipsis = '…') {
  if (measureText(str, fontSize) <= maxWidth) return str;
  let out = '';
  for (const ch of String(str)) {
    if (measureText(out + ch + ellipsis, fontSize) > maxWidth) return out + ellipsis;
    out += ch;
  }
  return out;
}

// Single-quoted family names: this string is interpolated straight into a
// double-quoted SVG attribute, so an inner double quote would terminate the
// attribute early and corrupt every element after it.
const FONT = `-apple-system, 'Segoe UI', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif`;

export function text(x, y, str, { size = 12, weight = 400, color, anchor = 'start', family = FONT } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(str)}</text>`;
}

export function rect(x, y, w, h, { rx = 0, fill, opacity, stroke, strokeWidth = 1 } = {}) {
  if (w <= 0 || h <= 0) return '';
  return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${rx}" fill="${fill}"${opacity != null ? ` opacity="${opacity}"` : ''}${stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : ''}/>`;
}

// A horizontal bar with a 4px rounded cap at the data end and a square
// baseline edge, per the dataviz skill's mark spec. dir: 1 grows rightward
// from x, -1 grows leftward from x (x is then the right edge).
export function hBar(x, y, w, h, fill, dir = 1) {
  if (w <= 0.01) return '';
  const r = Math.min(4, h / 2, w);
  const x0 = dir === 1 ? x : x - w;
  // Build with a path so only the data-end corners are rounded.
  if (dir === 1) {
    return `<path d="M${x0},${y} H${x0 + w - r} A${r},${r} 0 0 1 ${x0 + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x0 + w - r},${y + h} H${x0} Z" fill="${fill}"/>`;
  }
  return `<path d="M${x0 + w},${y} H${x0 + r} A${r},${r} 0 0 0 ${x0},${y + r} V${y + h - r} A${r},${r} 0 0 0 ${x0 + r},${y + h} H${x0 + w} Z" fill="${fill}"/>`;
}

export function line(x1, y1, x2, y2, { color, width = 1, dash } = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

// A 2px round-join/cap line through an ordered list of [x, y] points, per
// the dataviz skill's line mark spec.
export function polyline(points, { color, width = 2 } = {}) {
  if (points.length < 2) return '';
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

// The area under a line, closed down to `baselineY`, filled as a ~10% wash
// — never a saturated block — per the dataviz skill's area-fill spec.
export function areaPath(points, baselineY, { fill, opacity = 0.1 } = {}) {
  if (points.length < 2) return '';
  const top = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const [lastX] = points[points.length - 1];
  const [firstX] = points[0];
  return `<path d="${top} L${lastX.toFixed(2)},${baselineY} L${firstX.toFixed(2)},${baselineY} Z" fill="${fill}" opacity="${opacity}"/>`;
}

// A simple-icons-style path (authored on a 24x24 grid) placed at (x, y)
// scaled to `size` px. Used for brand logos in icons.js — a plain <path>
// inside a translate+scale <g>, no nested <svg> needed.
export function iconPath(d, x, y, size, fill) {
  const scale = size / 24;
  return `<g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${scale.toFixed(4)})"><path d="${d}" fill="${fill}"/></g>`;
}

export function circle(cx, cy, r, { fill, ring } = {}) {
  const parts = [];
  if (ring) parts.push(`<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="${ring}"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`);
  return parts.join('');
}

export function svgDoc(width, height, bg, body) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">
<rect width="${width}" height="${height}" fill="${bg}"/>
${body}
</svg>`;
}
