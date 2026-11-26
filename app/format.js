// Money and date formatting for Nest Egg. One job: turn numbers and ISO dates
// into the strings the pages show. All figures are US dollars.

export function money(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  const v = Number(n) || 0;
  return '$' + Math.round(v).toLocaleString('en-US');
}

export function pct(n) {
  return (Math.round(n * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 }) + '%';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

export function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
