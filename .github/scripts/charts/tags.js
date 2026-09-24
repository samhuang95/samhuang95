// Every tag as its own self-labeled badge (a flowing wall of pills, like the
// shields.io-style badges common on GitHub profiles) rather than a bar
// chart. Counts every tag across every project (not just the primary
// tag[0]) — this is a frequency view, not a part-to-whole chart, since a
// project can carry more than one tag.
//
// A stacked/bar treatment was tried first and rejected: with a free-form,
// growing tag vocabulary (easily 10+ distinct tags), most segments would be
// only 1-2 occurrences — too narrow to carry their own label inline, and
// coloring each tag its own hue would blow past the 8-slot CVD-safe
// categorical cap (anti-pattern: never invent a 9th hue). A badge scales to
// any number of tags because each one carries its own text regardless of
// size, so there's nothing to run out of room for.
import { colors } from '../lib/palette.js';
import { t } from '../lib/i18n.js';
import { svgDoc, rect, text, measureText, iconPath } from '../lib/svg.js';
import { iconFor } from '../lib/icons.js';

const W = 760;
const PAD = 24;
const PILL_H = 28;
const PILL_GAP_X = 8;
const PILL_GAP_Y = 10;
const PILL_PAD_X = 12;
const FONT_SIZE = 12.5;
const ICON_SIZE = 14;
const ICON_GAP = 5;

export function renderTags(projects, lang) {
  const c = colors;
  const s = t(lang);

  const counts = new Map();
  for (const p of projects) {
    for (const tag of p.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const topPad = 40;
  const maxRowW = W - PAD * 2;

  let x = PAD;
  let y = topPad;
  const pills = [];
  for (const [tag, count] of entries) {
    const label = count > 1 ? `${tag} ×${count}` : tag;
    const icon = iconFor(tag);
    const textW = measureText(label, FONT_SIZE);
    const contentW = textW + (icon ? ICON_SIZE + ICON_GAP : 0);
    const pillW = contentW + PILL_PAD_X * 2;
    if (x + pillW > PAD + maxRowW && x > PAD) {
      x = PAD;
      y += PILL_H + PILL_GAP_Y;
    }
    pills.push([x, y, pillW, label, icon]);
    x += pillW + PILL_GAP_X;
  }

  const body = [
    text(PAD, PAD + 4, s.tagsTitle, { size: 14, weight: 700, color: c.textPrimary }),
    text(W - PAD, PAD + 4, s.tagsCaption(entries.length, projects.length), { size: 11.5, color: c.textMuted, anchor: 'end' }),
    pills.map(([px, py, pw, label, icon]) => {
      const bg = rect(px, py, pw, PILL_H, { rx: PILL_H / 2, fill: c.seq[0], stroke: c.seq[2], strokeWidth: 1 });
      if (!icon) {
        return [bg, text(px + pw / 2, py + PILL_H / 2 + FONT_SIZE * 0.35, label, { size: FONT_SIZE, weight: 600, color: c.textPrimary, anchor: 'middle' })].join('');
      }
      // With an icon, content (icon + text) is left-anchored inside the
      // padding rather than text-centered, so the icon sits flush against
      // the label instead of floating off-center.
      const contentX = px + PILL_PAD_X;
      const iconY = py + (PILL_H - ICON_SIZE) / 2;
      const textX = contentX + ICON_SIZE + ICON_GAP;
      return [
        bg,
        iconPath(icon.path, contentX, iconY, ICON_SIZE, icon.hex),
        text(textX, py + PILL_H / 2 + FONT_SIZE * 0.35, label, { size: FONT_SIZE, weight: 600, color: c.textPrimary }),
      ].join('');
    }).join('\n'),
  ].join('\n');

  const H = y + PILL_H + PAD;

  return svgDoc(W, Math.max(H, 90), c.surface, body);
}
