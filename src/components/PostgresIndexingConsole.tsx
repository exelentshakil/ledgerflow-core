'use client';

import React, { useState } from 'react';
import {
  Database,
  Zap,
  Clock,
  HardDrive,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PostgresIndexingConsole() {
  const [activeTab, setActiveTab] = useState<'explain' | 'schema' | 'migration'>('explain');
  const [hasIndex, setHasIndex] = useState(true);
  const [rowCount, setRowCount] = useState<'1M' | '5M' | '25M'>('5M');
  const [isRunning, setIsRunning] = useState(false);

  // Simulated metrics based on mode
  const metrics = hasIndex
    ? {
        planType: 'Index Scan using idx_ledger_account_created',
        cost: '0.43..8.45 rows=25 width=64',
        execTimeMs: rowCount === '1M' ? 0.84 : rowCount === '5M' ? 1.42 : 2.85,
        buffersSharedHit: 18,
        buffersRead: 0,
        cacheHitRatio: '100.0%',
        speedup: '98.9%',
      }
    : {
        planType: 'Seq Scan on ledger_entries (Parallel Seq Scan with 4 workers)',
        cost: '0.00..184520.10 rows=25 width=64',
        execTimeMs: rowCount === '1M' ? 38.6 : rowCount === '5M' ? 142.8 : 420.5,
        buffersSharedHit: 8420,
        buffersRead: 14200,
        cacheHitRatio: '37.2%',
        speedup: '0.0% (Baseline)',
      };

  const handleRunExplain = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
              <Database className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              PostgreSQL 16 High-Throughput Indexing &amp; Query Tuning
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Analyze execution plans, composite B-Trees, and zero-downtime concurrent migrations for high-velocity payment ledgers.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-1">
          <button
            onClick={() => setActiveTab('explain')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'explain'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            EXPLAIN (ANALYZE)
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            SQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('migration')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'migration'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Zero-Downtime Migration
          </button>
        </div>
      </div>

      {activeTab === 'explain' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-semibold text-[var(--color-text-secondary)]">
                Index Strategy
              </label>
              <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
                <button
                  onClick={() => setHasIndex(true)}
                  className={`flex-1 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    hasIndex ? 'bg-indigo-600 text-white font-bold' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  Composite B-Tree
                </button>
                <button
                  onClick={() => setHasIndex(false)}
                  className={`flex-1 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    !hasIndex ? 'bg-rose-600 text-white font-bold' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  Unindexed (Seq Scan)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-semibold text-[var(--color-text-secondary)]">
                Table Scale
              </label>
              <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
                {(['1M', '5M', '25M'] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => setRowCount(count)}
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      rowCount === count ? 'bg-slate-800 text-white font-bold dark:bg-slate-200 dark:text-slate-900' : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {count} Rows
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-semibold text-[var(--color-text-secondary)]">
                Target Query Filter
              </label>
              <div className="py-1 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs text-[var(--color-text-primary)] truncate">
                WHERE acct = &apos;109283&apos; ORDER BY created DESC
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleRunExplain}
                disabled={isRunning}
                className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-9"
              >
                <Play className={`h-3.5 w-3.5 mr-1 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Executing EXPLAIN...' : 'Run EXPLAIN ANALYZE'}</span>
              </Button>
            </div>
          </div>

          {/* Performance Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Execution Time</span>
                </span>
                <span className={`text-[11px] font-mono font-bold ${hasIndex ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {hasIndex ? '98.9% Faster' : 'Degraded'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
                {metrics.execTimeMs} <span className="text-sm font-normal text-[var(--color-text-muted)]">ms</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {hasIndex ? 'Target SLA < 5ms exceeded' : 'Severe bottleneck under concurrency'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Buffer Cache Hits</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-600">
                  {metrics.cacheHitRatio}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
                {metrics.buffersSharedHit.toLocaleString()} <span className="text-sm font-normal text-[var(--color-text-muted)]">pages</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {hasIndex ? 'Zero disk IO required' : `${metrics.buffersRead} buffer pages fetched from disk`}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Plan Cost Range</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Postgres Cost Units
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-[var(--color-text-primary)] truncate">
                {metrics.cost.split(' ')[0]}
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                Estimated planner optimizer cost
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                  <span>CPU &amp; IO Latency Delta</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600">
                  {metrics.speedup}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {hasIndex ? '100x' : '1x'} <span className="text-sm font-normal text-[var(--color-text-muted)]">throughput</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {hasIndex ? 'Index Only Scan with covering INCLUDE' : 'Multi-worker thread exhaustion'}
              </p>
            </div>
          </div>

          {/* Raw EXPLAIN Output Terminal */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span>EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS)</span>
              <span>PostgreSQL 16.2 on x86_64-pc-linux-gnu</span>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
              {hasIndex ? (
`Limit (cost=0.43..8.45 rows=25 width=64) (actual time=0.042..${metrics.execTimeMs} rows=25 loops=1)
  Output: entry_id, account_id, amount_cents, entry_type, created_at, status
  Buffers: shared hit=${metrics.buffersSharedHit}
  ->  Index Scan using idx_ledger_account_created on public.ledger_entries (cost=0.43..2418.90 rows=7412 width=64) (actual time=0.038..${metrics.execTimeMs} rows=25 loops=1)
        Output: entry_id, account_id, amount_cents, entry_type, created_at, status
        Index Cond: (ledger_entries.account_id = '1092837465'::uuid)
        Buffers: shared hit=${metrics.buffersSharedHit}
Planning Time: 0.124 ms
Execution Time: ${metrics.execTimeMs} ms`
              ) : (
`Limit (cost=184520.10..184520.16 rows=25 width=64) (actual time=${metrics.execTimeMs - 2.1}..${metrics.execTimeMs} rows=25 loops=1)
  Output: entry_id, account_id, amount_cents, entry_type, created_at, status
  Buffers: shared hit=${metrics.buffersSharedHit} read=${metrics.buffersRead}
  ->  Sort (cost=184520.10..184538.63 rows=7412 width=64) (actual time=${metrics.execTimeMs - 2.1}..${metrics.execTimeMs} rows=25 loops=1)
        Output: entry_id, account_id, amount_cents, entry_type, created_at, status
        Sort Key: ledger_entries.created_at DESC
        Sort Method: top-N heapsort  Memory: 29kB
        Buffers: shared hit=${metrics.buffersSharedHit} read=${metrics.buffersRead}
        ->  Gather (cost=1000.00..184230.40 rows=7412 width=64) (actual time=1.840..${metrics.execTimeMs - 5.0} rows=7412 loops=1)
              Workers Planned: 4
              Workers Launched: 4
              Buffers: shared hit=${metrics.buffersSharedHit} read=${metrics.buffersRead}
              ->  Parallel Seq Scan on public.ledger_entries (cost=0.00..182489.20 rows=1853 width=64) (actual time=0.912..${metrics.execTimeMs - 12.0} rows=1853 loops=4)
                    Filter: (ledger_entries.account_id = '1092837465'::uuid)
                    Rows Removed by Filter: 1248147
Planning Time: 0.280 ms
Execution Time: ${metrics.execTimeMs} ms`
              )}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Production General Ledger Schema (PostgreSQL 16)</span>
            <span className="font-mono text-[11px] text-indigo-600">ACID Compliant + Check Constraints</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-slate-300">
            <pre className="text-[11px] leading-relaxed">
{`-- Double-Entry Ledger Core DDL with Strict Foreign Keys & Invariants
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_number VARCHAR(32) NOT NULL UNIQUE,
    routing_number VARCHAR(9) NOT NULL,
    account_type VARCHAR(16) NOT NULL CHECK (account_type IN ('CHECKING', 'SAVINGS', 'ESCROW', 'CLEARING', 'SETTLEMENT')),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    balance_cents BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key VARCHAR(64) NOT NULL UNIQUE,
    sec_code VARCHAR(3) NOT NULL CHECK (sec_code IN ('PPD', 'CCD', 'WEB')),
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    status VARCHAR(24) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'POSTED', 'FAILED', 'REVERSED')),
    memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    entry_type VARCHAR(6) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- High-Velocity Covering B-Tree Index for Sub-Millisecond Balance Calculation
CREATE INDEX idx_ledger_account_created 
ON ledger_entries (account_id, created_at DESC)
INCLUDE (amount_cents, entry_type);`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'migration' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Zero-Downtime High-Traffic Schema Migration Pattern</span>
            <span className="font-mono text-[11px] text-emerald-600">Zero Table Locks Guaranteed</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-slate-300">
            <pre className="text-[11px] leading-relaxed">
{`-- Step 1: Create index CONCURRENTLY without acquiring AccessExclusiveLock
-- (Allows live write transactions to continue during multi-gigabyte index build)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ledger_account_created_v2
ON ledger_entries (account_id, created_at DESC)
INCLUDE (amount_cents, entry_type);

-- Step 2: Validate index completeness in case of intermittent failure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_index i ON m.indexrelid = c.oid
        WHERE c.relname = 'idx_ledger_account_created_v2' AND i.indisvalid = true
    ) THEN
        RAISE EXCEPTION 'Concurrent index generation was marked INVALID by PostgreSQL engine';
    END IF;
END $$;

-- Step 3: Atomic hot-swap index names
BEGIN;
DROP INDEX CONCURRENTLY IF EXISTS idx_ledger_account_created;
ALTER INDEX idx_ledger_account_created_v2 RENAME TO idx_ledger_account_created;
COMMIT;`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
