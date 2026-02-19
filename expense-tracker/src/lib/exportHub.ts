import { Expense, ExpenseCategory } from '@/types/expense';

// ── Export history persistence ────────────────────────────────────

const HISTORY_KEY = 'expense-tracker-export-history';
const SCHEDULE_KEY = 'expense-tracker-export-schedule';

export interface ExportHistoryEntry {
  id: string;
  timestamp: string;
  method: string;        // 'download' | 'email' | 'google-sheets' | 'dropbox' | 'onedrive'
  format: string;        // 'csv' | 'json' | 'pdf'
  template: string;      // template name used
  recordCount: number;
  totalAmount: number;
  filename: string;
}

export interface ExportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'csv' | 'json' | 'pdf';
  destination: string;
  lastRun: string | null;
  nextRun: string;
}

export function loadExportHistory(): ExportHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

export function saveExportHistory(entries: ExportHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50)));
}

export function addExportHistoryEntry(entry: Omit<ExportHistoryEntry, 'id' | 'timestamp'>): ExportHistoryEntry {
  const full: ExportHistoryEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    timestamp: new Date().toISOString(),
  };
  const history = loadExportHistory();
  history.unshift(full);
  saveExportHistory(history);
  return full;
}

export function loadExportSchedule(): ExportSchedule | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function saveExportSchedule(schedule: ExportSchedule | null): void {
  if (typeof window === 'undefined') return;
  if (schedule) localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  else localStorage.removeItem(SCHEDULE_KEY);
}

// ── Export template definitions ──────────────────────────────────

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: ExpenseCategory[] | 'all';
  dateRange: 'all' | 'this-month' | 'last-month' | 'this-year' | 'last-90-days';
  format: 'csv' | 'json' | 'pdf';
  columns: string[];
}

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'All expenses formatted for tax filing with category breakdowns',
    icon: '📋',
    color: '#10b981',
    categories: 'all',
    dateRange: 'this-year',
    format: 'pdf',
    columns: ['date', 'category', 'description', 'amount'],
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Current month overview with totals per category',
    icon: '📊',
    color: '#3b82f6',
    categories: 'all',
    dateRange: 'this-month',
    format: 'csv',
    columns: ['date', 'category', 'description', 'amount'],
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending patterns by category',
    icon: '🔍',
    color: '#8b5cf6',
    categories: 'all',
    dateRange: 'last-90-days',
    format: 'json',
    columns: ['date', 'category', 'description', 'amount'],
  },
  {
    id: 'food-tracker',
    name: 'Food & Dining',
    description: 'Track restaurant and grocery spending',
    icon: '🍔',
    color: '#ef4444',
    categories: ['Food'],
    dateRange: 'this-month',
    format: 'csv',
    columns: ['date', 'description', 'amount'],
  },
  {
    id: 'bills-audit',
    name: 'Bills Audit',
    description: 'Review recurring bills and utilities',
    icon: '📄',
    color: '#f59e0b',
    categories: ['Bills'],
    dateRange: 'last-90-days',
    format: 'pdf',
    columns: ['date', 'description', 'amount'],
  },
  {
    id: 'full-backup',
    name: 'Full Backup',
    description: 'Complete data export for backup purposes',
    icon: '💾',
    color: '#6b7280',
    categories: 'all',
    dateRange: 'all',
    format: 'json',
    columns: ['date', 'category', 'description', 'amount'],
  },
];

// ── Cloud integration definitions ────────────────────────────────

export interface CloudIntegration {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  connected: boolean;
}

export const CLOUD_INTEGRATIONS: CloudIntegration[] = [
  { id: 'email', name: 'Email', description: 'Send export directly to your inbox', color: '#ea4335', bgColor: '#fef2f2', connected: false },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Sync to a live spreadsheet', color: '#34a853', bgColor: '#f0fdf4', connected: false },
  { id: 'dropbox', name: 'Dropbox', description: 'Save to your Dropbox folder', color: '#0061ff', bgColor: '#eff6ff', connected: false },
  { id: 'onedrive', name: 'OneDrive', description: 'Sync with Microsoft OneDrive', color: '#0078d4', bgColor: '#eff6ff', connected: false },
  { id: 'notion', name: 'Notion', description: 'Push data to a Notion database', color: '#000000', bgColor: '#f9fafb', connected: false },
];

// ── Filtering by template date range ─────────────────────────────

export function filterByTemplate(expenses: Expense[], template: ExportTemplate): Expense[] {
  let result = [...expenses];

  // Category filter
  if (template.categories !== 'all') {
    const cats = new Set(template.categories);
    result = result.filter((e) => cats.has(e.category));
  }

  // Date filter
  const now = new Date();
  if (template.dateRange === 'this-month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    result = result.filter((e) => e.date >= start);
  } else if (template.dateRange === 'last-month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    result = result.filter((e) => e.date >= start && e.date <= end);
  } else if (template.dateRange === 'this-year') {
    const start = `${now.getFullYear()}-01-01`;
    result = result.filter((e) => e.date >= start);
  } else if (template.dateRange === 'last-90-days') {
    const d = new Date(now);
    d.setDate(d.getDate() - 90);
    const start = d.toISOString().split('T')[0];
    result = result.filter((e) => e.date >= start);
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

// ── File builders ────────────────────────────────────────────────

export function buildExportCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
    e.amount.toFixed(2),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function buildExportJSON(expenses: Expense[]): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    recordCount: expenses.length,
    totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
    expenses: expenses.map((e) => ({
      date: e.date,
      category: e.category,
      description: e.description,
      amount: e.amount,
    })),
  }, null, 2);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Shareable link simulation ────────────────────────────────────

export function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export function computeNextRun(frequency: 'daily' | 'weekly' | 'monthly'): string {
  const d = new Date();
  if (frequency === 'daily') d.setDate(d.getDate() + 1);
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}
