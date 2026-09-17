'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Database,
  CheckCircle2,
  ShieldAlert,
  Server,
  Code2,
  ArrowUpRight,
} from 'lucide-react';

const ACH_SETTLEMENT_DATA = [
  { time: '06:00', volume: 120, amountK: 450 },
  { time: '09:00', volume: 840, amountK: 2890 },
  { time: '12:00', volume: 1680, amountK: 5400 },
  { time: '15:00', volume: 2200, amountK: 7850 },
  { time: '18:00', volume: 1450, amountK: 4200 },
  { time: '21:00', volume: 620, amountK: 1950 },
];

const POSTGRES_LATENCY_DATA = [
  { query: 'Account Ledger History', unindexed: 142.8, indexed: 1.4 },
  { query: 'Reconciliation Match Scan', unindexed: 215.2, indexed: 2.1 },
  { query: 'Idempotency Lookup', unindexed: 89.4, indexed: 0.8 },
  { query: 'Daily Balance Aggregation', unindexed: 340.1, indexed: 3.5 },
];

const RECONCILIATION_PIE_DATA = [
  { name: 'Matched Perfectly', value: 99.82, color: '#10b981' },
  { name: 'Pending Settlement', value: 0.14, color: '#6366f1' },
  { name: 'Exception / Flagged', value: 0.04, color: '#f43f5e' },
];

const IDEMPOTENCY_BLOCKS_DATA = [
  { day: 'Mon', attempts: 18, blocked: 18 },
  { day: 'Tue', attempts: 34, blocked: 34 },
  { day: 'Wed', attempts: 27, blocked: 27 },
  { day: 'Thu', attempts: 42, blocked: 42 },
  { day: 'Fri', attempts: 58, blocked: 58 },
  { day: 'Sat', attempts: 12, blocked: 12 },
  { day: 'Sun', attempts: 9, blocked: 9 },
];

const ECS_TASK_DATA = [
  { task: 'Task 01', cpuPercent: 38, memMb: 420 },
  { task: 'Task 02', cpuPercent: 44, memMb: 450 },
  { task: 'Task 03', cpuPercent: 32, memMb: 390 },
  { task: 'Task 04', cpuPercent: 52, memMb: 480 },
  { task: 'Task 05', cpuPercent: 29, memMb: 370 },
  { task: 'Task 06', cpuPercent: 48, memMb: 460 },
];

const TEST_COVERAGE_DATA = [
  { category: 'Unit Tests', count: 184, passRate: 100 },
  { category: 'Integration (Postgres)', count: 72, passRate: 100 },
  { category: 'E2E (ACH Ledger)', count: 32, passRate: 100 },
  { category: 'Idempotency Replay', count: 24, passRate: 100 },
];

export function BentoGrid() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Production Telemetry &amp; System Architecture
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Live metrics across transaction throughput, PostgreSQL indexing, idempotency defenses, and AWS Fargate workers.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Telemetry Live: 99.99% Uptime
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: ACH Settlement Volume */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                ACH Transaction Throughput
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                $22.7M / Day
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Peak NACHA Batch Window (T+1 Settlement)
            </p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACH_SETTLEMENT_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="amountK" stroke="#6366f1" strokeWidth={2} fill="url(#colorAch)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: PostgreSQL Query Latency Tuning */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                PostgreSQL EXPLAIN Tuning
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                99.1% Faster
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Sequential Scan vs Composite B-Tree Index
            </p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={POSTGRES_LATENCY_DATA}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-text-muted)" fontSize={10} unit="ms" />
                <YAxis dataKey="query" type="category" stroke="var(--color-text-muted)" fontSize={9} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="unindexed" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Seq Scan (ms)" />
                <Bar dataKey="indexed" fill="#10b981" radius={[0, 4, 4, 0]} name="Index Scan (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Automated Ledger Reconciliation */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                Ledger Reconciliation
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                99.82% Auto-Match
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Bank Feed vs Internal Ledger Balances
            </p>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RECONCILIATION_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {RECONCILIATION_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Idempotency Key Replay Defenses */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                Idempotency Defense
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                0 Double Debits
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Duplicate HTTP Request Interceptions (UUIDv4)
            </p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={IDEMPOTENCY_BLOCKS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="blocked" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 5: AWS ECS Fargate Fleet Allocation */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                AWS ECS Fargate Cluster
              </span>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
                6 Tasks Active
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Asynchronous Payment Queue Worker Nodes
            </p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ECS_TASK_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="task" stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="cpuPercent" fill="#06b6d4" radius={[4, 4, 0, 0]} name="CPU %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 6: CI/CD Test Suite Coverage */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
                Test Suite &amp; Regression Gates
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                312 Tests Passing
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              Unit, PostgreSQL Migrations &amp; E2E Idempotency
            </p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEST_COVERAGE_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="category" stroke="var(--color-text-muted)" fontSize={9} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Test Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
