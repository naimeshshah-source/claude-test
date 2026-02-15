import { Expense, CATEGORIES } from '@/types/expense';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STORAGE_KEY = 'expense-tracker-data';

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    console.error('Failed to save expenses to localStorage');
  }
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
    e.amount.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportExpensesToPDF(expenses: Expense[]): void {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('ExpenseTracker', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(`Expense Report - Generated on ${today}`, 14, 30);

  // Summary section
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const categoryTotals: Record<string, number> = {};
  CATEGORIES.forEach((c) => (categoryTotals[c] = 0));
  expenses.forEach((e) => (categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount));

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39); // gray-900
  doc.text('Summary', 14, 44);

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81); // gray-700
  doc.text(`Total Expenses: $${total.toFixed(2)}`, 14, 52);
  doc.text(`Number of Expenses: ${expenses.length}`, 14, 58);

  if (expenses.length > 0) {
    const dates = expenses.map((e) => e.date).sort();
    doc.text(`Date Range: ${dates[0]} to ${dates[dates.length - 1]}`, 14, 64);
  }

  // Category breakdown table
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('Category Breakdown', 14, 78);

  const categoryRows = CATEGORIES
    .filter((c) => categoryTotals[c] > 0)
    .map((c) => [
      c,
      `$${categoryTotals[c].toFixed(2)}`,
      `${total > 0 ? ((categoryTotals[c] / total) * 100).toFixed(1) : '0.0'}%`,
    ]);

  autoTable(doc, {
    startY: 82,
    head: [['Category', 'Amount', '% of Total']],
    body: categoryRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
    },
  });

  // Expense details table
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120;
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('Expense Details', 14, finalY + 14);

  const expenseRows = expenses.map((e) => [
    e.date,
    e.category,
    e.description,
    `$${e.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: finalY + 18,
    head: [['Date', 'Category', 'Description', 'Amount']],
    body: expenseRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      2: { cellWidth: 70 },
      3: { halign: 'right' },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // gray-400
    doc.text(
      `Page ${i} of ${pageCount} | ExpenseTracker Report`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportDashboardToPDF(
  expenses: Expense[],
  monthlyTrend: { month: string; amount: number }[]
): void {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ExpenseTracker', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Dashboard Summary - Generated on ${today}`, 14, 30);

  // Overall stats
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const monthlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  const avgDaily = monthlyTotal / now.getDate();

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('Key Metrics', 14, 44);

  autoTable(doc, {
    startY: 48,
    head: [['Metric', 'Value']],
    body: [
      ['Total Spending', `$${total.toFixed(2)}`],
      ['Total Expenses', `${expenses.length}`],
      ['This Month', `$${monthlyTotal.toFixed(2)} (${monthlyExpenses.length} expenses)`],
      ['Daily Average (This Month)', `$${avgDaily.toFixed(2)}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
    styles: { fontSize: 10 },
    columnStyles: { 1: { halign: 'right' } },
  });

  // Monthly trend
  let finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 90;
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('Monthly Trend (Last 6 Months)', 14, finalY + 14);

  autoTable(doc, {
    startY: finalY + 18,
    head: [['Month', 'Amount']],
    body: monthlyTrend.map((m) => [m.month, `$${m.amount.toFixed(2)}`]),
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], fontSize: 10 },
    styles: { fontSize: 10 },
    columnStyles: { 1: { halign: 'right' } },
  });

  // Category breakdown
  finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 140;
  const categoryTotals: Record<string, number> = {};
  CATEGORIES.forEach((c) => (categoryTotals[c] = 0));
  expenses.forEach((e) => (categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount));

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('All-Time Category Breakdown', 14, finalY + 14);

  const catRows = CATEGORIES
    .filter((c) => categoryTotals[c] > 0)
    .map((c) => [
      c,
      `$${categoryTotals[c].toFixed(2)}`,
      `${total > 0 ? ((categoryTotals[c] / total) * 100).toFixed(1) : '0.0'}%`,
    ]);

  autoTable(doc, {
    startY: finalY + 18,
    head: [['Category', 'Amount', '% of Total']],
    body: catRows,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], fontSize: 10 },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${pageCount} | ExpenseTracker Dashboard Report`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
}
