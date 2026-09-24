#!/usr/bin/env node
// Local preview only — does NOT call the GitHub API. Uses sample-projects.json
// (illustrative dates) plus fabricated mock activity/size numbers so Sam can
// eyeball the visual design before wiring up real credentials. The real
// pipeline (generate-charts.mjs) never uses this file.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTags } from '../.github/scripts/charts/tags.js';
import { renderTimeline } from '../.github/scripts/charts/timeline.js';
import { renderActivity } from '../.github/scripts/charts/activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { projects } = JSON.parse(await readFile(path.join(__dirname, 'sample-projects.json'), 'utf8'));

// Mock ~52 weeks of overall contribution activity (all repos, not just
// tracked ones) with a gentle upward wobble, just for visual review.
function mockWeekly() {
  const now = new Date(Date.UTC(2026, 8, 24));
  const out = [];
  let level = 8;
  for (let i = 51; i >= 0; i--) {
    const d = new Date(now.getTime());
    d.setUTCDate(d.getUTCDate() - i * 7);
    level = Math.max(1, level + (Math.random() - 0.45) * 4);
    out.push({ weekStart: d.toISOString().slice(0, 10), total: Math.round(level) });
  }
  return out;
}

await mkdir(__dirname, { recursive: true });

const weekly = mockWeekly();

const charts = {
  tags: (lang) => renderTags(projects, lang),
  timeline: (lang) => renderTimeline(projects, lang, new Date('2026-09-24T00:00:00Z')),
  activity: (lang) => renderActivity(weekly, lang),
};

for (const [name, render] of Object.entries(charts)) {
  for (const lang of ['en', 'zh']) {
    const svg = render(lang);
    await writeFile(path.join(__dirname, `${name}-${lang}.svg`), svg, 'utf8');
    console.log(`wrote preview/${name}-${lang}.svg`);
  }
}
