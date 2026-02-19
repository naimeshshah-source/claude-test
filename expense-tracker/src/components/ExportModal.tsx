'use client';

// ExportModal — lets the user pick a format and trigger a download
// TODO: wire up to /api/export and add date range / category filters

import { useState } from 'react';
import { ExportFormat } from '@/lib/exporters';

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'csv',  label: 'CSV  (.csv)'  },
  { value: 'pdf',  label: 'PDF  (.pdf)'  },
  { value: 'json', label: 'JSON (.json)' },
];

interface ExportModalProps {
  onClose: () => void;
}

export default function ExportModal({ onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Export Expenses</h2>
        <div className="space-y-2 mb-6">
          {FORMATS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value={value}
                checked={format === value}
                onChange={() => setFormat(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
