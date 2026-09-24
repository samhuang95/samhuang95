// All calls to the GitHub API live here. Every number the charts draw comes
// from this module or from projects.json — nothing is invented in the chart
// code itself.
//
// Auth: needs a token with at least `read:user` (for the GraphQL
// contributionsCollection query) — the default Actions GITHUB_TOKEN does not
// carry that scope, so the workflow expects a PAT in the GH_README_TOKEN
// secret (see ../../SETUP.md).

const TOKEN = process.env.GH_README_TOKEN || process.env.GITHUB_TOKEN;
const LOGIN = process.env.GH_LOGIN || 'samhuang95';

function authHeaders(accept = 'application/vnd.github+json') {
  if (!TOKEN) throw new Error('No GitHub token found (set GH_README_TOKEN or GITHUB_TOKEN).');
  return { Authorization: `Bearer ${TOKEN}`, Accept: accept, 'User-Agent': `${LOGIN}-readme-bot` };
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${await res.text()}`);
  const j = await res.json();
  if (j.errors) throw new Error(`GitHub GraphQL errors: ${JSON.stringify(j.errors)}`);
  return j.data;
}

const CONTRIBUTION_CALENDAR_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
  }
}`;

// Returns [{ weekStart: 'YYYY-MM-DD', total }] for the trailing ~12 months,
// oldest first. One GraphQL call for the whole year (GitHub's own weekly
// grid, Sun-Sat) — this is "contributions" in the same sense as the profile
// contribution graph: commits, PRs, issues and reviews, across every repo
// you've touched (not just the ones listed in projects.json), and includes
// private contributions when the token is your own and your profile has
// "Include private contributions" turned on. That's deliberate — this chart
// answers "how active am I overall," not "how active on tracked projects,"
// which is a different question from the per-project timeline chart.
export async function fetchWeeklyContributions() {
  const now = new Date();
  const from = new Date(now.getTime());
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  const data = await graphql(CONTRIBUTION_CALENDAR_QUERY, {
    login: LOGIN,
    from: from.toISOString(),
    to: now.toISOString(),
  });
  const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
  return weeks.map((w) => ({
    weekStart: w.contributionDays[0]?.date,
    total: w.contributionDays.reduce((sum, d) => sum + d.contributionCount, 0),
  })).filter((w) => w.weekStart);
}
