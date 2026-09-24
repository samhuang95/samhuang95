// Shared color tokens for every generated chart. Light-mode only.
// Source: Anthropic dataviz skill reference palette — validated with
// scripts/validate_palette.js (all 8 categorical slots pass adjacent-pair
// CVD safety for light surface — see the repo's SETUP.md for the command).

export const colors = {
  surface: '#fcfcfb',
  page: '#f9f9f7',
  textPrimary: '#0b0b0b',
  textSecondary: '#52514e',
  textMuted: '#898781',
  gridline: '#e1e0d9',
  baseline: '#c3c2b7',
  // categorical slots 1-8, validated adjacent-pair order — keep this order,
  // and keep CATEGORY_COLOR_ORDER (i18n.js) in step with it.
  cat: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
  catOther: '#c3c2b7', // neutral gray for an unregistered / overflow tag — never a 9th hue
  // sequential (magnitude) — blue, light -> dark
  seq: ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6', '#1c5cab', '#0d366b'],
};

import { CATEGORY_COLOR_ORDER } from './i18n.js';

// Color for a project's primary tag (tags[0]). Falls back to catOther for
// any tag not (yet) in CATEGORY_COLOR_ORDER, or past the 8-slot cap —
// see the comment on CATEGORY_COLOR_ORDER for why this never invents a
// 9th hue instead.
export function categoryColor(tag) {
  if (!tag) return colors.catOther;
  const idx = CATEGORY_COLOR_ORDER.indexOf(tag);
  if (idx === -1 || idx >= colors.cat.length) return colors.catOther;
  return colors.cat[idx];
}
