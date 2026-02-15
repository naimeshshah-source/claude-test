'use client';

import { useState, useMemo, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { exportExpensesToPDF } from '@/lib/storage';
import {
  ExportTemplate, EXPORT_TEMPLATES, CLOUD_INTEGRATIONS,
  ExportHistoryEntry, ExportSchedule,
  filterByTemplate, buildExportCSV, buildExportJSON, downloadBlob,
  loadExportHistory, addExportHistoryEntry,
  loadExportSchedule, saveExportSchedule,
  generateShareId, computeNextRun,
} from '@/lib/exportHub';

type Tab = 'templates' | 'cloud' | 'share' | 'schedule' | 'history';

interface ExportHubProps {
  expenses: Expense[];
  onClose: () => void;
}

// ── Main ExportHub drawer ────────────────────────────────────────

export default function ExportHub({ expenses, onClose }: ExportHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  const TABS: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: 'templates', label: 'Templates', icon: <TemplatesIcon /> },
    { id: 'cloud', label: 'Cloud', icon: <CloudIcon /> },
    { id: 'share', label: 'Share', icon: <ShareIcon /> },
    { id: 'schedule', label: 'Automate', icon: <CalendarIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xl bg-white shadow-2xl flex flex-col animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Export Hub</h2>
                <p className="text-blue-100 text-xs">{expenses.length} expenses ready to export</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mt-4 -mb-5 px-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-blue-100 hover:bg-white/15'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'templates' && <TemplatesPanel expenses={expenses} />}
          {activeTab === 'cloud' && <CloudPanel expenses={expenses} />}
          {activeTab === 'share' && <SharePanel expenses={expenses} />}
          {activeTab === 'schedule' && <SchedulePanel />}
          {activeTab === 'history' && <HistoryPanel />}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}


// ── Templates Panel ──────────────────────────────────────────────

function TemplatesPanel({ expenses }: { expenses: Expense[] }) {
  const [activeExport, setActiveExport] = useState<string | null>(null);
  const [doneExport, setDoneExport] = useState<string | null>(null);

  async function runExport(template: ExportTemplate) {
    const data = filterByTemplate(expenses, template);
    if (data.length === 0) return;

    setActiveExport(template.id);
    await new Promise((r) => setTimeout(r, 800));

    const fname = template.name.toLowerCase().replace(/\s+/g, '-');
    if (template.format === 'csv') {
      downloadBlob(new Blob([buildExportCSV(data)], { type: 'text/csv' }), `${fname}.csv`);
    } else if (template.format === 'json') {
      downloadBlob(new Blob([buildExportJSON(data)], { type: 'application/json' }), `${fname}.json`);
    } else {
      exportExpensesToPDF(data);
    }

    addExportHistoryEntry({
      method: 'download',
      format: template.format,
      template: template.name,
      recordCount: data.length,
      totalAmount: data.reduce((s, e) => s + e.amount, 0),
      filename: `${fname}.${template.format}`,
    });

    setActiveExport(null);
    setDoneExport(template.id);
    setTimeout(() => setDoneExport(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Export Templates</h3>
        <p className="text-xs text-gray-500">One-click exports with pre-configured settings</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {EXPORT_TEMPLATES.map((tpl) => {
          const data = filterByTemplate(expenses, tpl);
          const total = data.reduce((s, e) => s + e.amount, 0);
          const isExporting = activeExport === tpl.id;
          const isDone = doneExport === tpl.id;

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: tpl.color + '15' }}
                >
                  {tpl.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{tpl.name}</h4>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">
                      {tpl.format}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{tpl.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{data.length} records</span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-400">{formatCurrency(total)}</span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-400 capitalize">{tpl.dateRange.replace('-', ' ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => runExport(tpl)}
                  disabled={data.length === 0 || isExporting}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isDone
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {isExporting ? (
                    <span className="flex items-center gap-1.5">
                      <Spinner /> Exporting...
                    </span>
                  ) : isDone ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Done
                    </span>
                  ) : (
                    'Export'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Cloud Integrations Panel ─────────────────────────────────────

function CloudPanel({ expenses }: { expenses: Expense[] }) {
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<string | null>(null);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);

  async function handleConnect(id: string) {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1500));
    setConnections((prev) => ({ ...prev, [id]: !prev[id] }));
    setConnecting(null);
  }

  async function handleSend(id: string) {
    if (id === 'email' && !emailInput.trim()) return;
    setSendingTo(id);
    await new Promise((r) => setTimeout(r, 1200));

    addExportHistoryEntry({
      method: id,
      format: 'csv',
      template: 'Quick Export',
      recordCount: expenses.length,
      totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
      filename: `expenses-${new Date().toISOString().split('T')[0]}.csv`,
    });

    setSendingTo(null);
    setSentTo(id);
    setTimeout(() => setSentTo(null), 2500);
  }

  const integrations = CLOUD_INTEGRATIONS;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Cloud Integrations</h3>
        <p className="text-xs text-gray-500">Send your data directly to your favorite services</p>
      </div>

      {/* Sync status bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-blue-700 font-medium">
          {Object.values(connections).filter(Boolean).length} service{Object.values(connections).filter(Boolean).length !== 1 ? 's' : ''} connected
        </span>
        <span className="text-xs text-blue-400 ml-auto">Last sync: just now</span>
      </div>

      <div className="space-y-3">
        {integrations.map((svc) => {
          const connected = connections[svc.id] || false;
          const isConnecting = connecting === svc.id;
          const isSending = sendingTo === svc.id;
          const isSent = sentTo === svc.id;

          return (
            <div key={svc.id} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                {/* Service icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: svc.bgColor }}
                >
                  <ServiceIcon id={svc.id} color={svc.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{svc.name}</h4>
                    {connected && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 rounded text-[10px] font-bold text-green-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{svc.description}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {connected && (
                    <button
                      onClick={() => svc.id === 'email' ? setShowEmailField(!showEmailField) : handleSend(svc.id)}
                      disabled={isSending || expenses.length === 0}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        isSent
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                      }`}
                    >
                      {isSending ? <span className="flex items-center gap-1"><Spinner /> Sending...</span>
                        : isSent ? 'Sent!' : 'Send'}
                    </button>
                  )}
                  <button
                    onClick={() => handleConnect(svc.id)}
                    disabled={isConnecting}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      connected
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isConnecting ? <span className="flex items-center gap-1"><Spinner /> {connected ? 'Disconnecting' : 'Connecting'}...</span>
                      : connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>

              {/* Email input */}
              {svc.id === 'email' && connected && showEmailField && (
                <div className="px-4 pb-4 pt-0">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSend('email')}
                      disabled={!emailInput.trim() || isSending}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {sendingTo === 'email' ? <Spinner /> : 'Send'}
                    </button>
                  </div>
                  {sentTo === 'email' && (
                    <p className="text-xs text-green-600 mt-1.5">Export sent to {emailInput}!</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Share Panel ──────────────────────────────────────────────────

function SharePanel({ expenses }: { expenses: Expense[] }) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [linkExpiry, setLinkExpiry] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [passwordProtect, setPasswordProtect] = useState(false);

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const id = generateShareId();
    setShareLink(`https://expensetracker.app/shared/${id}`);
    setGenerating(false);

    addExportHistoryEntry({
      method: 'share-link',
      format: 'link',
      template: 'Shared Report',
      recordCount: expenses.length,
      totalAmount: total,
      filename: `shared-${id}`,
    });
  }

  function handleCopy() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Share & Collaborate</h3>
        <p className="text-xs text-gray-500">Generate secure links to share your expense data</p>
      </div>

      {/* Preview card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Expense Report</p>
            <p className="text-xs text-gray-500">Shared report preview</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-900">{expenses.length}</p>
            <p className="text-[10px] text-gray-500">Expenses</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-900">{new Set(expenses.map(e => e.category)).size}</p>
            <p className="text-[10px] text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Link options */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Link expires in</label>
          <div className="flex gap-2">
            {(['1h', '24h', '7d', '30d'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setLinkExpiry(opt)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  linkExpiry === opt
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt === '1h' ? '1 hour' : opt === '24h' ? '24 hours' : opt === '7d' ? '7 days' : '30 days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-semibold text-gray-700">Include charts</p>
            <p className="text-[10px] text-gray-400">Visual charts in the shared view</p>
          </div>
          <Toggle checked={includeCharts} onChange={setIncludeCharts} />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-semibold text-gray-700">Password protection</p>
            <p className="text-[10px] text-gray-400">Require password to view</p>
          </div>
          <Toggle checked={passwordProtect} onChange={setPasswordProtect} />
        </div>
      </div>

      {/* Generate / Share link */}
      {!shareLink ? (
        <button
          onClick={handleGenerate}
          disabled={generating || expenses.length === 0}
          className="w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? <><Spinner /> Generating secure link...</> : 'Generate Shareable Link'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-mono"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                copied ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* QR Code placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-900 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
              <QRPlaceholder />
            </div>
            <p className="text-xs text-gray-500">Scan to view shared report</p>
          </div>

          <button
            onClick={() => { setShareLink(null); setCopied(false); }}
            className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Generate new link
          </button>
        </div>
      )}
    </div>
  );
}


// ── Schedule Panel ───────────────────────────────────────────────

function SchedulePanel() {
  const [schedule, setSchedule] = useState<ExportSchedule | null>(null);
  const [editing, setEditing] = useState(false);
  const [freq, setFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [fmt, setFmt] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [dest, setDest] = useState('email');

  useEffect(() => {
    setSchedule(loadExportSchedule());
  }, []);

  function handleSave() {
    const newSchedule: ExportSchedule = {
      enabled: true,
      frequency: freq,
      format: fmt,
      destination: dest,
      lastRun: null,
      nextRun: computeNextRun(freq),
    };
    saveExportSchedule(newSchedule);
    setSchedule(newSchedule);
    setEditing(false);
  }

  function handleDisable() {
    saveExportSchedule(null);
    setSchedule(null);
    setEditing(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Automatic Exports</h3>
        <p className="text-xs text-gray-500">Set up recurring exports on a schedule</p>
      </div>

      {schedule && !editing ? (
        <>
          {/* Active schedule card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase">Active Schedule</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase font-medium">Frequency</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{schedule.frequency}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase font-medium">Format</p>
                <p className="text-sm font-bold text-gray-900 uppercase">{schedule.format}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase font-medium">Destination</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{schedule.destination}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase font-medium">Next Run</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(schedule.nextRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setFreq(schedule.frequency); setFmt(schedule.format as 'csv'|'json'|'pdf'); setDest(schedule.destination); setEditing(true); }}
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Schedule
            </button>
            <button
              onClick={handleDisable}
              className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Disable
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Setup / edit form */}
          <div className="space-y-4">
            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      freq === f ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="capitalize">{f}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['csv', 'json', 'pdf'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFmt(f)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all uppercase ${
                      fmt === f ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Send to</label>
              <div className="grid grid-cols-2 gap-2">
                {['email', 'google-sheets', 'dropbox', 'onedrive'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDest(d)}
                    className={`flex items-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      dest === d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ServiceIcon id={d} color={dest === d ? '#2563eb' : '#9ca3af'} size={14} />
                    <span className="capitalize">{d.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview info */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-600">
                Your <span className="font-semibold uppercase">{fmt}</span> export will be sent <span className="font-semibold">{freq}</span> to <span className="font-semibold capitalize">{dest.replace('-', ' ')}</span>.
                Next: <span className="font-semibold">{new Date(computeNextRun(freq)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {schedule ? 'Update Schedule' : 'Enable Automatic Export'}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}


// ── History Panel ────────────────────────────────────────────────

function HistoryPanel() {
  const [history, setHistory] = useState<ExportHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadExportHistory());
  }, []);

  function clearHistory() {
    localStorage.removeItem('expense-tracker-export-history');
    setHistory([]);
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No export history</h3>
        <p className="text-xs text-gray-500">Your exports will appear here after you create them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Export History</h3>
          <p className="text-xs text-gray-500">{history.length} export{history.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={clearHistory} className="text-xs text-red-600 hover:text-red-800">Clear all</button>
      </div>

      <div className="space-y-2">
        {history.map((entry) => {
          const date = new Date(entry.timestamp);
          return (
            <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MethodIcon method={entry.method} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-900 truncate">{entry.filename}</p>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase flex-shrink-0">
                    {entry.format}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {entry.recordCount} records · {formatCurrency(entry.totalAmount)} · via {entry.method.replace('-', ' ')}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-gray-500 font-medium">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-[10px] text-gray-400">
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Shared UI helpers ────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  );
}

function QRPlaceholder() {
  // Generate a simple visual grid to simulate a QR code
  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // Corner markers
      const isCornerMarker =
        (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      const filled = isCornerMarker || Math.random() > 0.45;
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`${filled ? 'bg-white' : 'bg-gray-900'}`}
          style={{ gridRow: r + 1, gridColumn: c + 1 }}
        />
      );
    }
  }
  return (
    <div className="grid grid-cols-9 grid-rows-9 gap-px w-24 h-24 p-2 bg-gray-900">
      {cells}
    </div>
  );
}

function ServiceIcon({ id, color, size = 16 }: { id: string; color: string; size?: number }) {
  const s = `${size}`;
  if (id === 'email') return (
    <svg width={s} height={s} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (id === 'google-sheets') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
    </svg>
  );
  if (id === 'dropbox') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l-5.5 3.5L12 9l5.5-3.5L12 2zM1 9l5.5 3.5L12 9 6.5 5.5 1 9zm11 0l5.5 3.5L23 9l-5.5-3.5L12 9zM1 9l5.5 3.5L12 16l-5.5-3.5L1 9zm22 0l-5.5 3.5L12 16l5.5-3.5L23 9z" />
    </svg>
  );
  if (id === 'onedrive') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <path d="M12 6a6 6 0 016 6h1a4 4 0 010 8H7a5 5 0 01-1-9.9A6 6 0 0112 6z" />
    </svg>
  );
  if (id === 'notion') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
      <path d="M4 4h10l6 6v10H4V4zm10 0v6h6M8 12h8M8 16h5" fillOpacity="0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  return null;
}

function MethodIcon({ method }: { method: string }) {
  if (method === 'download') return (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
  if (method === 'share-link') return (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
  return <ServiceIcon id={method} color="#6b7280" size={16} />;
}

// ── Tab icons ────────────────────────────────────────────────────

function TemplatesIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
}
function CloudIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
}
function ShareIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
}
function CalendarIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function HistoryIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
