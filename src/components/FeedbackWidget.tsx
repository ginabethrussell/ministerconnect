// components/FeedbackWidget.tsx
'use client';

import { useEffect, useState } from 'react';

const NAVY = '#2b6cb1';
const RED = '#C62828';
const MAX = 600;

type Step = 'rate' | 'form' | 'sent';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('rate');
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const action = id ? `https://formspree.io/f/${id}` : '';

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function submit(payload: { rating: 'up' | 'down'; message?: string; email?: string }) {
    if (!action) {
      setError('Feedback form not configured.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('rating', payload.rating);
      if (payload.message) fd.append('message', payload.message);
      if (payload.email) fd.append('email', payload.email);
      if (typeof window !== 'undefined') {
        fd.append('page', window.location.pathname);
      }
      const res = await fetch(action, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Submission failed');
      setStep('sent');
      setEmail('');
      setMessage('');
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  function handleRate(sel: 'up' | 'down') {
    setRating(sel);
    if (sel === 'up') {
      // 2-click send for 👍
      void submit({ rating: 'up' });
    } else {
      // Expand to form for 👎
      setStep('form');
    }
  }

  function resetToRate() {
    setStep('rate');
    setRating(null);
    setMessage('');
    setError(null);
  }

  return (
    <>
      {/* Launcher bubble */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setStep('rate');
          setError(null);
        }}
        aria-label="Open feedback form"
        className="fixed bottom-6 right-6 z-[2147483647] grid aspect-square h-14 w-14 place-items-center rounded-full border-0 p-0 leading-none shadow-xl transition-transform duration-150 active:scale-95 lg:bottom-[88px]"
        style={{ backgroundColor: RED, color: 'white' }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" className="block" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 4H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9l3.6 3.6c.63.63 1.7.18 1.7-.71V17h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
          />
        </svg>
        <span className="sr-only">Feedback</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="fixed bottom-24 right-4 z-[2147483647] w-[340px] max-w-[92vw] rounded-2xl border shadow-2xl lg:bottom-[140px]"
          style={{ background: 'white', borderColor: '#E5E7EB' }}
        >
          {/* Header */}
          <div
            id="feedback-title"
            className="flex items-center justify-between rounded-t-2xl px-4 py-3"
            style={{ background: NAVY, color: 'white' }}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden>💬</span>
              <h3 className="text-sm font-semibold tracking-wide">Feedback</h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close feedback form"
              className="opacity-90 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {step === 'sent' ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-700">
                <span>✅</span>
                <p className="text-sm">Thanks! We read every message.</p>
              </div>
            ) : step === 'rate' ? (
              <div className="space-y-3">
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}
                <p className="text-sm text-gray-700">Was this page helpful?</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRate('up')}
                    disabled={sending}
                    className="flex-1 rounded-xl bg-gray-100 px-3 py-2 font-medium shadow-sm transition hover:bg-gray-200"
                  >
                    👍 Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRate('down')}
                    disabled={sending}
                    className="flex-1 rounded-xl bg-gray-100 px-3 py-2 font-medium shadow-sm transition hover:bg-gray-200"
                  >
                    👎 No
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Two clicks to send. We really appreciate it!
                </p>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!message.trim()) return;
                  submit({ rating: rating ?? 'down', message, email: email || undefined });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    if (message.trim())
                      submit({ rating: rating ?? 'down', message, email: email || undefined });
                  }
                }}
              >
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}
                <p className="text-xs text-gray-500">Tell us what we could improve 🙂</p>

                <div className="space-y-1">
                  <label htmlFor="fb-email" className="text-xs font-semibold text-gray-600">
                    Your email (optional)
                  </label>
                  <input
                    id="fb-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="fb-message" className="text-xs font-semibold text-gray-600">
                      Message
                    </label>
                    <span className="text-[11px] text-gray-400">
                      {message.length}/{MAX}
                    </span>
                  </div>
                  <textarea
                    id="fb-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                    placeholder="What didn’t work or what was confusing?"
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <p className="text-[11px] text-gray-400">Press ⌘/Ctrl + Enter to send</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={resetToRate}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="flex-1 rounded-xl px-4 py-2 font-semibold shadow-md transition-transform duration-150 active:scale-[.99] disabled:opacity-60"
                    style={{ background: RED, color: 'white' }}
                  >
                    {sending ? 'Sending…' : 'Send feedback ✉️'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
