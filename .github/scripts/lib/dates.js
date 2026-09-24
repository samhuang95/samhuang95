// Small date helpers shared by the timeline and activity charts.

// "YYYY-MM" -> Date at day 1 UTC. Returns null for anything else (including
// TODO placeholders) so callers can skip incomplete projects.json entries
// instead of guessing a date.
export function parseYearMonth(s) {
  if (typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1));
}

const MONTH_ZH = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthLabel(date, lang, { withYear = false } = {}) {
  const m = lang === 'en' ? MONTH_EN[date.getUTCMonth()] : `${MONTH_ZH[date.getUTCMonth()]}月`;
  return withYear ? (lang === 'en' ? `${m} ${date.getUTCFullYear()}` : `${date.getUTCFullYear()}/${m}`) : m;
}

export function monthsBetween(a, b) {
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
}
