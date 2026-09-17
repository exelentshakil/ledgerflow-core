'use client';

import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  Database,
  Layers,
  Code2,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewerTourProps {
  onNavigate: (sectionId: string) => void;
  onOpenChaosModal: () => void;
}

export function ReviewerTour({ onNavigate, onOpenChaosModal }: ReviewerTourProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header Badge & Title */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[var(--color-border)] pb-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
              Executive Architecture Briefing
            </span>
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              Senior Full-Stack • Fintech &amp; Payments
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            LedgerFlow Core • Payments &amp; PostgreSQL Engine
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Double-entry ledger invariants, NACHA 94-character ACH batch compilation, sub-2ms PostgreSQL indexing, and AWS ECS queue processing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChaosModal}
            className="text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <Flame className="h-3.5 w-3.5 mr-1 text-amber-500" />
            Chaos &amp; Bank Dropout
          </Button>
          <Button
            size="sm"
            onClick={() => onNavigate('payments')}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            Test Live ACH Engine
          </Button>
        </div>
      </div>

      {/* 4 High-Signal Evaluation Paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Path 1 */}
        <div
          onClick={() => onNavigate('payments')}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <CreditCard className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                PATH 01
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">
              ACH &amp; Payment Idempotency
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Live NACHA 94-character batch generation, double-entry bookkeeping, and replay attack defense via UUIDv4 locks.
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--color-border)] mt-3 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <span>Launch Engine</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Path 2 */}
        <div
          onClick={() => onNavigate('postgres')}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Database className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                PATH 02
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">
              PostgreSQL Indexing &amp; EXPLAIN
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              EXPLAIN (ANALYZE, BUFFERS) profiler cutting unindexed scan from 142ms down to 1.2ms via composite B-Trees.
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--color-border)] mt-3 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span>Inspect Query Plans</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Path 3 */}
        <div
          onClick={() => onNavigate('queues')}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                <Layers className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                PATH 03
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">
              AWS ECS Fargate &amp; SQS Queues
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Asynchronous transaction settlement workers, exponential backoff retries, and dead-letter queue (DLQ) monitors.
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--color-border)] mt-3 flex items-center justify-between text-xs font-medium text-cyan-600 dark:text-cyan-400">
            <span>Simulate Worker Queue</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Path 4 */}
        <div
          onClick={() => onNavigate('blueprints')}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 transition-all hover:border-indigo-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                PATH 04
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">
              Claude Code &amp; Blueprints
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Production-ready SQL migration schemas, TypeScript ACH generator, and Terraform AWS ECS task definitions.
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--color-border)] mt-3 flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-400">
            <span>Export Codebases</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Institutional SLA Trust Strip */}
      <div className="rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Verified Production Standards: 0.00% Double-Debit Risk • Sub-2ms PostgreSQL Queries • SOC 2 Ready</span>
        </div>
        <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-[11px]">
          <span>AWS ECS Fargate</span>
          <span>•</span>
          <span>PostgreSQL 16 Aurora</span>
          <span>•</span>
          <span>TypeScript / React / Node</span>
        </div>
      </div>
    </div>
  );
}
