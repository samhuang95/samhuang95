#!/usr/bin/env node
// Builds a full-page preview for each language: sample data -> README
// markdown (local asset paths) -> HTML with github-markdown-css ->
// screenshot. Purely for Sam to eyeball the assembled page; the real
// README.md / README.zh-TW.md are produced by
// .github/scripts/render-readme.mjs against the real projects.json.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { t } from '../.github/scripts/lib/i18n.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function fmtRange(p, lang) {
  const s = t(lang);
  return `${p.start} – ${p.end === 'ongoing' ? s.ongoing : p.end}`;
}

function projectCard(p, lang) {
  const s = t(lang);
  const title = p.title[lang] || p.title.en;
  const note = p.scaleNote && p.scaleNote[lang] ? p.scaleNote[lang] : null;
  const stack = (p.stack || []).join(' · ');
  const tagChips = (p.tags || []).map((tag) => `\`${tag}\``).join(' ');
  return [
    `#### ${title}`,
    `${tagChips} · ${fmtRange(p, lang)}`,
    '',
    p.summary[lang] || p.summary.en,
    `- ${s.highlight}: ${p.highlight[lang] || p.highlight.en}`,
    note ? `- ${s.scale}: ${note}` : undefined,
    stack ? `- ${s.stack}: ${stack}` : undefined,
    '',
  ].filter((l) => l !== undefined).join('\n');
}

async function buildOne(lang, templateFile) {
  const [template, projectsRaw] = await Promise.all([
    readFile(path.join(ROOT, templateFile), 'utf8'),
    readFile(path.join(__dirname, 'sample-projects.json'), 'utf8'),
  ]);
  const { projects } = JSON.parse(projectsRaw);

  const cards = projects.map((p) => projectCard(p, lang)).join('\n');
  const md = template
    .replace('{{PROJECT_CARDS}}', cards)
    .replace('{{GENERATED_AT}}', '2026-09-24 09:00 UTC (sample)')
    .replace(/assets\//g, ''); // local preview: svgs sit next to this file, not under assets/

  await writeFile(path.join(__dirname, `README.preview.${lang}.md`), md, 'utf8');

  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="node_modules/github-markdown-css/github-markdown.css">
<style>
  body { background:#fff; margin:0; }
  .markdown-body { box-sizing:border-box; max-width:900px; margin:0 auto; padding:32px; }
</style></head>
<body><article class="markdown-body">${marked.parse(md)}</article></body></html>`;

  await writeFile(path.join(__dirname, `preview.${lang}.html`), html, 'utf8');
  console.log(`wrote preview/README.preview.${lang}.md and preview/preview.${lang}.html`);
}

await buildOne('en', 'README.template.en.md');
await buildOne('zh', 'README.template.zh.md');
