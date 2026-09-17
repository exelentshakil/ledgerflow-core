'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingDown,
  Server,
  Cloud,
  Layers,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function RoiCostCalculator() {
  const [monthlyTransactions, setMonthlyTransactions] = useState<number>(50000);
  const [managedPlatform, setManagedPlatform] = useState<'modern_treasury' | 'stripe_treasury'>('modern_treasury');

  // Self-Hosted Infrastructure Costs on AWS
  // Aurora PostgreSQL Serverless v2 (0.5 to 2 ACUs) ~ $48/mo
  // AWS ECS Fargate Workers (2 tasks, 0.5 vCPU, 1GB RAM) ~ $32/mo
  // SQS & CloudWatch Logs ~ $4.50/mo
  // Dual-Provider AI Compliance Auditing (Claude / GPT-4o-mini sampled at 5%) ~ $14.00/mo
  const selfHostedBase = 48.0 + 32.0 + 4.5 + 14.0; // $98.50
  const selfHostedPerTx = 0.0002; // Minor IOPS and network egress
  const totalSelfHosted = +(selfHostedBase + (monthlyTransactions * selfHostedPerTx)).toFixed(2);

  // Managed Vendor Costs (e.g. Modern Treasury / Stripe Treasury)
  // Modern Treasury: ~$1,500/mo base platform fee + $0.20/ACH transaction
  // Stripe Treasury: ~$500/mo base platform fee + $0.25/ACH transaction + 0.1% volume fee
  const managedFeeConfig = {
    modern_treasury: { base: 1500, perTx: 0.20, name: 'Modern Treasury' },
    stripe_treasury: { base: 500, perTx: 0.25, name: 'Stripe Treasury' },
  };

  const currentManaged = managedFeeConfig[managedPlatform];
  const totalManaged = +(currentManaged.base + (monthlyTransactions * currentManaged.perTx)).toFixed(2);

  const monthlySavings = +(totalManaged - totalSelfHosted).toFixed(2);
  const annualSavings = +(monthlySavings * 12).toFixed(2);
  const savingsPct = Math.round(((totalManaged - totalSelfHosted) / totalManaged) * 100);

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Fintech Infrastructure Economics
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Self-Hosted AWS Aurora Ledger vs. Managed Commercial Platforms
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            Total Cost of Ownership (TCO) &amp; Self-Hosted Ledger ROI
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Compare owning the direct PostgreSQL double-entry ledger on AWS ECS Fargate versus paying 20¢/tx vendor markups to managed treasury platforms.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-[var(--color-text-muted)] font-mono block">
            Annual Projected Savings
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ${annualSavings.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
            Scale Parameters
          </h4>

          {/* Managed Vendor Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-primary)] block">
              Benchmark Managed Vendor:
            </label>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <button
                onClick={() => setManagedPlatform('modern_treasury')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  managedPlatform === 'modern_treasury'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                Modern Treasury ($1.5k + 20¢)
              </button>
              <button
                onClick={() => setManagedPlatform('stripe_treasury')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  managedPlatform === 'stripe_treasury'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                Stripe Treasury ($500 + 25¢)
              </button>
            </div>
          </div>

          {/* Monthly Transaction Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--color-text-primary)]">
                Monthly ACH Transactions:
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {monthlyTransactions.toLocaleString()} tx/mo
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              value={monthlyTransactions}
              onChange={(e) => setMonthlyTransactions(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
              <span>10K Seed</span>
              <span>100K Growth</span>
              <span>250K Scale</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
            <span className="text-[11px] font-bold text-[var(--color-text-primary)] block">
              Core Architectural Advantage:
            </span>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              By generating NACHA files directly and storing the double-entry general ledger in PostgreSQL Aurora, your cost scales sublinearly with transaction volume rather than handing over 20¢ on every batch.
            </p>
          </div>
        </div>

        {/* Cost Matrix & Comparison Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Cards Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-1.5">
              <span className="text-xs text-[var(--color-text-muted)] font-mono block">
                Self-Hosted AWS Infrastructure
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ${totalSelfHosted.toLocaleString()}<span className="text-xs text-[var(--color-text-muted)] font-normal">/mo</span>
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] block">
                AWS Aurora Serverless + ECS Fargate
              </span>
            </div>

            <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-1.5">
              <span className="text-xs text-[var(--color-text-muted)] font-mono block">
                {currentManaged.name} Markup
              </span>
              <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                ${totalManaged.toLocaleString()}<span className="text-xs text-[var(--color-text-muted)] font-normal">/mo</span>
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] block">
                Base subscription + per-transaction fee
              </span>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-2 text-xs font-mono">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
              Self-Hosted AWS Monthly Cost Breakdown
            </h4>

            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Database className="h-3.5 w-3.5 text-indigo-500" />
                AWS Aurora PostgreSQL 16 Serverless v2
              </span>
              <span className="font-bold text-[var(--color-text-primary)]">$48.00 / mo</span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Server className="h-3.5 w-3.5 text-indigo-500" />
                AWS ECS Fargate Task Cluster (2-8 Auto-Scaling)
              </span>
              <span className="font-bold text-[var(--color-text-primary)]">$32.00 / mo</span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1.5">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                AWS SQS FIFO Queues &amp; CloudWatch Alarms
              </span>
              <span className="font-bold text-[var(--color-text-primary)]">$4.50 / mo</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Automated AI Compliance &amp; Anomaly Auditing
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">$14.00 / mo</span>
            </div>
          </div>

          {/* Bottom Net ROI Banner */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              <span className="font-bold">Total Operating Margin Benefit:</span>
              <span>{savingsPct}% cost reduction</span>
            </div>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300">
              Save ${(totalManaged - totalSelfHosted).toLocaleString()} / mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
