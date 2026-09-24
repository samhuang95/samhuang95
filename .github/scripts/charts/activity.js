// "Trend over time, one series" -> line + area wash (dataviz skill: "line;
// area for a single series" is the textbook default here). This deliberately
// covers ALL of your GitHub activity (every repo you've contributed to, not
// just the ones tracked in projects.json) — see fetchWeeklyContributions in
// lib/github.js for why. Single series needs no legend box; the title
// already says what's plotted.
import { colors } from '../lib/palette.js';
import { t } from '../lib/i18n.js';
import { svgDoc, polyline, areaPath, circle, text, line, fitText } from '../lib/svg.js';
import { monthLabel } from '../lib/dates.js';

const W = 760;
const PAD = 24;
const PLOT_H = 160;

// weekly: [{ weekStart: 'YYYY-MM-DD', total }] from github.js, oldest first
export function renderActivity(weekly, lang) {
  const c = colors;
  const s = t(lang);
  const rows = weekly.filter((w) => w.weekStart);
  if (rows.length === 0) {
    return svgDoc(W, 90, c.surface, text(PAD, 50, s.activityTitle, { size: 14, weight: 700, color: c.textPrimary }));
  }

  const topPad = 34;
  const plotBottom = topPad + PLOT_H;
  const plotLeft = PAD + 28; // room for y-axis tick labels
  const plotRight = W - PAD - 70; // room for the end-of-line value label
  const plotW = plotRight - plotLeft;

  const maxVal = Math.max(...rows.map((r) => r.total), 1);
  const yMax = niceCeil(maxVal);

  const xFor = (i) => plotLeft + (rows.length === 1 ? 0 : (i / (rows.length - 1)) * plotW);
  const yFor = (v) => plotBottom - (v / yMax) * PLOT_H;

  const points = rows.map((r, i) => [xFor(i), yFor(r.total)]);

  const yGrid = [0, 0.5, 1].map((f) => {
    const gy = plotBottom - f * PLOT_H;
    const val = Math.round(f * yMax);
    return [
      line(plotLeft, gy, plotRight, gy, { color: c.gridline, width: 1 }),
      text(plotLeft - 8, gy + 3, String(val), { size: 10, color: c.textMuted, anchor: 'end' }),
    ].join('');
  }).join('\n');

  // Month tick labels: one per calendar month, placed at that month's first
  // week in range (deduped so we never print the same month twice).
  const seenMonths = new Set();
  const ticks = [];
  rows.forEach((r, i) => {
    const d = new Date(r.weekStart + 'T00:00:00Z');
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    if (seenMonths.has(key)) return;
    seenMonths.add(key);
    ticks.push(text(xFor(i), plotBottom + 18, monthLabel(d, lang, { withYear: d.getUTCMonth() === 0 }), { size: 10, color: c.textMuted, anchor: 'middle' }));
  });

  const last = rows[rows.length - 1];
  const [lastX, lastY] = points[points.length - 1];
  const endLabel = [
    circle(lastX, lastY, 4, { fill: c.seq[3], ring: c.surface }),
    text(lastX + 10, lastY + 4, `${last.total}`, { size: 12, weight: 700, color: c.textPrimary }),
    text(lastX + 10, lastY + 17, fitText(s.perWeek, 10, 58), { size: 10, color: c.textMuted }),
  ].join('');

  const total = rows.reduce((sum, r) => sum + r.total, 0);

  const H = plotBottom + 30 + PAD;

  const body = [
    text(PAD, PAD - 4, s.activityTitle, { size: 14, weight: 700, color: c.textPrimary }),
    text(W - PAD, PAD - 4, s.totalContributions(total), { size: 11.5, color: c.textMuted, anchor: 'end' }),
    yGrid,
    line(plotLeft, plotBottom, plotRight, plotBottom, { color: c.baseline, width: 1 }),
    areaPath(points, plotBottom, { fill: c.seq[3] }),
    polyline(points, { color: c.seq[3] }),
    endLabel,
    ticks.join('\n'),
  ].join('\n');

  return svgDoc(W, H, c.surface, body);
}

function niceCeil(v) {
  if (v <= 10) return 10;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  const step = n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}
