// Nest Egg: the router and the wiring. One job: put the right page on screen
// for the hash route, and make every form and button on the page do its job.
//
//   #/                dashboard
//   #/transactions    transactions, filters and the add form
//   #/budgets         budget envelopes and their limits
//   #/goals           savings goals and contributions
//   #/bills           recurring bills, mark paid
//   #/reports         six months of reports
//   #/planner         the 50/30/20 planner and the what-if tool
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import * as views from './views.js';
import * as store from './store.js';

const app = document.getElementById('app');
const txFilter = { category: 'all', type: 'all', q: '' };

function route() {
  const hash = location.hash || '#/';
  if (hash === '#/' || hash === '') return 'dashboard';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/bills')) return 'bills';
  if (hash.startsWith('#/reports')) return 'reports';
  if (hash.startsWith('#/planner')) return 'planner';
  return 'missing';
}

function render() {
  window.__shotReady = false;
  const page = route();
  const titles = {
    dashboard: 'Nest Egg — Household Budget Book',
    transactions: 'Transactions | Nest Egg',
    budgets: 'Budgets | Nest Egg',
    goals: 'Savings goals | Nest Egg',
    bills: 'Bills | Nest Egg',
    reports: 'Reports | Nest Egg',
    planner: 'Budget planner | Nest Egg',
  };
  document.title = titles[page] || titles.dashboard;
  if (page === 'dashboard') app.innerHTML = views.dashboard();
  else if (page === 'transactions') app.innerHTML = views.transactionsPage(txFilter);
  else if (page === 'budgets') app.innerHTML = views.budgetsPage();
  else if (page === 'goals') app.innerHTML = views.goalsPage();
  else if (page === 'bills') app.innerHTML = views.billsPage();
  else if (page === 'reports') app.innerHTML = views.reportsPage();
  else if (page === 'planner') app.innerHTML = views.plannerPage();
  else app.innerHTML = views.missing();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function refreshTxTable() {
  const box = document.querySelector('[data-role="tx-table"]');
  if (box) box.innerHTML = views.transactionTable(txFilter);
}

function note(text) {
  const el = document.querySelector('[data-role="add-note"]');
  if (el) el.textContent = text;
}

app.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const kind = form.dataset.form;
  const data = new FormData(form);
  if (kind === 'add-transaction') {
    const amount = Number(data.get('amount'));
    if (!data.get('merchant') || !(amount > 0)) {
      note('Add a description and an amount above $0.');
      return;
    }
    store.addTransaction({
      date: String(data.get('date') || '2026-11-26'),
      merchant: String(data.get('merchant')),
      category: String(data.get('category')),
      amount,
      type: String(data.get('type') || 'expense'),
      note: String(data.get('note') || ''),
    });
    form.reset();
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) dateInput.value = '2026-11-26';
    note('Added — the totals on every page moved.');
    refreshTxTable();
  } else if (kind === 'edit-budget') {
    store.setBudget(String(data.get('category')), Number(data.get('amount')));
    render();
  } else if (kind === 'contribute-goal') {
    store.contributeToGoal(String(data.get('goal')), Number(data.get('amount')));
    render();
  } else if (kind === 'add-goal') {
    store.addGoal(String(data.get('name')), Number(data.get('target')));
    render();
  }
});

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'delete-transaction') {
    store.deleteTransaction(button.dataset.id);
    refreshTxTable();
  } else if (action === 'toggle-bill') {
    store.toggleBillPaid(button.dataset.id);
    render();
  } else if (action === 'reset-example') {
    store.resetToExample();
    render();
  }
});

// Transaction filters: update the table in place so the search box keeps focus.
app.addEventListener('input', (event) => {
  const el = event.target;
  if (el.matches('[data-filter="q"]')) {
    txFilter.q = el.value;
    refreshTxTable();
  } else if (el.matches('[data-whatif]')) {
    const form = el.closest('form');
    if (!form) return;
    const box = document.querySelector('[data-role="whatif-result"]');
    if (!box) return;
    const fd = new FormData(form);
    box.innerHTML = views.whatIfResult(String(fd.get('category')), Number(fd.get('cut')));
  }
});

app.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('[data-filter="category"]')) {
    txFilter.category = el.value;
    refreshTxTable();
  } else if (el.matches('[data-filter="type"]')) {
    txFilter.type = el.value;
    refreshTxTable();
  } else if (el.matches('[data-whatif="category"]')) {
    const form = el.closest('form');
    const box = document.querySelector('[data-role="whatif-result"]');
    if (form && box) {
      const fd = new FormData(form);
      box.innerHTML = views.whatIfResult(String(fd.get('category')), Number(fd.get('cut')));
    }
  }
});

document.getElementById('reset-example').addEventListener('click', () => {
  store.resetToExample();
  render();
});

window.addEventListener('hashchange', render);
render();
