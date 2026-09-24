#!/usr/bin/env node
// Fills README.template.en.md / README.template.zh.md with project cards +
// a timestamp, writing README.md (English, the default GitHub shows) and
// README.zh-TW.md. Chart images are referenced by fixed filename
// (assets/*-en.svg / assets/*-zh.svg), written separately by
// generate-charts.mjs — this script never touches the charts themselves, so
// hand-editing the prose in a template never gets clobbered by a data
// refresh and vice versa.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { t } from './lib/i18n.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

function fmtRange(p, lang) {
  const s = t(lang);
  const start = p.start.startsWith('TODO') ? '?' : p.start;
  const end = p.end === 'ongoing' ? s.ongoing : (p.end.startsWith('TODO') ? '?' : p.end);
  return `${start} – ${end}`;
}

function projectCard(p, lang) {
  const s = t(lang);
  const title = p.title[lang] || p.title.en;
  const heading = p.repo && !p.repo.startsWith('TODO') ? `[${title}](https://github.com/${p.repo})` : title;
  const stack = (p.stack || []).join(' · ');
  const note = p.scaleNote && p.scaleNote[lang] && !String(p.scaleNote[lang]).startsWith('TODO') ? p.scaleNote[lang] : null;
  const tagChips = (p.tags || []).map((tag) => `\`${tag}\``).join(' ');
  return [
    `#### ${heading}`,
    `${tagChips} · ${fmtRange(p, lang)}`,
    '',
    p.summary[lang] || p.summary.en,
    `- ${s.highlight}: ${p.highlight[lang] || p.highlight.en}`,
    note ? `- ${s.scale}: ${note}` : undefined,
    stack ? `- ${s.stack}: ${stack}` : undefined,
    '',
  ].filter((l) => l !== undefined).join('\n');
}

async function buildOne({ templateFile, outFile, lang }) {
  const [template, projectsRaw] = await Promise.all([
    readFile(path.join(ROOT, templateFile), 'utf8'),
    readFile(path.join(ROOT, 'projects.json'), 'utf8'),
  ]);
  const { projects } = JSON.parse(projectsRaw);

  const cards = projects.map((p) => projectCard(p, lang)).join('\n');
  const generatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

  const out = template
    .replace('{{PROJECT_CARDS}}', cards)
    .replace('{{GENERATED_AT}}', generatedAt);

  await writeFile(path.join(ROOT, outFile), out, 'utf8');
  console.log(`wrote ${outFile}`);
}

async function main() {
  await buildOne({ templateFile: 'README.template.en.md', outFile: 'README.md', lang: 'en' });
  await buildOne({ templateFile: 'README.template.zh.md', outFile: 'README.zh-TW.md', lang: 'zh' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
