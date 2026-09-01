<template>
  <div>
    <div class="an-header">
      <h1 class="admin-title" style="margin-bottom:0;">Analytics</h1>
      <div class="an-range">
        <button
          v-for="opt in ranges"
          :key="opt"
          class="an-range__btn"
          :class="{ active: days === opt }"
          @click="days = opt"
        >
          {{ opt }}d
        </button>
      </div>
    </div>

    <!-- Summary -->
    <div class="row">
      <div class="col-6 col-xl-3">
        <div class="an-tile">
          <div class="an-tile__label">Unique visitors</div>
          <div class="an-tile__value">{{ fmt(totals.visitors) }}</div>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="an-tile">
          <div class="an-tile__label">Page views</div>
          <div class="an-tile__value">{{ fmt(totals.views) }}</div>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="an-tile">
          <div class="an-tile__label">Tracked clicks</div>
          <div class="an-tile__value">{{ fmt(totals.clicks) }}</div>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="an-tile">
          <div class="an-tile__label">Avg load time</div>
          <div class="an-tile__value">{{ totals.avgLoadMs ? (totals.avgLoadMs / 1000).toFixed(2) + 's' : '—' }}</div>
        </div>
      </div>
    </div>

    <!-- Daily chart -->
    <div class="admin-card">
      <h3 class="admin-section-title" style="margin-top:0;">
        Per day
        <span class="admin-hint">bars are page views · line markers are unique visitors</span>
      </h3>

      <div v-if="!maxViews" class="an-empty">
        No visits recorded yet in this range. Data starts collecting as soon as this is deployed.
      </div>

      <div v-else class="an-chart-wrap">
        <svg
          class="an-chart"
          :viewBox="`0 0 ${chartW} ${chartH}`"
          role="img"
          :aria-label="`Page views per day for the last ${days} days`"
          preserveAspectRatio="none"
        >
          <line
            v-for="t in yTicks"
            :key="t.v"
            :x1="0" :x2="chartW" :y1="t.y" :y2="t.y"
            class="an-chart__grid"
          />
          <g v-for="(d, i) in series" :key="d.day">
            <rect
              class="an-chart__bar"
              :x="i * barStep + barGap / 2"
              :y="chartH - barH(d.views)"
              :width="barW"
              :height="barH(d.views)"
            >
              <title>{{ d.day }} — {{ d.views }} views, {{ d.visitors }} visitors</title>
            </rect>
            <rect
              v-if="d.visitors"
              class="an-chart__visitors"
              :x="i * barStep + barGap / 2"
              :y="chartH - barH(d.visitors) - 1"
              :width="barW"
              height="2"
            />
          </g>
        </svg>
        <div class="an-chart__axis">
          <span>{{ series[0]?.day }}</span>
          <span>{{ fmtNum(maxViews) }} max</span>
          <span>{{ series[series.length - 1]?.day }}</span>
        </div>
      </div>
    </div>

    <!-- Breakdowns -->
    <div class="row">
      <div v-for="panel in panels" :key="panel.title" class="col-12 col-lg-6">
        <div class="admin-card">
          <h3 class="admin-section-title" style="margin-top:0;">{{ panel.title }}</h3>
          <div v-if="!panel.rows.length" class="an-empty">Nothing yet.</div>
          <ul v-else class="an-bars list-unstyled">
            <li v-for="row in panel.rows" :key="row.label" class="an-bar">
              <div class="an-bar__fill" :style="{ width: pct(row.count, panel.rows) + '%' }"></div>
              <span class="an-bar__label">{{ panel.format ? panel.format(row.label) : (row.label || '—') }}</span>
              <span class="an-bar__count">{{ fmt(row.count) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Raw event log -->
    <div class="admin-card">
      <h3 class="admin-section-title" style="margin-top:0;">
        Recent activity
        <span class="admin-hint">latest 100 events, newest first</span>
      </h3>
      <div v-if="!recent.length" class="an-empty">Nothing yet.</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Event</th>
              <th>Page</th>
              <th>Location</th>
              <th>Device</th>
              <th>Browser / OS</th>
              <th>Screen</th>
              <th>Referrer</th>
              <th>Lang / TZ</th>
              <th>Load</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in recent" :key="e.id">
              <td>{{ when(e.createdAt) }}</td>
              <td>
                <span class="an-pill" :class="e.eventType === 'click' ? 'an-pill--click' : ''">
                  {{ e.eventType === 'click' ? e.target || 'click' : 'view' }}
                </span>
              </td>
              <td>{{ e.path }}</td>
              <td>{{ [e.city, e.country].filter(Boolean).join(', ') || '—' }}</td>
              <td>{{ e.deviceType || '—' }}</td>
              <td>{{ [e.browser, e.browserVersion].filter(Boolean).join(' ') }} / {{ e.os || '—' }}</td>
              <td>{{ e.screenWidth ? `${e.screenWidth}×${e.screenHeight}` : '—' }}</td>
              <td>{{ e.referrerHost || 'direct' }}</td>
              <td>{{ [e.language, e.timezone].filter(Boolean).join(' · ') || '—' }}</td>
              <td>{{ e.loadTimeMs ? (e.loadTimeMs / 1000).toFixed(2) + 's' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="an-note open-sans-font">
      Cookie-free and no permission prompts: no cookie is set, no IP address is stored, and
      visitors are counted with a salted hash that changes every day, so the same person is
      not traceable across days. Location is city-level from the CDN, never GPS. Bots are
      filtered out and <code>/admin</code> is never recorded.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Analytics – Admin' })

const ranges = [7, 30, 90]
const days = ref(30)

const { data } = await useFetch(() => `/api/admin/analytics?days=${days.value}`, {
  watch: [days],
})

const series = computed(() => (data.value as any)?.series ?? [])
const totals = computed(() => (data.value as any)?.totals ?? { views: 0, clicks: 0, visitors: 0, avgLoadMs: null })
const breakdowns = computed(() => (data.value as any)?.breakdowns ?? {})
const recent = computed(() => (data.value as any)?.recent ?? [])

// ── Chart geometry ────────────────────────────────────────────
// Plain SVG rather than a charting library — this is a bar chart with one
// series, not worth shipping a dependency to the admin bundle for.
const chartH = 160
const barStep = 16
const barGap = 4
const barW = barStep - barGap
const chartW = computed(() => Math.max(series.value.length * barStep, 1))
const maxViews = computed(() => Math.max(...series.value.map((d: any) => d.views), 0))

function barH(v: number) {
  if (!maxViews.value) return 0
  return Math.max((v / maxViews.value) * (chartH - 8), v > 0 ? 2 : 0)
}

const yTicks = computed(() => {
  if (!maxViews.value) return []
  return [0.25, 0.5, 0.75, 1].map((f) => ({
    v: Math.round(maxViews.value * f),
    y: chartH - f * (chartH - 8),
  }))
})

// ── Breakdown panels ──────────────────────────────────────────
const panels = computed(() => [
  { title: 'Top pages', rows: breakdowns.value.pages ?? [] },
  {
    title: 'Referrers',
    rows: breakdowns.value.referrers ?? [],
    format: (v: string) => v || 'Direct / typed in',
  },
  {
    title: 'Countries',
    rows: breakdowns.value.countries ?? [],
    format: (v: string) => (v ? countryName(v) : 'Unknown'),
  },
  { title: 'Clicked links', rows: breakdowns.value.clickTargets ?? [] },
  { title: 'Devices', rows: breakdowns.value.devices ?? [] },
  { title: 'Browsers', rows: breakdowns.value.browsers ?? [] },
  { title: 'Operating systems', rows: breakdowns.value.operatingSystems ?? [] },
])

function pct(count: number, rows: { count: number }[]) {
  const max = Math.max(...rows.map((r) => r.count), 1)
  return Math.max((count / max) * 100, 2)
}

// ── Formatting ────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat().format(n ?? 0)
const fmtNum = (n: number) => fmt(n)

const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null

function countryName(code: string) {
  try {
    return regionNames?.of(code.toUpperCase()) || code
  } catch {
    return code
  }
}

function when(ts: number | string) {
  const d = new Date(ts)
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.an-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.an-range { display: flex; gap: 6px; }
.an-range__btn {
  border: 1px solid #ddd;
  background: #fff;
  color: #555;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
}
.an-range__btn.active { background: #1a1a2e; border-color: #1a1a2e; color: #fff; }

.an-tile {
  background: #fff;
  border-radius: 8px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}
.an-tile__label {
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #888;
}
.an-tile__value { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }

.an-chart-wrap { overflow-x: auto; }
.an-chart { width: 100%; min-width: 320px; height: 160px; display: block; }
.an-chart__grid { stroke: #eee; stroke-width: 1; vector-effect: non-scaling-stroke; }
.an-chart__bar { fill: #1a1a2e; }
.an-chart__bar:hover { fill: #4a4a8e; }
.an-chart__visitors { fill: #fa5b0f; }
.an-chart__axis {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.an-bars { margin: 0; }
.an-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px;
  font-size: 13px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2px;
}
.an-bar__fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: rgba(26, 26, 46, 0.08);
  border-radius: 4px;
}
.an-bar__label {
  position: relative;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.an-bar__count { position: relative; color: #666; font-weight: 600; flex-shrink: 0; }

.an-pill {
  display: inline-block;
  background: #eef;
  color: #334;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 11px;
  white-space: nowrap;
}
.an-pill--click { background: #fdece3; color: #a8410b; }

.an-empty { color: #999; font-size: 14px; padding: 8px 0; }

.an-note {
  font-size: 12px;
  color: #888;
  line-height: 1.7;
  margin-top: 4px;
}
.an-note code { background: #eee; padding: 1px 5px; border-radius: 3px; }
</style>
