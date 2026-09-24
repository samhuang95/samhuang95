// Real brand logos for tags that ARE a brand/technology (Vue.js, Docker,
// PostgreSQL, ...), via the `simple-icons` package — auto-matched against
// its FULL catalog (3,400+ brands) by title, so adding a new tag with a
// real logo never requires touching this file: just use the tag string
// that matches the brand's official name on https://simpleicons.org (case
// doesn't matter, e.g. "vue.js" and "Vue.js" both match). A tag that isn't
// a real, cataloged brand (App, Backend, AI/LLM, Enterprise, ChromaDB,
// FastMCP, ...) simply has no match and renders as a plain text pill —
// nothing is invented or approximated.
//
// This is intentionally an allowlist of REAL brands only, sourced entirely
// from simple-icons' own data — never a hand-drawn or guessed icon. If a
// brand you want isn't in simple-icons yet, it has no logo here either.
import * as simpleIcons from 'simple-icons';

// Built once at module load: official title (lowercased) -> icon data.
// simple-icons exports each icon as `si<Name>`; a handful of brands have
// two disambiguated variants sharing one display title (e.g. "Spring" /
// "Spring" for spring.io vs Spring (creators platform)) — for those rare
// collisions this simply keeps whichever the package lists first, which
// doesn't affect any tag used in this project's tags so far.
const ICONS_BY_TITLE = new Map();
for (const [exportName, icon] of Object.entries(simpleIcons)) {
  if (!exportName.startsWith('si') || !icon || !icon.title || !icon.path || !icon.hex) continue;
  const key = icon.title.toLowerCase();
  if (!ICONS_BY_TITLE.has(key)) ICONS_BY_TITLE.set(key, icon);
}

// Returns { path, hex } (simple-icons' 24x24 path data + official brand
// hex) for a tag whose string matches a real brand's title, or null.
export function iconFor(tag) {
  if (!tag) return null;
  const icon = ICONS_BY_TITLE.get(String(tag).trim().toLowerCase());
  return icon ? { path: icon.path, hex: `#${icon.hex}` } : null;
}