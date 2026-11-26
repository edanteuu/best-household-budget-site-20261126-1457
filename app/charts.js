// SVG charts, drawn by hand from the numbers. One job: turn the household's
// figures into small, readable charts with no library and no network.

import { money0 } from './format.js';

// A donut of spending by category. `parts` is [{name, value, color}].
export function donut(parts, size = 220) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 80;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const arcs = parts
    .filter((p) => p.value > 0)
    .map((p) => {
      const frac = p.value / total;
      const len = Math.max(frac * c - 2, 0.5);
      const dash = `${len.toFixed(1)} ${(c - len).toFixed(1)}`;
      const el = `<circle cx="110" cy="110" r="${r}" fill="none" stroke="${p.color}" stroke-width="34" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
      offset += frac * c;
      return el;
    })
    .join('');
  const legend = parts
    .filter((p) => p.value > 0)
    .map(
      (p) =>
        `<li><span class="swatch" style="background:${p.color}"></span>${p.name}<b>${money0(p.value)}</b></li>`,
    )
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 220 220" width="${size}" height="${size}" role="img" aria-label="Spending by category chart">${arcs}<text x="110" y="104" text-anchor="middle" class="donut-total">${money0(total)}</text><text x="110" y="126" text-anchor="middle" class="donut-label">spent in Nov</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Horizontal budget bars: spent against the monthly limit, one row per category.
export function budgetBars(rows) {
  return rows
    .map((row) => {
      const over = row.spent > row.budget;
      const pctUsed = row.budget > 0 ? Math.min((row.spent / row.budget) * 100, 100) : 0;
      const state = over ? 'over' : pctUsed >= 85 ? 'close' : 'ok';
      return `<div class="bar-row">
        <div class="bar-head"><span class="bar-name"><span class="swatch" style="background:${row.color}"></span>${row.name}</span><span class="bar-figures">${money0(row.spent)} of ${money0(row.budget)}</span></div>
        <div class="bar-track"><div class="bar-fill ${state}" style="width:${pctUsed.toFixed(1)}%"></div></div>
        <div class="bar-note">${over ? `Over by ${money0(row.spent - row.budget)}` : `${money0(row.budget - row.spent)} left · ${Math.round(pctUsed)}% used`}</div>
      </div>`;
    })
    .join('');
}

// Vertical bars: income vs spending across months.
export function monthBars(months) {
  const max = Math.max(...months.flatMap((m) => [m.income, m.spent]), 1);
  const w = 560;
  const h = 240;
  const bw = 26;
  const gap = (w - months.length * (bw * 2 + 14)) / 2;
  let x = gap;
  const bars = months
    .map((m) => {
      const ih = (m.income / max) * (h - 40);
      const sh = (m.spent / max) * (h - 40);
      const g = `<g>
        <rect x="${x.toFixed(0)}" y="${(h - 28 - ih).toFixed(0)}" width="${bw}" height="${ih.toFixed(0)}" rx="3" fill="#1e4d3a"><title>${m.month} income ${money0(m.income)}</title></rect>
        <rect x="${(x + bw + 4).toFixed(0)}" y="${(h - 28 - sh).toFixed(0)}" width="${bw}" height="${sh.toFixed(0)}" rx="3" fill="#d98e2b"><title>${m.month} spent ${money0(m.spent)}</title></rect>
        <text x="${(x + bw).toFixed(0)}" y="${h - 8}" text-anchor="middle" class="chart-label">${m.month.split(' ')[0]}</text>
      </g>`;
      x += bw * 2 + 14;
      return g;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="month-chart" role="img" aria-label="Income and spending by month chart">${bars}<line x1="0" y1="${h - 28}" x2="${w}" y2="${h - 28}" stroke="#c9bda6" stroke-width="1" /></svg>
  <p class="chart-key"><span class="key-dot" style="background:#1e4d3a"></span> Income <span class="key-dot" style="background:#d98e2b"></span> Spending</p>`;
}

// A simple savings-rate line across months.
export function savingsLine(months) {
  const w = 560;
  const h = 180;
  const rates = months.map((m) => (m.income > 0 ? ((m.income - m.spent) / m.income) * 100 : 0));
  const max = Math.max(...rates, 10);
  const step = w / (months.length - 1);
  const pts = rates.map((r, i) => `${(i * step).toFixed(0)},${(h - 30 - (r / max) * (h - 50)).toFixed(0)}`).join(' ');
  const dots = rates
    .map(
      (r, i) =>
        `<circle cx="${(i * step).toFixed(0)}" cy="${(h - 30 - (r / max) * (h - 50)).toFixed(0)}" r="4.5" fill="#1e4d3a"><title>${months[i].month}: saved ${r.toFixed(1)}%</title></circle>`,
    )
    .join('');
  const labels = months
    .map((m, i) => {
      const anchor = i === 0 ? 'start' : i === months.length - 1 ? 'end' : 'middle';
      return `<text x="${(i * step).toFixed(0)}" y="${h - 8}" text-anchor="${anchor}" class="chart-label">${m.month.split(' ')[0]}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="month-chart" role="img" aria-label="Savings rate by month chart"><polyline points="${pts}" fill="none" stroke="#1e4d3a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />${dots}${labels}</svg>
  <p class="chart-key">Savings rate — share of income not spent, ${rates[rates.length - 1].toFixed(1)}% in November</p>`;
}
