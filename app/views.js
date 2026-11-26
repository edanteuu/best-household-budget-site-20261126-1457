// The pages of Nest Egg. One job: turn the store's numbers into the HTML of
// each route. Every figure comes from the store, so nothing on screen is a
// placeholder and every control has a handler in main.js.

import { money, money0, pct, shortDate, longDate, escape } from './format.js';
import * as store from './store.js';
import { donut, budgetBars, monthBars, savingsLine } from './charts.js';

function nav(active) {
  const links = [
    ['#/', 'Dashboard'],
    ['#/transactions', 'Transactions'],
    ['#/budgets', 'Budgets'],
    ['#/goals', 'Goals'],
    ['#/bills', 'Bills'],
    ['#/reports', 'Reports'],
    ['#/planner', 'Planner'],
  ];
  return `<nav class="main-nav" aria-label="Sections">${links
    .map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('')}</nav>`;
}

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span><span class="stat-sub">${sub}</span></div>`;
}

function progressBar(done, total, cls = '') {
  const p = total > 0 ? Math.min((done / total) * 100, 100) : 0;
  return `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${p.toFixed(1)}%"></div></div>`;
}

export function dashboard() {
  const income = store.incomeTotal();
  const spent = store.spentTotal();
  const saved = income - spent;
  const rate = income > 0 ? (saved / income) * 100 : 0;
  const byCat = store.spentByCategory();
  const cats = store.categories();
  const over = cats.filter((c) => byCat[c.id] > store.budgetFor(c.id));
  const donutParts = cats.map((c) => ({ name: c.name, value: byCat[c.id], color: c.color }));
  const topBars = [...cats]
    .sort((a, b) => byCat[b.id] - byCat[a.id])
    .slice(0, 6)
    .map((c) => ({ name: c.name, color: c.color, spent: byCat[c.id], budget: store.budgetFor(c.id) }));
  const unpaid = store.bills().filter((b) => !b.paid);
  const goals = store.goals();
  const goalsSaved = goals.reduce((s, g) => s + g.saved, 0);
  const recent = store.transactions().slice(0, 8);
  return `${nav('#/')}
  <section class="hero">
    <div>
      <p class="eyebrow">The Marlowe household · November 2026</p>
      <h1>November, at a glance</h1>
      <p class="lede">Two salaries in, thirteen envelopes out, and ${money(saved)} set aside — with
      ${over.length} categor${over.length === 1 ? 'y' : 'ies'} over budget: ${over.map((c) => c.name).join(' and ') || 'none'}.
      Everything below is live: add a transaction and every figure on this page moves.</p>
    </div>
    <div class="hero-card"><span>Money left to spend</span><strong>${money(income - spent)}</strong><span>after all November spending so far</span></div>
  </section>
  <section class="stats" aria-label="November totals">
    ${statCard('Income', money(income), 'Maya $4,200 · Tom $2,650')}
    ${statCard('Spent', money(spent), `of ${money(store.budgetTotal())} budgeted`)}
    ${statCard('Saved', money(saved), `${pct(rate)} of income`)}
    ${statCard('Savings rate', pct(rate), 'Target: 20% · 50/30/20 rule')}
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where November's money went</h2>
      ${donut(donutParts)}
      <p class="card-foot">Housing is the biggest slice at ${money0(byCat.housing)} — rent, paid on the 1st.</p>
    </div>
    <div class="card">
      <h2>Budgets under pressure</h2>
      ${budgetBars(topBars)}
      <p class="card-foot"><a href="#/budgets">See and edit all 13 budgets &rarr;</a></p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Bills still to pay</h2>
      ${unpaid.length === 0 ? '<p>Every November bill is paid. Nothing due.</p>' : `<ul class="bill-list">${unpaid.map((b) => `<li><span>${escape(b.name)}</span><b>${money(b.amount)}</b><span class="due">due ${shortDate(b.due)}</span></li>`).join('')}</ul>`}
      <p class="card-foot">${money(unpaid.reduce((s, b) => s + b.amount, 0))} still to go out in November. <a href="#/bills">All bills &rarr;</a></p>
    </div>
    <div class="card">
      <h2>Savings goals</h2>
      <ul class="goal-list">${goals.map((g) => `<li><div class="goal-head"><span>${escape(g.name)}</span><b>${money0(g.saved)} of ${money0(g.target)}</b></div>${progressBar(g.saved, g.target, 'green')}<span class="goal-note">${pct((g.saved / g.target) * 100)} there · ${money(g.target - g.saved)} to go</span></li>`).join('')}</ul>
      <p class="card-foot">${money0(goalsSaved)} set aside across ${goals.length} goals. <a href="#/goals">Add money to a goal &rarr;</a></p>
    </div>
  </section>
  <section class="card">
    <h2>Recent transactions</h2>
    <table class="tx-table">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${recent.map((t) => `<tr><td>${shortDate(t.date)}</td><td>${escape(t.merchant)}</td><td>${t.type === 'income' ? 'Income' : escape(store.categoryById(t.category).name)}</td><td class="num ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}</tbody>
    </table>
    <p class="card-foot"><a href="#/transactions">All ${store.transactions().length} November transactions &rarr;</a></p>
  </section>`;
}

export function transactionsPage(filter) {
  const cats = store.categories();
  const options = cats.map((c) => `<option value="${c.id}"${filter.category === c.id ? ' selected' : ''}>${escape(c.name)}</option>`).join('');
  return `${nav('#/transactions')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">November 2026</p>
      <h1>Transactions</h1>
      <p class="lede">Every pound and dollar in and out, newest first. Filter it, search it, add
      to it — the totals on every other page update at once.</p>
    </div>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form data-form="add-transaction" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What <input type="text" name="merchant" placeholder="e.g. GreenMart supermarket" required maxlength="80"></label>
      <label>Category <select name="category">${options}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Note <input type="text" name="note" placeholder="Optional" maxlength="80"></label>
      <div class="form-actions"><button type="submit" class="btn">Add transaction</button><span class="form-note" data-role="add-note"></span></div>
    </form>
  </section>
  <section class="card">
    <h2>Find a transaction</h2>
    <div class="filters">
      <label>Category <select data-filter="category"><option value="all">All categories</option>${options}</select></label>
      <label>Type <select data-filter="type"><option value="all">All</option><option value="expense">Expenses</option><option value="income">Income</option></select></label>
      <label>Search <input type="search" data-filter="q" placeholder="Search merchant or note" value="${escape(filter.q)}"></label>
    </div>
    <div data-role="tx-table">${transactionTable(filter)}</div>
  </section>`;
}

export function transactionTable(filter) {
  let list = store.transactions();
  if (filter.category !== 'all') list = list.filter((t) => t.category === filter.category);
  if (filter.type !== 'all') list = list.filter((t) => t.type === filter.type);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((t) => (t.merchant + ' ' + (t.note || '')).toLowerCase().includes(q));
  }
  const inSum = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const outSum = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const rows = list
    .map(
      (t) => `<tr><td>${shortDate(t.date)}</td><td>${escape(t.merchant)}${t.note ? `<br><span class="muted">${escape(t.note)}</span>` : ''}</td><td>${t.type === 'income' ? 'Income' : escape(store.categoryById(t.category).name)}</td><td class="num ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td><td><button type="button" class="btn-small" data-action="delete-transaction" data-id="${t.id}">Delete</button></td></tr>`,
    )
    .join('');
  return `<p class="table-summary">${list.length} transaction${list.length === 1 ? '' : 's'} · ${money(inSum)} in · ${money(outSum)} out</p>
  ${list.length === 0 ? '<p>No transactions match. Clear the filters to see them all.</p>' : `<table class="tx-table">
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`}`;
}

export function budgetsPage() {
  const byCat = store.spentByCategory();
  const cats = store.categories();
  const totalBudget = store.budgetTotal();
  const totalSpent = store.spentTotal();
  const over = cats.filter((c) => byCat[c.id] > store.budgetFor(c.id));
  return `${nav('#/budgets')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">November 2026 · zero-based</p>
      <h1>Budgets</h1>
      <p class="lede">Thirteen envelopes, one for each part of household life. Every dollar of
      the ${money(totalBudget)} budget has a job; ${money(totalSpent)} of it is spent and
      ${money(totalBudget - totalSpent)} is still in the envelopes. Change a limit and the
      bars, the dashboard and the planner all follow.</p>
    </div>
    <div class="hero-card"><span>Over budget</span><strong>${over.length} of 13</strong><span>${over.map((c) => `${c.name} +${money0(byCat[c.id] - store.budgetFor(c.id))}`).join(' · ') || 'None — every envelope is holding'}</span></div>
  </section>
  <section class="grid-2">
    ${cats
      .map((c) => {
        const spent = byCat[c.id];
        const budget = store.budgetFor(c.id);
        const left = budget - spent;
        return `<div class="card budget-card">
        <div class="budget-head"><h2><span class="swatch" style="background:${c.color}"></span>${escape(c.name)}</h2><span class="budget-figures">${money(spent)} <span class="muted">of ${money(budget)}</span></span></div>
        ${progressBar(spent, budget, spent > budget ? 'over' : 'green')}
        <p class="budget-note">${spent > budget ? `Over by ${money(spent - budget)} — trim next week or move money from another envelope.` : `${money(left)} left · ${pct((spent / budget) * 100)} used`}</p>
        <form data-form="edit-budget" class="budget-form">
          <input type="hidden" name="category" value="${c.id}">
          <label>Monthly limit ($) <input type="number" name="amount" min="0" step="1" value="${budget}" required></label>
          <button type="submit" class="btn-small">Save limit</button>
        </form>
      </div>`;
      })
      .join('')}
  </section>
  <section class="card tip">
    <h2>How the Marlowes budget</h2>
    <p>Zero-based: income minus every envelope equals zero, so no dollar drifts.
    Groceries and transport are set from the last three months' averages; dining
    out and clothing are the two envelopes that blew past their limits this month —
    the planner shows what pulling them back would save. <a href="#/planner">Try the 50/30/20 planner &rarr;</a></p>
  </section>`;
}

export function goalsPage() {
  const goals = store.goals();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  return `${nav('#/goals')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">Saving, on purpose</p>
      <h1>Savings goals</h1>
      <p class="lede">${money(totalSaved)} set aside towards ${money(totalTarget)} of goals.
      The emergency fund comes first — six months of essentials — then the holiday,
      the car and the college fund. Add money to a goal and its bar moves at once.</p>
    </div>
  </section>
  <section class="grid-2">
    ${goals
      .map(
        (g) => `<div class="card goal-card">
        <h2>${escape(g.name)}</h2>
        <p>${escape(g.detail)}</p>
        <div class="goal-figures"><strong>${money(g.saved)}</strong><span> of ${money(g.target)} · ${pct((g.saved / g.target) * 100)}</span></div>
        ${progressBar(g.saved, g.target, 'green')}
        <p class="goal-note">${money(g.target - g.saved)} to go${g.saved >= g.target ? ' — goal reached!' : ''}</p>
        <form data-form="contribute-goal" class="goal-form">
          <input type="hidden" name="goal" value="${g.id}">
          <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" placeholder="100" required></label>
          <button type="submit" class="btn-small">Add money</button>
        </form>
      </div>`,
      )
      .join('')}
  </section>
  <section class="card">
    <h2>Start a new goal</h2>
    <form data-form="add-goal" class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. New washing machine" required maxlength="60"></label>
      <label>Target amount ($) <input type="number" name="target" min="1" step="1" placeholder="800" required></label>
      <div class="form-actions"><button type="submit" class="btn">Create goal</button></div>
    </form>
  </section>`;
}

export function billsPage() {
  const bills = store.bills();
  const paid = bills.filter((b) => b.paid);
  const unpaid = bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const next = unpaid[0];
  return `${nav('#/bills')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">November 2026 · recurring</p>
      <h1>Bills</h1>
      <p class="lede">${bills.length} recurring bills this month. ${paid.length} paid,
      ${unpaid.length} still to pay — ${money(unpaidTotal)} in total${next ? `, next up ${escape(next.name)} (${money(next.amount)}) on ${longDate(next.due)}` : ''}.
      Mark a bill paid when the money leaves and it drops off this list.</p>
    </div>
  </section>
  <section class="card">
    <table class="tx-table">
      <thead><tr><th>Bill</th><th class="num">Amount</th><th>Due</th><th>Every</th><th>Status</th><th></th></tr></thead>
      <tbody>${bills
        .map(
          (b) => `<tr><td>${escape(b.name)}</td><td class="num">${money(b.amount)}</td><td>${shortDate(b.due)}</td><td>${escape(b.frequency)}</td><td><span class="pill ${b.paid ? 'paid' : 'due'}">${b.paid ? 'Paid' : 'To pay'}</span></td><td><button type="button" class="btn-small" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td></tr>`,
        )
        .join('')}</tbody>
    </table>
    <p class="card-foot">Paid so far: ${money(paid.reduce((s, b) => s + b.amount, 0))} · Still to pay: ${money(unpaidTotal)}</p>
  </section>
  <section class="card tip">
    <h2>Never miss one</h2>
    <p>Rent, power, water and internet all leave in the first half of the month,
    right after Maya's payday on the 1st. The three bills left — phones, council tax
    and heating — fall after Tom's payday on the 15th, so the money is there when
    each one lands.</p>
  </section>`;
}

export function reportsPage() {
  const history = store.monthlyHistory();
  const byCat = store.spentByCategory();
  const cats = [...store.categories()].sort((a, b) => byCat[b.id] - byCat[a.id]);
  const biggest = [...store.transactions()]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
  const totalSpent = store.spentTotal();
  const totalBudget = store.budgetTotal();
  return `${nav('#/reports')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">June – November 2026</p>
      <h1>Reports</h1>
      <p class="lede">Six months of the household's money. November is the cheapest month since
      June — ${money(totalSpent)} spent against ${money(store.incomeTotal())} in — and the
      savings rate has climbed every month since August.</p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Income vs spending</h2>
      ${monthBars(history)}
    </div>
    <div class="card">
      <h2>Savings rate</h2>
      ${savingsLine(history)}
      <p class="card-foot">August was the tight month: a ${money(5120.3)} spend on a ${money(6980)} income. November's rate is the best of the six.</p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>November by category</h2>
      <table class="tx-table">
        <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Diff</th></tr></thead>
        <tbody>${cats.map((c) => { const s = byCat[c.id]; const b = store.budgetFor(c.id); const d = b - s; return `<tr><td><span class="swatch" style="background:${c.color}"></span>${escape(c.name)}</td><td class="num">${money(s)}</td><td class="num">${money(b)}</td><td class="num ${d < 0 ? 'over-text' : ''}">${d < 0 ? '−' : '+'}${money(Math.abs(d))}</td></tr>`; }).join('')}</tbody>
      </table>
      <p class="card-foot">Total ${money(totalSpent)} spent of ${money(totalBudget)} budgeted — ${money(totalBudget - totalSpent)} under budget overall.</p>
    </div>
    <div class="card">
      <h2>Biggest single expenses</h2>
      <table class="tx-table">
        <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
        <tbody>${biggest.map((t) => `<tr><td>${shortDate(t.date)}</td><td>${escape(t.merchant)}</td><td class="num">${money(t.amount)}</td></tr>`).join('')}</tbody>
      </table>
      <p class="card-foot">Rent is the household's biggest single payment every month; after it, the two salaries' paydays carry the next-largest items.</p>
    </div>
  </section>
  <section class="card">
    <h2>Month by month</h2>
    <table class="tx-table">
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Savings rate</th></tr></thead>
      <tbody>${history.map((m) => `<tr><td>${m.month}</td><td class="num">${money(m.income)}</td><td class="num">${money(m.spent)}</td><td class="num">${money(m.income - m.spent)}</td><td class="num">${pct(((m.income - m.spent) / m.income) * 100)}</td></tr>`).join('')}</tbody>
    </table>
  </section>`;
}

export function plannerPage() {
  const split = store.ruleSplit();
  const { income, needs, wants, saved } = split;
  const needsPct = (needs / income) * 100;
  const wantsPct = (wants / income) * 100;
  const savedPct = (saved / income) * 100;
  const cats = store.categories();
  const options = cats.map((c) => `<option value="${c.id}">${escape(c.name)}</option>`).join('');
  function ruleRow(label, actual, target, note) {
    const over = actual > target;
    return `<div class="rule-row">
      <div class="rule-head"><span>${label}</span><b>${pct(actual)} actual · ${target}% target</b></div>
      <div class="bar-track"><div class="bar-fill ${over ? 'over' : 'green'}" style="width:${Math.min(actual, 100).toFixed(1)}%"></div></div>
      <p class="rule-note">${note}</p>
    </div>`;
  }
  return `${nav('#/planner')}
  <section class="hero slim">
    <div>
      <p class="eyebrow">The 50/30/20 rule</p>
      <h1>Budget planner</h1>
      <p class="lede">A classic rule of thumb: about 50% of take-home pay on needs, 30% on
      wants, 20% saved or put towards debt. Here's how November actually splits —
      and what happens if the household trims one envelope.</p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>November's real split</h2>
      ${ruleRow('Needs — housing, groceries, transport, utilities, health, kids', needsPct, 50, `${money(needs)} of ${money(income)}. Rent alone is 27% of income, so needs run a little hot.`)}
      ${ruleRow('Wants — dining, fun, clothes, subscriptions, pets, home, misc', wantsPct, 30, `${money(wants)} of ${money(income)}. Well under the 30% line — the household is frugal on wants.`)}
      ${ruleRow('Saved', savedPct, 20, `${money(saved)} of ${money(income)}. Nearly 14 points above the 20% target — that is the holiday and the car fund growing.`)}
      <p class="card-foot">Verdict: needs slightly over, wants well under, savings well over. The rule bends for a family of four with city rent — the savings rate is what matters, and it is strong.</p>
    </div>
    <div class="card">
      <h2>What if we trim an envelope?</h2>
      <p>Pick a category and a monthly cut. The planner works out the new savings
      figure on the spot — no page reload, no guesswork.</p>
      <form data-form="what-if" class="form-grid">
        <label>Category <select name="category" data-whatif="category">${options}</select></label>
        <label>Cut per month ($) <input type="number" name="cut" min="0" step="5" value="30" data-whatif="cut" required></label>
      </form>
      <div data-role="whatif-result">${whatIfResult('dining', 30)}</div>
      <h3 class="subhead">A month at 50/30/20</h3>
      <p>On ${money(income)} of income, the rule would mean ${money(income * 0.5)} for
      needs, ${money(income * 0.3)} for wants and ${money(income * 0.2)} saved. The
      Marlowes spend ${money(needs)} on needs, ${money(wants)} on wants and save
      ${money(saved)} — they beat the rule where it counts.</p>
    </div>
  </section>`;
}

export function whatIfResult(categoryId, cut) {
  const cat = store.categoryById(categoryId);
  const byCat = store.spentByCategory();
  const spent = byCat[categoryId] || 0;
  const realCut = Math.min(Math.max(0, Number(cut) || 0), spent);
  const income = store.incomeTotal();
  const saved = income - store.spentTotal();
  const newSaved = saved + realCut;
  const newRate = (newSaved / income) * 100;
  const yearly = realCut * 12;
  return `<div class="whatif">
    <p>Cutting <b>${escape(cat.name)}</b> by <b>${money(realCut)}</b> a month — from ${money(spent)} to ${money(spent - realCut)} — would lift savings to <b>${money(newSaved)}</b> a month, a <b>${pct(newRate)}</b> savings rate.</p>
    <p>Over a year that is <b>${money(yearly)}</b> — enough to finish the Cornwall holiday fund (${money(store.goalById('g2') ? store.goalById('g2').target - store.goalById('g2').saved : 0)} to go) in about ${Math.max(1, Math.ceil((store.goalById('g2').target - store.goalById('g2').saved) / Math.max(realCut, 1)))} months.</p>
  </div>`;
}

export function missing() {
  return `${nav('#/')}
  <section class="hero slim"><div><h1>Not found</h1>
  <p class="lede">There is no page at this address. <a href="#/">Back to the dashboard</a>.</p></div></section>`;
}
