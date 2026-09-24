// All fixed chart/UI copy in one place, English + Traditional Chinese.
// Project tags themselves (e.g. "App", "LLM", "n8n") are NOT translated —
// they're short, mostly-English labels you write once in projects.json and
// they render identically on both language pages, the same way the `stack`
// tech names already do.
//
// CATEGORY_COLOR_ORDER is the one place that assigns a fixed color to a
// *primary* tag (a project's tags[0] — see projects.json's _readme note).
// It's a hand-maintained list, not derived from the data, so a tag's color
// never shifts just because you added or removed other projects/tags
// ("color follows the entity" — dataviz skill). Capped at 8: that's the
// largest set the reference palette validates as CVD-safe for adjacent
// marks (stacked/adjacent bars). A project whose tags[0] isn't in this list
// yet renders in neutral gray until you add it here — nothing breaks, it
// just has no identity color assigned.
export const CATEGORY_COLOR_ORDER = ['Enterprise', 'AI/LLM', 'App', 'Creative AI'];

export const STRINGS = {
  en: {
    tagsTitle: 'Tags',
    tagsCaption: (distinctTags, totalProjects) => `${distinctTags} distinct tag${distinctTags === 1 ? '' : 's'} across ${totalProjects} project${totalProjects === 1 ? '' : 's'}`,
    tagCount: (n) => `${n}×`,
    timelineTitle: 'Development Timeline',
    now: 'now',
    timelineSkipped: (n) => `${n} project${n === 1 ? '' : 's'} without start/end dates not shown`,
    activityTitle: 'Contributions (last 12 months, all repos)',
    totalContributions: (n) => `${n} contributions`,
    perWeek: 'this week',
    highlight: 'Highlight',
    scale: 'Scale',
    stack: 'Stack',
    tags: 'Tags',
    ongoing: 'ongoing',
  },
  zh: {
    tagsTitle: '標籤分布',
    tagsCaption: (distinctTags, totalProjects) => `共 ${distinctTags} 種標籤・${totalProjects} 個專案`,
    tagCount: (n) => `${n} 次`,
    timelineTitle: '開發時程',
    now: '現在',
    timelineSkipped: (n) => `另有 ${n} 個專案尚未填寫開始/結束時間，未顯示於本圖`,
    activityTitle: '貢獻活躍度（近 12 個月，涵蓋所有 repo）',
    totalContributions: (n) => `共 ${n} 次貢獻`,
    perWeek: '本週',
    highlight: '亮點',
    scale: '規模',
    stack: '技術',
    tags: '標籤',
    ongoing: '進行中',
  },
};

export function t(lang) {
  if (!STRINGS[lang]) throw new Error(`Unknown lang "${lang}"`);
  return STRINGS[lang];
}

// A project's primary tag/category is tags[0]. Falls back gracefully (both
// for an empty tags array and for a tags[0] not yet in CATEGORY_COLOR_ORDER)
// so a half-filled projects.json never throws — it just renders that
// project in the neutral "other" color until you register the tag.
export function primaryTag(project) {
  return Array.isArray(project.tags) && project.tags.length ? project.tags[0] : null;
}
