// Real brand logos for tags that ARE a brand/technology (.NET, Android,
// Three.js, ...), via the `simple-icons` package. This is deliberately an
// allowlist keyed by exact tag string, not "every tag gets an icon": most
// tags (App, Backend, AI/LLM, Research, Enterprise, ...) are conceptual
// categories with no real logo, and those pills stay text-only, exactly as
// before. Never invent or approximate a logo for a tag that isn't a real
// brand — an unmapped tag simply renders without an icon.
//
// To add an icon for a new tag: find its export name in simple-icons
// (https://simpleicons.org, or `Object.keys(await import('simple-icons'))`)
// and add one line below. simple-icons is the one npm dependency this repo
// has — used only at chart-generation time; the generated SVGs are static
// markup with the icon path data already baked in, so nothing extra ships
// to anyone viewing the README.
import { siDotnet, siAndroid, siThreedotjs } from 'simple-icons';

const ICONS = {
  '.NET': siDotnet,
  Android: siAndroid,
  'Three.js': siThreedotjs,
};

// Returns { path, hex } (simple-icons' 24x24 path data + official brand
// hex) for a tag with a known logo, or null if the tag isn't a brand.
export function iconFor(tag) {
  const icon = ICONS[tag];
  return icon ? { path: icon.path, hex: `#${icon.hex}` } : null;
}
