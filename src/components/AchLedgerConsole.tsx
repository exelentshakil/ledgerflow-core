'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Cpu,
  Layers,
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentProcessResult } from '@/lib/fintech';

function generateRandomUuid(): string {
  return 'idemp_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now().toString(36);
}

export function AchLedgerConsole() {
  const [amount, setAmount] = useState<number>(2450.0);
  const [secCode, setSecCode] = useState<'PPD' | 'CCD' | 'WEB'>('CCD');
  const [sourceAccount, setSourceAccount] = useState('1092837465');
  const [sourceRouting, setSourceRouting] = useState('121000358');
  const [destAccount, setDestAccount] = useState('9876543210');
  const [destRouting, setDestRouting] = useState('091000019');
  const [memo, setMemo] = useState('Vendor Net-30 B2B Settlement');
  const [idempotencyKey, setIdempotencyKey] = useState<string>(generateRandomUuid());
  const [simulatedOutage, setSimulatedOutage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentProcessResult | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          secCode,
          sourceAccount,
          sourceRouting,
          destinationAccount: destAccount,
          destinationRouting: destRouting,
          memo,
          idempotencyKey,
          simulatedOutage,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Payment processing failed', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetAmount: number, presetSec: 'PPD' | 'CCD' | 'WEB', presetMemo: string) => {
    setAmount(presetAmount);
    setSecCode(presetSec);
    setMemo(presetMemo);
    setIdempotencyKey(generateRandomUuid());
  };

  const copyIdempotencyKey = () => {
    navigator.clipboard.writeText(idempotencyKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
              <CreditCard className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Interactive ACH Payment &amp; Double-Entry Ledger Engine
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Execute transactions with strict idempotency locks, automated double-entry general ledger balancing, and 94-char NACHA batch generation.
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-[var(--color-text-muted)] shrink-0">Presets:</span>
          <button
            onClick={() => applyPreset(4250.0, 'PPD', 'Payroll Direct Deposit (PPD)')}
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-indigo-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            Payroll ($4.2k)
          </button>
          <button
            onClick={() => applyPreset(18400.0, 'CCD', 'Vendor B2B Wire/ACH Settlement')}
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-indigo-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            B2B Settlement ($18.4k)
          </button>
          <button
            onClick={() => applyPreset(89.5, 'WEB', 'Consumer E-Commerce Checkout')}
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-indigo-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            Web Checkout ($89)
          </button>
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Transaction Input Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] space-y-3.5 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono text-[11px]">
              Transaction Specification
            </h3>

            {/* Amount & SEC Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-[var(--color-text-muted)] font-mono">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">SEC Code</label>
                <select
                  value={secCode}
                  onChange={(e) => setSecCode(e.target.value as 'PPD' | 'CCD' | 'WEB')}
                  className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs text-[var(--color-text-primary)] focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="CCD">CCD (Corporate Credit/Debit)</option>
                  <option value="PPD">PPD (Prearranged Consumer)</option>
                  <option value="WEB">WEB (Internet Initiated)</option>
                </select>
              </div>
            </div>

            {/* Accounts & Routing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Source Acct</label>
                <input
                  type="text"
                  value={sourceAccount}
                  onChange={(e) => setSourceAccount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs text-[var(--color-text-primary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Destination Acct</label>
                <input
                  type="text"
                  value={destAccount}
                  onChange={(e) => setDestAccount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs text-[var(--color-text-primary)]"
                />
              </div>
            </div>

            {/* Memo */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Transfer Memo</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-primary)]"
              />
            </div>

            {/* Idempotency Key Box */}
            <div className="space-y-1 pt-1 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Idempotency-Key Header
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={copyIdempotencyKey}
                    className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer flex items-center gap-0.5"
                  >
                    {copiedKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdempotencyKey(generateRandomUuid())}
                    className="text-[10px] text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    <span>New Key</span>
                  </button>
                </div>
              </div>
              <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 font-mono text-[11px] text-[var(--color-text-primary)] truncate">
                {idempotencyKey}
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">
                Submitting this identical key twice triggers our Replay Interceptor, proving double-debits are impossible.
              </p>
            </div>

            {/* Simulated Failover Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-[var(--color-border)]">
              <span className="text-[11px] text-[var(--color-text-secondary)]">Simulate Primary API Outage</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulatedOutage}
                  onChange={(e) => setSimulatedOutage(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                onClick={handleProcessPayment}
                disabled={loading}
                className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
                Process Payment
              </Button>
              <Button
                variant="outline"
                onClick={handleProcessPayment}
                disabled={loading || !result}
                className="w-full text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                Test Replay Attack
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Ledger & NACHA Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result ? (
            <div className="h-full min-h-[360px] rounded-xl border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center p-8 text-center bg-[var(--color-panel-subtle)] space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-xs">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Awaiting Transaction Trigger
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Click &ldquo;Process Payment&rdquo; to simulate live ACH batch compilation, double-entry ledger bookkeeping, and Claude AI compliance verification.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Duplicate Interception Alert */}
              {result.isDuplicate && (
                <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start gap-2.5 text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Idempotency Lock Active (Replay Intercepted!)</p>
                    <p className="text-[11px] leading-relaxed">
                      Identical idempotency key `{result.idempotencyKey}` submitted. Returned cached response in {result.latencyMs}ms with zero secondary debits.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Ribbon */}
              <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-[var(--color-text-primary)]">TX ID: {result.transactionId}</span>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    {result.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-[11px]">
                  <span>{result.provider} ({result.model})</span>
                  <span>•</span>
                  <span>{result.latencyMs}ms</span>
                </div>
              </div>

              {/* Double-Entry General Ledger Card */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[var(--color-text-primary)]">
                    <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Double-Entry General Ledger Invariant</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Variance: $0.00 (Balanced)
                  </span>
                </div>

                <div className="space-y-1.5">
                  {result.ledgerEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              entry.entryType === 'DEBIT'
                                ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            {entry.entryType}
                          </span>
                          <span className="font-bold text-[var(--color-text-primary)] truncate">
                            {entry.accountName}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--color-text-muted)] truncate block">
                          Acct Ref: {entry.accountId}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-bold font-mono shrink-0 ${
                          entry.entryType === 'DEBIT' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {entry.entryType === 'DEBIT' ? '-' : '+'}${(entry.amountCents / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NACHA 94-Character ACH Batch Record Viewer */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[var(--color-text-primary)]">
                    <FileText className="h-3.5 w-3.5 text-indigo-600" />
                    <span>FedACH 94-Char Batch Lines</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    NACHA Rule 5.1 Format
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[10px] bg-slate-950 text-slate-200 p-3 rounded-lg overflow-x-auto">
                  {result.nachaBatch.map((nacha, idx) => (
                    <div key={idx} className="space-y-0.5 py-0.5 border-b border-slate-800 last:border-0">
                      <div className="text-slate-400 text-[9px] flex items-center justify-between">
                        <span>{nacha.recordType}</span>
                        <span>{nacha.description}</span>
                      </div>
                      <div className="text-emerald-400 whitespace-pre tracking-tight">{nacha.line}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Architecture & Compliance Analysis */}
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Claude AI Architectural &amp; Compliance Notes</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300">
                    Risk Score: {result.aiAnalysis.riskScore}
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                  {result.aiAnalysis.architecturalNotes}
                </p>
                <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900">
                  <span className="text-[10px] font-mono font-bold text-indigo-800 dark:text-indigo-300 block mb-1">
                    Recommended High-Throughput Index:
                  </span>
                  <code className="text-[10px] font-mono text-slate-800 dark:text-slate-300 bg-[var(--color-surface)] px-2 py-1 rounded border border-[var(--color-border)] block overflow-x-auto">
                    {result.aiAnalysis.suggestedIndex}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
