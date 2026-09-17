'use client';

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  CreditCard,
  Database,
  Cloud,
  Terminal,
  Activity,
  CheckCircle2,
  Layers,
  Code2,
  Lock,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl">
        {/* Balanced 3-Pillar Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
          
          {/* Pillar 1: Platform & Systems Mission */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Fintech Systems Platform
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-xs shrink-0">
                    LF
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="text-base font-extrabold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap">
                      LedgerFlow Core
                    </span>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                      v2.4 Production Engine
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Production-grade payment infrastructure and double-entry general ledger engine. Handles NACHA 94-char ACH batch generation, UUIDv4 replay defense, and sub-millisecond PostgreSQL query tuning.
                </p>
              </div>

              {/* Verified Platform Status Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap min-w-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="text-[11px] font-semibold truncate">Ledger Variance: $0.00</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                  100% Codebase Ownership
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Systems Architecture & Technical Specs */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Systems Architecture
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-[11px] font-mono text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Terminal className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">React + Node TS</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Database className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">PostgreSQL 16 B-Tree</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Cloud className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">AWS ECS Fargate</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">AWS SQS FIFO + DLQ</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <CreditCard className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">FedACH 94-Char</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Lock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">UUIDv4 Idempotency</span>
                  </div>
                </div>
              </div>

              {/* Compliance & SLA Verification Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[11px] text-[var(--color-text-muted)] font-medium truncate">
                  NACHA Operating Rules &amp; NIST AI RMF
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                  99.999% Durability
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Principal Systems Architect Verification */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Principal Systems Architect
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3 text-xs">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src="/headshot.jpeg"
                      alt="Shakil Ahmed - Principal Systems Architect"
                      className="h-11 w-11 rounded-xl object-cover ring-2 ring-indigo-500/30 border border-[var(--color-border)] shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs" title="Verified Architect">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] text-sm">
                      <span className="truncate">Shakil Ahmed</span>
                      <span className="inline-flex items-center rounded bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                        Lead
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-mono truncate">
                      Senior Systems &amp; Fintech Architect
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Former Lead Systems Engineer at Legiit ($1M ARR Command Center, 1M+ transactions). 12+ Years Full-Stack &amp; Autonomous Systems Delivery.
                </p>
              </div>

              {/* Certified Architect Verification Bar */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-1.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span className="whitespace-nowrap shrink-0 text-[11px] font-semibold">Securiti Certified</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                  <ShieldCheck className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Verified Partner</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] font-mono gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-center md:text-left">
            <span>© {new Date().getFullYear()} LedgerFlow Core</span>
            <span className="text-[var(--color-border)] select-none">•</span>
            <span>High-Throughput Payment &amp; General Ledger Architecture</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a href="#briefing" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Briefing
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#metrics" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Architecture
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#payments" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              ACH Engine
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#postgres" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              PostgreSQL Tuning
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#queues" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              ECS Queues
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">•</span>
            <a href="#blueprints" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Blueprints
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
