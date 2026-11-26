// The seed data for Nest Egg: the Marlowe household's November 2026 budget.
// One job: the example household, its categories, its transactions, its goals
// and its bills. Every figure below is real example data; the store computes
// all totals from these transactions, so the pages always agree with each other.
//
// The household: Maya and Tom Marlowe, two children (8 and 5), and Biscuit the
// dog, renting a three-bedroom flat. Paydays: Maya on the 1st, Tom on the 15th.

export const HOUSEHOLD = {
  name: 'The Marlowe household',
  members: 'Maya & Tom Marlowe, Lily (8), Noah (5), and Biscuit the dog',
  month: 'November 2026',
  monthLabel: 'November 2026',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1e4d3a', budget: 1850 },
  { id: 'groceries', name: 'Groceries', color: '#2e7d5b', budget: 720 },
  { id: 'transport', name: 'Transport', color: '#3a6ea5', budget: 450 },
  { id: 'utilities', name: 'Utilities', color: '#6b8e23', budget: 265 },
  { id: 'dining', name: 'Dining out', color: '#d98e2b', budget: 220 },
  { id: 'health', name: 'Health', color: '#b3556e', budget: 180 },
  { id: 'kids', name: 'Kids & school', color: '#7a5ea3', budget: 240 },
  { id: 'entertainment', name: 'Entertainment', color: '#c25e3a', budget: 150 },
  { id: 'clothing', name: 'Clothing', color: '#4a7a8c', budget: 120 },
  { id: 'subscriptions', name: 'Subscriptions', color: '#8a6d3b', budget: 86 },
  { id: 'pets', name: 'Pets', color: '#5b8c5a', budget: 95 },
  { id: 'home', name: 'Home & garden', color: '#96684a', budget: 140 },
  { id: 'misc', name: 'Miscellaneous', color: '#777777', budget: 110 },
];

// Every November transaction. Income is type 'income'; everything else is an
// expense in one of the categories above. Amounts are dollars.
export const TRANSACTIONS = [
  { id: 't001', date: '2026-11-01', merchant: 'Maya Marlowe — salary', category: 'income', amount: 4200, type: 'income', note: 'Monthly pay, Northwind Design' },
  { id: 't002', date: '2026-11-01', merchant: 'Maple Court Apartments — rent', category: 'housing', amount: 1850, type: 'expense' },
  { id: 't003', date: '2026-11-01', merchant: 'StreamFlix', category: 'subscriptions', amount: 15.49, type: 'expense', note: 'Monthly plan' },
  { id: 't004', date: '2026-11-01', merchant: 'TuneWave Music', category: 'subscriptions', amount: 10.99, type: 'expense', note: 'Monthly plan' },
  { id: 't005', date: '2026-11-02', merchant: 'GreenMart supermarket', category: 'groceries', amount: 142.6, type: 'expense', note: 'Weekly shop' },
  { id: 't006', date: '2026-11-02', merchant: "Luigi's Pizzeria", category: 'dining', amount: 34.5, type: 'expense', note: 'Friday pizza night' },
  { id: 't007', date: '2026-11-03', merchant: 'School lunch money — Lily & Noah', category: 'kids', amount: 40, type: 'expense' },
  { id: 't008', date: '2026-11-03', merchant: 'Shell — fuel', category: 'transport', amount: 52, type: 'expense' },
  { id: 't009', date: '2026-11-04', merchant: 'City Power — electricity', category: 'utilities', amount: 118.4, type: 'expense', note: 'October usage' },
  { id: 't010', date: '2026-11-04', merchant: 'PetCo — dog food', category: 'pets', amount: 48.2, type: 'expense', note: 'Biscuit, 12 kg bag' },
  { id: 't011', date: '2026-11-05', merchant: 'GreenMart supermarket', category: 'groceries', amount: 86.4, type: 'expense', note: 'Top-up shop' },
  { id: 't012', date: '2026-11-05', merchant: 'Boots Pharmacy', category: 'health', amount: 28.9, type: 'expense' },
  { id: 't013', date: '2026-11-05', merchant: 'CloudDrive storage', category: 'subscriptions', amount: 2.99, type: 'expense' },
  { id: 't014', date: '2026-11-06', merchant: 'City bus passes', category: 'transport', amount: 48, type: 'expense', note: 'Two monthly passes' },
  { id: 't015', date: '2026-11-06', merchant: 'Riverside Cinema', category: 'entertainment', amount: 42, type: 'expense', note: 'Family film, 4 tickets' },
  { id: 't016', date: '2026-11-07', merchant: 'City Water', category: 'utilities', amount: 46.85, type: 'expense' },
  { id: 't017', date: '2026-11-07', merchant: 'Morning Bean café', category: 'dining', amount: 12.8, type: 'expense' },
  { id: 't018', date: '2026-11-07', merchant: 'Hardware store — bulbs & batteries', category: 'home', amount: 23.4, type: 'expense' },
  { id: 't019', date: '2026-11-08', merchant: 'Farmers market', category: 'groceries', amount: 38.25, type: 'expense' },
  { id: 't020', date: '2026-11-08', merchant: 'Art supplies — Lily', category: 'kids', amount: 32.75, type: 'expense' },
  { id: 't021', date: '2026-11-08', merchant: 'Birthday card & gift wrap', category: 'misc', amount: 18.5, type: 'expense' },
  { id: 't022', date: '2026-11-09', merchant: 'Kaiyo Sushi', category: 'dining', amount: 58.4, type: 'expense', note: 'Maya & Tom, date night' },
  { id: 't023', date: '2026-11-09', merchant: "Kids' winter coats", category: 'clothing', amount: 89, type: 'expense', note: 'Two coats, sale' },
  { id: 't024', date: '2026-11-10', merchant: 'Dr. Alvarez — dentist', category: 'health', amount: 85, type: 'expense', note: 'Noah check-up' },
  { id: 't025', date: '2026-11-10', merchant: 'Shell — fuel', category: 'transport', amount: 47.5, type: 'expense' },
  { id: 't026', date: '2026-11-10', merchant: 'The Morning Paper — subscription', category: 'subscriptions', amount: 12, type: 'expense' },
  { id: 't027', date: '2026-11-11', merchant: 'GreenMart supermarket', category: 'groceries', amount: 121.8, type: 'expense', note: 'Weekly shop' },
  { id: 't028', date: '2026-11-11', merchant: 'Vet — Biscuit check-up', category: 'pets', amount: 32, type: 'expense' },
  { id: 't029', date: '2026-11-12', merchant: 'FiberNet — internet', category: 'utilities', amount: 79, type: 'expense' },
  { id: 't030', date: '2026-11-12', merchant: 'Swimming lessons', category: 'kids', amount: 65, type: 'expense', note: 'Lily & Noah, November term' },
  { id: 't031', date: '2026-11-13', merchant: 'Postage & stationery', category: 'misc', amount: 12.25, type: 'expense' },
  { id: 't032', date: '2026-11-13', merchant: 'City parking', category: 'transport', amount: 18, type: 'expense' },
  { id: 't033', date: '2026-11-13', merchant: 'Toy shop — board game', category: 'entertainment', amount: 28, type: 'expense' },
  { id: 't034', date: '2026-11-14', merchant: 'Corner Deli', category: 'groceries', amount: 24.5, type: 'expense' },
  { id: 't035', date: '2026-11-14', merchant: 'The Daily Grind — lunch', category: 'dining', amount: 22.1, type: 'expense' },
  { id: 't036', date: '2026-11-14', merchant: 'Garden centre — winter plants', category: 'home', amount: 46.8, type: 'expense' },
  { id: 't037', date: '2026-11-15', merchant: 'Tom Marlowe — salary', category: 'income', amount: 2650, type: 'income', note: 'Monthly pay, Harbor Logistics' },
  { id: 't038', date: '2026-11-15', merchant: "Tom's work shirts", category: 'clothing', amount: 42.9, type: 'expense' },
  { id: 't039', date: '2026-11-15', merchant: 'FitLife Gym', category: 'subscriptions', amount: 34, type: 'expense' },
  { id: 't040', date: '2026-11-16', merchant: 'GreenMart supermarket', category: 'groceries', amount: 98.35, type: 'expense', note: 'Weekly shop' },
  { id: 't041', date: '2026-11-16', merchant: 'Thai Orchid — takeaway', category: 'dining', amount: 41.25, type: 'expense' },
  { id: 't042', date: '2026-11-17', merchant: 'Shell — fuel', category: 'transport', amount: 54.2, type: 'expense' },
  { id: 't043', date: '2026-11-17', merchant: 'School trip — museum', category: 'kids', amount: 28, type: 'expense', note: 'Lily, Year 3 trip' },
  { id: 't044', date: '2026-11-18', merchant: 'Food bank donation', category: 'misc', amount: 25, type: 'expense' },
  { id: 't045', date: '2026-11-18', merchant: 'Boots Pharmacy', category: 'health', amount: 22.1, type: 'expense' },
  { id: 't046', date: '2026-11-19', merchant: 'Farmers market', category: 'groceries', amount: 31.2, type: 'expense' },
  { id: 't047', date: '2026-11-19', merchant: 'Plumber — tap washer', category: 'home', amount: 38, type: 'expense' },
  { id: 't048', date: '2026-11-20', merchant: 'SafeDrive — car insurance', category: 'transport', amount: 132, type: 'expense', note: 'Monthly premium' },
  { id: 't049', date: '2026-11-20', merchant: 'Car wash', category: 'transport', amount: 12, type: 'expense' },
  { id: 't050', date: '2026-11-20', merchant: 'Bowling — family night', category: 'entertainment', amount: 38, type: 'expense' },
  { id: 't051', date: '2026-11-21', merchant: 'GreenMart supermarket', category: 'groceries', amount: 87.9, type: 'expense', note: 'Weekly shop' },
  { id: 't052', date: '2026-11-21', merchant: 'Morning Bean café', category: 'dining', amount: 9.75, type: 'expense' },
  { id: 't053', date: '2026-11-21', merchant: 'PetCo — dog treats', category: 'pets', amount: 12.1, type: 'expense' },
  { id: 't054', date: '2026-11-22', merchant: 'New backpack — Noah', category: 'kids', amount: 42.75, type: 'expense' },
  { id: 't055', date: '2026-11-22', merchant: 'Socks & underwear', category: 'clothing', amount: 17, type: 'expense' },
  { id: 't056', date: '2026-11-22', merchant: 'Haircut — Maya', category: 'misc', amount: 32, type: 'expense' },
  { id: 't057', date: '2026-11-23', merchant: 'Shell — fuel', category: 'transport', amount: 45.7, type: 'expense' },
  { id: 't058', date: '2026-11-23', merchant: 'Stack & Co — burgers', category: 'dining', amount: 38.6, type: 'expense' },
  { id: 't059', date: '2026-11-24', merchant: 'Corner Deli', category: 'groceries', amount: 19.85, type: 'expense' },
  { id: 't060', date: '2026-11-24', merchant: 'Vitamins', category: 'health', amount: 28, type: 'expense' },
  { id: 't061', date: '2026-11-24', merchant: 'Cleaning supplies', category: 'home', amount: 19.4, type: 'expense' },
  { id: 't062', date: '2026-11-25', merchant: 'Haircut — Tom', category: 'misc', amount: 17, type: 'expense' },
  { id: 't063', date: '2026-11-25', merchant: 'Toll road', category: 'transport', amount: 10, type: 'expense' },
  { id: 't064', date: '2026-11-25', merchant: 'Bakery brunch', category: 'dining', amount: 29.4, type: 'expense' },
  { id: 't065', date: '2026-11-26', merchant: 'GreenMart supermarket', category: 'groceries', amount: 43.5, type: 'expense', note: 'Top-up shop' },
  { id: 't066', date: '2026-11-26', merchant: 'Storybooks — Noah', category: 'kids', amount: 20, type: 'expense' },
  { id: 't067', date: '2026-11-26', merchant: 'School fair tickets', category: 'entertainment', amount: 24, type: 'expense' },
];

// Savings goals. `saved` is the amount already set aside.
export const GOALS = [
  { id: 'g1', name: 'Emergency fund', detail: 'Six months of essential spending, kept in a separate savings account.', target: 12000, saved: 8450 },
  { id: 'g2', name: 'Family holiday — Cornwall', detail: 'A week by the sea next July: cottage, train fares and spending money.', target: 3500, saved: 2100 },
  { id: 'g3', name: 'New car', detail: 'Replace the 2014 hatchback before its next big repair bill.', target: 9000, saved: 3750 },
  { id: 'g4', name: "Kids' college fund", detail: 'A little each month, started when Lily was born.', target: 25000, saved: 6200 },
];

// Recurring bills for November. `paid` is whether the November payment is made.
export const BILLS = [
  { id: 'b01', name: 'Rent — Maple Court Apartments', amount: 1850, due: '2026-11-01', paid: true, frequency: 'Monthly' },
  { id: 'b02', name: 'StreamFlix', amount: 15.49, due: '2026-11-01', paid: true, frequency: 'Monthly' },
  { id: 'b03', name: 'TuneWave Music', amount: 10.99, due: '2026-11-01', paid: true, frequency: 'Monthly' },
  { id: 'b04', name: 'City Power — electricity', amount: 118.4, due: '2026-11-04', paid: true, frequency: 'Monthly' },
  { id: 'b05', name: 'City Water', amount: 46.85, due: '2026-11-07', paid: true, frequency: 'Monthly' },
  { id: 'b06', name: 'FiberNet — internet', amount: 79, due: '2026-11-12', paid: true, frequency: 'Monthly' },
  { id: 'b07', name: 'FitLife Gym', amount: 34, due: '2026-11-15', paid: true, frequency: 'Monthly' },
  { id: 'b08', name: 'SafeDrive — car insurance', amount: 132, due: '2026-11-20', paid: true, frequency: 'Monthly' },
  { id: 'b09', name: 'MobilePlus — phones', amount: 64, due: '2026-11-27', paid: false, frequency: 'Monthly' },
  { id: 'b10', name: 'Council tax', amount: 186, due: '2026-11-28', paid: false, frequency: 'Monthly' },
  { id: 'b11', name: 'NorthGas — heating', amount: 58.2, due: '2026-11-30', paid: false, frequency: 'Monthly' },
];

// Six months of history for the reports page. November's spending is computed
// from the transactions above; the earlier months are the household's record.
export const MONTHLY_HISTORY = [
  { month: 'Jun 2026', income: 6850, spent: 4521.1 },
  { month: 'Jul 2026', income: 6850, spent: 4788.45 },
  { month: 'Aug 2026', income: 6980, spent: 5120.3 },
  { month: 'Sep 2026', income: 6850, spent: 4612.75 },
  { month: 'Oct 2026', income: 6850, spent: 4490.2 },
  { month: 'Nov 2026', income: 6850, spent: null },
];

// The 50/30/20 rule, as the planner page explains it.
export const RULE_503020 = {
  needs: ['housing', 'groceries', 'transport', 'utilities', 'health', 'kids'],
  wants: ['dining', 'entertainment', 'clothing', 'subscriptions', 'pets', 'home', 'misc'],
};
