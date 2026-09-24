// "Before -> after per item" -> one horizontal bar per project spanning
// start..end on a shared time axis, colored by primary tag (tags[0]) — same
// color mapping as activity.js's monthly stacks, so identity carries across
// both charts. This chart is the only one that needs its own legend for
// that color mapping (tags.js is a monochrome magnitude chart, not
// identity-colored), per "a legend is always present for >=2 series."
import { colors, categoryColor } from '../lib/palette.js';
import { CATEGORY_COLOR_ORDER, t, primaryTag } from '../lib/i18n.js';
import { svgDoc, rect, hBar, text, line, fitText } from '../lib/svg.js';
import { parseYearMonth, monthLabel, monthsBetween } from '../lib/dates.js';

const W = 760;
const PAD = 24;
const LABEL_COL = 240;
const ROW_H = 34;
const BAR_H = 18;

export function renderTimeline(projects, lang, now = new Date()) {
  const c = colors;
  const s = t(lang);
  const rows = projects
    .map((p) => ({ p, start: parseYearMonth(p.start), end: p.end === 'ongoing' ? now : parseYearMonth(p.end) }))
    .filter((r) => r.start && r.end);
  const skipped = projects.length - rows.length;

  rows.sort((a, b) => a.start - b.start);

  const minDate = rows.length ? rows.reduce((m, r) => (r.start < m ? r.start : m), rows[0].start) : now;
  const maxDate = rows.length ? rows.reduce((m, r) => (r.end > m ? r.end : m), rows[0].end) : now;
  const totalMonths = Math.max(monthsBetween(minDate, maxDate), 1);

  const plotX = PAD + LABEL_COL;
  const plotW = W - plotX - PAD;
  const topPad = 28;
  const chartH = topPad + rows.length * ROW_H + 34 + (skipped ? 20 : 0);

  const xFor = (d) => plotX + (monthsBetween(minDate, d) / totalMonths) * plotW;

  const grid = [];
  for (let m = 0; m <= totalMonths; m += 3) {
    const d = new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth() + m, 1));
    const gx = xFor(d);
    grid.push(line(gx, topPad, gx, topPad + rows.length * ROW_H, { color: c.gridline, width: 1 }));
    grid.push(text(gx, topPad + rows.length * ROW_H + 18, monthLabel(d, lang, { withYear: m === 0 || d.getUTCMonth() === 0 }), { size: 10.5, color: c.textMuted, anchor: 'middle' }));
  }

  const nowX = xFor(now);
  const nowMarker = (now >= minDate && now <= maxDate)
    ? [line(nowX, topPad - 6, nowX, topPad + rows.length * ROW_H, { color: c.textMuted, width: 1 }),
      text(nowX, topPad - 10, s.now, { size: 10, color: c.textMuted, anchor: 'middle' })].join('')
    : '';

  const presentTags = new Set(rows.map((r) => primaryTag(r.p)).filter(Boolean));
  // Order by CATEGORY_COLOR_ORDER (not first appearance) so this legend
  // lists tags in the same order as activity.js's — same entity, same
  // color, same position, wherever it shows up.
  const usedTags = [
    ...CATEGORY_COLOR_ORDER.filter((tag) => presentTags.has(tag)),
    ...[...presentTags].filter((tag) => !CATEGORY_COLOR_ORDER.includes(tag)), // unregistered -> gray, listed last
  ];

  const barRows = rows.map((r, i) => {
    const y = topPad + i * ROW_H;
    const x0 = xFor(r.start);
    const x1 = xFor(r.end);
    const title = r.p.title[lang] || r.p.title.en;
    const label = fitText(title, 12.5, LABEL_COL - 12);
    return [
      text(PAD, y + ROW_H / 2 + 4, label, { size: 12.5, color: c.textPrimary, weight: 600 }),
      hBar(x0, y + (ROW_H - BAR_H) / 2, Math.max(x1 - x0, 6), BAR_H, categoryColor(primaryTag(r.p))),
    ].join('');
  }).join('\n');

  const footer = skipped
    ? text(PAD, chartH - 6, s.timelineSkipped(skipped), { size: 10.5, color: c.textMuted })
    : '';

  const legendY = chartH + 22;
  const legend = usedTags.map((tag, i) => {
    const lx = PAD + i * 130;
    return [
      rect(lx, legendY - 9, 10, 10, { rx: 2, fill: categoryColor(tag) }),
      text(lx + 16, legendY, fitText(tag, 11, 108), { size: 11, color: c.textSecondary }),
    ].join('');
  }).join('\n');

  const H = legendY + PAD;

  const body = [
    text(PAD, PAD - 4, s.timelineTitle, { size: 14, weight: 700, color: c.textPrimary }),
    grid.join('\n'),
    nowMarker,
    barRows,
    footer,
    legend,
  ].join('\n');

  return svgDoc(W, Math.max(H, 90), c.surface, body);
}
