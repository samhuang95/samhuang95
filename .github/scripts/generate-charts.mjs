#!/usr/bin/env node
// Entry point run by the GitHub Actions workflow. Fetches real data from the
// GitHub API, combines it with projects.json, and writes SVG charts (an
// English + a Chinese variant of each, light-mode only) into /assets.
// README.md / README.zh-TW.md are built separately by render-readme.mjs so a
// manual README edit and a data refresh don't fight each other.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchWeeklyContributions } from './lib/github.js';
import { renderTags } from './charts/tags.js';
import { renderTimeline } from './charts/timeline.js';
import { renderActivity } from './charts/activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

async function main() {
  const raw = await readFile(path.join(ROOT, 'projects.json'), 'utf8');
  const { projects } = JSON.parse(raw);

  console.log(`Loaded ${projects.length} projects from projects.json`);

  let weekly = [];
  try {
    weekly = await fetchWeeklyContributions();
  } catch (err) {
    console.warn(`! contribution fetch failed (${err.message}) — activity chart will render empty. Check GH_README_TOKEN has read:user scope.`);
  }

  const assetsDir = path.join(ROOT, 'assets');
  await mkdir(assetsDir, { recursive: true });

  const charts = [
    ['tags', (lang) => renderTags(projects, lang)],
    ['timeline', (lang) => renderTimeline(projects, lang)],
    ['activity', (lang) => renderActivity(weekly, lang)],
  ];

  for (const [name, render] of charts) {
    for (const lang of ['en', 'zh']) {
      const svg = render(lang);
      const file = path.join(assetsDir, `${name}-${lang}.svg`);
      await writeFile(file, svg, 'utf8');
      console.log(`  wrote ${path.relative(ROOT, file)}`);
    }
  }

  // Stats consumed by render-readme.mjs (kept separate from the SVGs so the
  // README template can drop numbers inline without parsing SVG).
  const stats = {
    generatedAt: new Date().toISOString(),
    totalProjects: projects.length,
    totalContributionsLast12Months: weekly.reduce((sum, w) => sum + w.total, 0),
  };
  await writeFile(path.join(assetsDir, 'stats.json'), JSON.stringify(stats, null, 2), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
