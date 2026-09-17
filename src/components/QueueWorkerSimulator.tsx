'use client';

import React, { useState, useEffect } from 'react';
import {
  Server,
  Cloud,
  Layers,
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QueueWorkerSimulator() {
  const [fargateTasks, setFargateTasks] = useState(8);
  const [sqsDepth, setSqsDepth] = useState(1420);
  const [tpsRate, setTpsRate] = useState(120);
  const [dlqCount, setDlqCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(true);
  const [simulatedPoisonPill, setSimulatedPoisonPill] = useState(false);

  // Dynamic simulation loop
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setSqsDepth((prev) => {
        // Inflow vs Outflow based on fargate tasks
        const inflow = Math.floor(Math.random() * (tpsRate / 8)) + 10;
        const processingCapacity = fargateTasks * 18;
        const nextDepth = Math.max(12, prev + inflow - processingCapacity);
        return nextDepth;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, fargateTasks, tpsRate]);

  const triggerPoisonPill = () => {
    setSimulatedPoisonPill(true);
    setDlqCount((prev) => prev + 1);
    setTimeout(() => setSimulatedPoisonPill(false), 3000);
  };

  const drainDlq = () => {
    setDlqCount(0);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
              <Cloud className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              AWS ECS Fargate &amp; SQS Asynchronous Worker Fleet
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Decoupled event-driven transaction queues with auto-scaling container tasks, exponential backoff retries with full jitter, and DLQ containment.
          </p>
        </div>

        {/* Live Simulation Status */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsProcessing(!isProcessing)}
            className="text-xs h-8"
          >
            {isProcessing ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            <span>{isProcessing ? 'Pause Simulation' : 'Resume'}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={triggerPoisonPill}
            className="text-xs h-8 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
            <span>Inject Poison Pill</span>
          </Button>
        </div>
      </div>

      {/* Control Sliders & Real-Time Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fargate Tasks Slider */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <Server className="h-3.5 w-3.5 text-indigo-600" />
              <span>ECS Fargate Tasks</span>
            </span>
            <span className="font-mono font-bold text-indigo-600">{fargateTasks} Tasks</span>
          </div>
          <input
            type="range"
            min={2}
            max={32}
            step={2}
            value={fargateTasks}
            onChange={(e) => setFargateTasks(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg dark:bg-slate-700"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
            <span>2 (Min)</span>
            <span>Autoscale Cap: 32</span>
          </div>
        </div>

        {/* Metric 2: SQS Queue Depth */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>SQS Visible Messages</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
            {sqsDepth.toLocaleString()}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Drain capacity: ~{(fargateTasks * 18 * 60).toLocaleString()} tx/min
          </p>
        </div>

        {/* Metric 3: Target Inflow Rate */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <Zap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Inflow TPS Velocity</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{tpsRate} TPS</span>
          </div>
          <input
            type="range"
            min={30}
            max={400}
            step={10}
            value={tpsRate}
            onChange={(e) => setTpsRate(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg dark:bg-slate-700"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
            <span>Low (30)</span>
            <span>Peak Surge (400)</span>
          </div>
        </div>

        {/* Metric 4: Dead-Letter Queue (DLQ) */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>DLQ Poison Messages</span>
            </span>
            {dlqCount > 0 && (
              <button
                onClick={drainDlq}
                className="text-[10px] text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>Replay</span>
              </button>
            )}
          </div>
          <div className={`text-2xl font-bold font-mono ${dlqCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {dlqCount}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            maxReceiveCount=3 with exponential jitter
          </p>
        </div>
      </div>

      {/* Poison Pill Alert Banner */}
      {simulatedPoisonPill && (
        <div className="p-3 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 flex items-start gap-2.5 text-xs animate-fadeIn">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Malformed Payload Intercepted &amp; Quarantined</p>
            <p className="text-[11px] leading-relaxed">
              Invalid FedACH routing checksum detected on task #4. After 3 retries with full jitter, message diverted to `fintech-ach-transactions-dlq` to prevent poison message head-of-line blocking.
            </p>
          </div>
        </div>
      )}

      {/* Fargate Container Grid & Architectural Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Fargate Worker Instances Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--color-text-primary)]">
              Active Fargate Tasks ({fargateTasks} Running)
            </span>
            <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
              Subnet: us-east-1a / us-east-1b (Private)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: fargateTasks }).map((_, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[var(--color-text-secondary)]">
                    task-{idx + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span>CPU:</span>
                    <span className="text-[var(--color-text-primary)] font-semibold">
                      {Math.floor(Math.random() * 25 + 15)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mem:</span>
                    <span className="text-[var(--color-text-primary)] font-semibold">
                      {Math.floor(Math.random() * 80 + 140)}MB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Retry with Full Jitter Formula & CloudFront/S3 Architecture (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3 text-xs">
            <h4 className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-600" />
              <span>Retry Strategy: Exponential Backoff + Full Jitter</span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              Prevents thundering herd stampedes against the PostgreSQL primary database during downstream banking gateway latency spikes.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 space-y-1">
              <div className="text-slate-400 text-[10px]">// AWS Standard Full Jitter Formula</div>
              <div>sleep = random(0, min(max_backoff, base * 2 ^ attempt))</div>
              <div className="text-slate-400 text-[10px] pt-1">// Attempt 1: 0..200ms | Attempt 2: 0..400ms | Attempt 3: 0..800ms</div>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Infrastructure Target:</span>
                <span className="font-mono font-bold text-[var(--color-text-primary)]">AWS ECS Fargate 1.4.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Static Artifacts:</span>
                <span className="font-mono font-bold text-[var(--color-text-primary)]">S3 Bucket + CloudFront CDN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
