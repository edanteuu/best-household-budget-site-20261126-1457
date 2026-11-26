// The household's live state. One job: hold the transactions, budgets, goals
// and bills, persist them in this browser, and answer every total the pages
// ask for. All totals are computed from the transactions, so the dashboard,
// budgets, reports and planner can never disagree with each other.

import { CATEGORIES, TRANSACTIONS, GOALS, BILLS, MONTHLY_HISTORY, RULE_503020 } from './data.js';

const KEY = 'nestegg-v1';

function seed() {
  return {
    transactions: structuredClone(TRANSACTIONS),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    goals: structuredClone(GOALS),
    bills: structuredClone(BILLS),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !parsed.budgets) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

let state = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full store: the site still works for this visit.
  }
}

export function resetToExample() {
  state = seed();
  save();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id, color: '#777777' };
}

export function categories() {
  return CATEGORIES;
}

export function transactions() {
  return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
}

export function incomeTotal() {
  return state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}

export function spentTotal() {
  return state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
}

export function spentByCategory() {
  const out = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of state.transactions) {
    if (t.type === 'expense' && out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}

export function budgetFor(id) {
  return state.budgets[id] ?? 0;
}

export function budgetTotal() {
  return CATEGORIES.reduce((s, c) => s + budgetFor(c.id), 0);
}

export function setBudget(id, amount) {
  const v = Math.max(0, Math.round(Number(amount) || 0));
  state.budgets[id] = v;
  save();
  return v;
}

export function addTransaction({ date, merchant, category, amount, type, note }) {
  const id = 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  const tx = {
    id,
    date: date || '2026-11-26',
    merchant: merchant.trim(),
    category,
    amount: Math.round(Number(amount) * 100) / 100,
    type: type || 'expense',
    note: (note || '').trim(),
  };
  state.transactions.push(tx);
  save();
  return tx;
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  save();
}

export function goals() {
  return state.goals;
}

export function goalById(id) {
  return state.goals.find((g) => g.id === id);
}

export function contributeToGoal(id, amount) {
  const g = goalById(id);
  if (!g) return null;
  g.saved = Math.round((g.saved + Math.max(0, Number(amount) || 0)) * 100) / 100;
  save();
  return g;
}

export function addGoal(name, target) {
  const id = 'g' + Date.now().toString(36);
  const g = { id, name: name.trim(), detail: 'Added by the household.', target: Math.max(1, Math.round(Number(target) || 0)), saved: 0 };
  state.goals.push(g);
  save();
  return g;
}

export function bills() {
  return [...state.bills].sort((a, b) => (a.due < b.due ? -1 : 1));
}

export function toggleBillPaid(id) {
  const b = state.bills.find((x) => x.id === id);
  if (!b) return null;
  b.paid = !b.paid;
  save();
  return b;
}

export function monthlyHistory() {
  const spent = spentTotal();
  return MONTHLY_HISTORY.map((m) => ({ ...m, spent: m.spent === null ? spent : m.spent }));
}

// 50/30/20 split of this month's actual spending.
export function ruleSplit() {
  const byCat = spentByCategory();
  const sum = (ids) => ids.reduce((s, id) => s + (byCat[id] || 0), 0);
  const income = incomeTotal();
  const needs = sum(RULE_503020.needs);
  const wants = sum(RULE_503020.wants);
  const saved = income - needs - wants;
  return { income, needs, wants, saved };
}
