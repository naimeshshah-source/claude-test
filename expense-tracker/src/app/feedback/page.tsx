'use client';

import { useState } from 'react';
import { generateId } from '@/lib/utils';

interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'general';
  rating: number;
  message: string;
  createdAt: string;
}

const FEEDBACK_KEY = 'expense-tracker-feedback';

function loadFeedback(): FeedbackEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveFeedback(entries: FeedbackEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
}

export default function FeedbackPage() {
  const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => loadFeedback());

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (rating === 0) errs.rating = 'Please select a rating';
    if (!message.trim()) errs.message = 'Please enter your feedback';
    if (message.trim().length > 1000) errs.message = 'Feedback must be under 1000 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const entry: FeedbackEntry = {
      id: generateId(),
      type,
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [entry, ...feedbackList];
    saveFeedback(updated);
    setFeedbackList(updated);
    setSubmitted(true);
    setType('general');
    setRating(0);
    setMessage('');
    setErrors({});
    setTimeout(() => setSubmitted(false), 3000);
  }

  const typeOptions = [
    { value: 'general', label: 'General Feedback', icon: '💬' },
    { value: 'feature', label: 'Feature Request', icon: '💡' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">Help us improve ExpenseTracker with your feedback</p>
      </div>

      {/* Success message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
          <p className="text-green-700 font-medium text-sm">Thank you for your feedback!</p>
        </div>
      )}

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
          <div className="grid grid-cols-3 gap-3">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  type === opt.value
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="block text-lg mb-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`w-10 h-10 rounded-lg text-xl transition-colors ${
                  star <= rating
                    ? 'bg-yellow-100 text-yellow-500'
                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-between mt-1">
            {errors.message ? (
              <p className="text-red-500 text-xs">{errors.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-gray-400">{message.length}/1000</p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Submit Feedback
        </button>
      </form>

      {/* Previous Feedback */}
      {feedbackList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Your Previous Feedback</h2>
          {feedbackList.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {entry.type === 'bug' ? '🐛 Bug' : entry.type === 'feature' ? '💡 Feature' : '💬 General'}
                </span>
                <span className="text-yellow-500 text-sm">
                  {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
