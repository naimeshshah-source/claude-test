import { Expense } from '@/types/expense';

const SEED_EXPENSES: Omit<Expense, 'id' | 'createdAt'>[] = [
  // Food
  { amount: 12.50, category: 'Food', description: 'Lunch at Chipotle', date: '2026-02-14' },
  { amount: 45.80, category: 'Food', description: 'Weekly groceries at Trader Joe\'s', date: '2026-02-12' },
  { amount: 8.99, category: 'Food', description: 'Morning coffee and bagel', date: '2026-02-11' },
  { amount: 62.30, category: 'Food', description: 'Dinner with friends at Italian place', date: '2026-02-08' },
  { amount: 15.40, category: 'Food', description: 'Sushi takeout', date: '2026-02-05' },
  { amount: 34.20, category: 'Food', description: 'Grocery run - fruits and veggies', date: '2026-02-01' },
  { amount: 9.75, category: 'Food', description: 'Smoothie from Jamba Juice', date: '2026-01-28' },
  { amount: 78.60, category: 'Food', description: 'Birthday dinner at steakhouse', date: '2026-01-22' },
  { amount: 22.15, category: 'Food', description: 'Thai food delivery', date: '2026-01-18' },
  { amount: 5.50, category: 'Food', description: 'Afternoon snack - pretzels & soda', date: '2026-01-14' },

  // Transportation
  { amount: 55.00, category: 'Transportation', description: 'Monthly bus pass top-up', date: '2026-02-01' },
  { amount: 42.30, category: 'Transportation', description: 'Gas fill-up', date: '2026-02-10' },
  { amount: 18.50, category: 'Transportation', description: 'Uber ride to airport', date: '2026-02-07' },
  { amount: 12.00, category: 'Transportation', description: 'Parking garage downtown', date: '2026-02-03' },
  { amount: 38.75, category: 'Transportation', description: 'Gas fill-up', date: '2026-01-25' },
  { amount: 24.00, category: 'Transportation', description: 'Lyft ride home from concert', date: '2026-01-20' },
  { amount: 250.00, category: 'Transportation', description: 'Car oil change and tire rotation', date: '2026-01-15' },
  { amount: 8.50, category: 'Transportation', description: 'Toll road charges', date: '2026-01-10' },

  // Entertainment
  { amount: 15.99, category: 'Entertainment', description: 'Netflix monthly subscription', date: '2026-02-01' },
  { amount: 12.99, category: 'Entertainment', description: 'Spotify Premium', date: '2026-02-01' },
  { amount: 32.00, category: 'Entertainment', description: 'Movie tickets for two', date: '2026-02-09' },
  { amount: 65.00, category: 'Entertainment', description: 'Concert tickets', date: '2026-01-20' },
  { amount: 49.99, category: 'Entertainment', description: 'New video game purchase', date: '2026-01-30' },
  { amount: 25.00, category: 'Entertainment', description: 'Bowling night with friends', date: '2026-01-17' },
  { amount: 9.99, category: 'Entertainment', description: 'Kindle book purchase', date: '2026-02-13' },
  { amount: 120.00, category: 'Entertainment', description: 'Escape room group activity', date: '2026-01-08' },

  // Shopping
  { amount: 89.99, category: 'Shopping', description: 'New running shoes', date: '2026-02-06' },
  { amount: 34.50, category: 'Shopping', description: 'Winter jacket on sale', date: '2026-01-28' },
  { amount: 19.99, category: 'Shopping', description: 'Phone case and screen protector', date: '2026-02-04' },
  { amount: 149.00, category: 'Shopping', description: 'Wireless noise-cancelling headphones', date: '2026-01-12' },
  { amount: 45.00, category: 'Shopping', description: 'Birthday gift for mom', date: '2026-02-10' },
  { amount: 27.80, category: 'Shopping', description: 'Kitchen utensils set', date: '2026-01-22' },
  { amount: 62.50, category: 'Shopping', description: 'Backpack for weekend trips', date: '2026-01-05' },
  { amount: 15.00, category: 'Shopping', description: 'Notebook and pens from Target', date: '2026-02-11' },

  // Bills
  { amount: 1200.00, category: 'Bills', description: 'Monthly rent', date: '2026-02-01' },
  { amount: 85.00, category: 'Bills', description: 'Electric bill', date: '2026-02-05' },
  { amount: 65.00, category: 'Bills', description: 'Internet service', date: '2026-02-03' },
  { amount: 45.00, category: 'Bills', description: 'Cell phone plan', date: '2026-02-01' },
  { amount: 120.00, category: 'Bills', description: 'Car insurance monthly', date: '2026-02-01' },
  { amount: 1200.00, category: 'Bills', description: 'Monthly rent', date: '2026-01-01' },
  { amount: 92.00, category: 'Bills', description: 'Electric bill', date: '2026-01-06' },
  { amount: 65.00, category: 'Bills', description: 'Internet service', date: '2026-01-03' },
  { amount: 38.50, category: 'Bills', description: 'Water bill', date: '2026-01-15' },
  { amount: 150.00, category: 'Bills', description: 'Health insurance co-pay', date: '2026-01-20' },

  // Other
  { amount: 25.00, category: 'Other', description: 'Charity donation', date: '2026-02-14' },
  { amount: 40.00, category: 'Other', description: 'Haircut and tip', date: '2026-02-08' },
  { amount: 15.00, category: 'Other', description: 'Dry cleaning - 3 shirts', date: '2026-01-27' },
  { amount: 60.00, category: 'Other', description: 'Gym membership monthly', date: '2026-02-01' },
  { amount: 30.00, category: 'Other', description: 'Pet supplies - dog food', date: '2026-01-19' },
  { amount: 22.00, category: 'Other', description: 'Laundromat', date: '2026-01-11' },
];

export function generateSeedExpenses(): Expense[] {
  return SEED_EXPENSES.map((item, index) => ({
    ...item,
    id: `seed-${index}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(item.date + 'T12:00:00').toISOString(),
  }));
}
