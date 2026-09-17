'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  Layers,
  Terminal,
  Database,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SQL_SCHEMA = `-- Double-Entry General Ledger Core Schema (PostgreSQL 16)
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

-- Zero-Downtime Covering Index for Sub-Millisecond Balance Queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ledger_account_created
ON ledger_entries (account_id, created_at DESC)
INCLUDE (amount_cents, entry_type);`;

const NACHA_SERVICE = `// TypeScript NACHA 94-Character Fixed-Width ACH Batch Generator
export interface NachaEntryDetail {
  transactionCode: '27' | '22'; // 27 = Automated Debit, 22 = Automated Credit
  receivingRouting: string; // 8 digits
  checkDigit: string; // 1 digit
  receivingAccount: string; // up to 17 chars
  amountCents: number; // 10 chars padded
  individualId: string; // 15 chars
  individualName: string; // 22 chars
}

export function generateEntryDetailRecord(entry: NachaEntryDetail, traceNumber: number): string {
  const padR = (str: string, len: number) => (str || '').padEnd(len, ' ').slice(0, len);
  const padL0 = (val: string | number, len: number) => String(val || '').padStart(len, '0').slice(-len);

  const recType = '6';
  const txCode = entry.transactionCode;
  const routing = padL0(entry.receivingRouting, 8);
  const chk = entry.checkDigit;
  const acct = padR(entry.receivingAccount, 17);
  const amt = padL0(entry.amountCents, 10);
  const id = padR(entry.individualId, 15);
  const name = padR(entry.individualName.toUpperCase(), 22);
  const discretionary = '  ';
  const addendaRecordIndicator = '0';
  const trace = padL0(traceNumber, 15);

  const line = \`\${recType}\${txCode}\${routing}\${chk}\${acct}\${amt}\${id}\${name}\${discretionary}\${addendaRecordIndicator}\${trace}\`;
  if (line.length !== 94) {
    throw new Error(\`NACHA Entry Detail must be exactly 94 characters, got \${line.length}\`);
  }
  return line;
}`;

const TERRAFORM_ECS = `# AWS ECS Fargate & SQS Worker Fleet Module (main.tf)
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

resource "aws_sqs_queue" "transactions_dlq" {
  name                      = "fintech-ach-transactions-dlq.fifo"
  fifo_queue                = true
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue" "transactions_queue" {
  name                        = "fintech-ach-transactions.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.transactions_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_ecs_task_definition" "payment_worker" {
  family                   = "ledgerflow-payment-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "worker"
    image     = "\${aws_ecr_repository.repo.repository_url}:latest"
    essential = true
    environment = [
      { name = "SQS_QUEUE_URL", value = aws_sqs_queue.transactions_queue.url },
      { name = "NODE_ENV", value = "production" }
    ]
  }])
}`;

const VITEST_TESTS = `// Vitest Suite: Idempotency Replay Attack & Double-Entry Invariant
import { describe, it, expect } from 'vitest';
import { processFintechPayment, IDEMPOTENCY_CACHE } from '@/lib/fintech';

describe('LedgerFlow Core: Fintech & Idempotency Invariants', () => {
  it('guarantees identical response and zero duplicate debits on replay attack', async () => {
    const key = 'test_idemp_' + Date.now();
    const req = {
      idempotencyKey: key,
      amount: 500.0,
      sourceAccount: '1029384756',
      sourceRouting: '121000358',
      destinationAccount: '9876543210',
      destinationRouting: '091000019',
      secCode: 'CCD' as const,
      memo: 'Concurrent settlement retry',
    };

    // First legitimate execution
    const firstResult = await processFintechPayment(req);
    expect(firstResult.status).toBe('POSTED');
    expect(firstResult.isDuplicate).toBe(false);

    // Second execution simulating network timeout retry
    const replayResult = await processFintechPayment(req);
    expect(replayResult.status).toBe('DUPLICATE_INTERCEPTED');
    expect(replayResult.isDuplicate).toBe(true);
    expect(replayResult.transactionId).toBe(firstResult.transactionId);
  });

  it('verifies double-entry ledger equation (Sum(Debits) === Sum(Credits))', async () => {
    const res = await processFintechPayment({
      idempotencyKey: 'sum_invariant_' + Date.now(),
      amount: 1250.75,
      sourceAccount: '1111111111',
      sourceRouting: '121000358',
      destinationAccount: '2222222222',
      destinationRouting: '091000019',
      secCode: 'PPD',
      memo: 'Invariant verification',
    });

    const debits = res.ledgerEntries.filter(e => e.entryType === 'DEBIT').reduce((acc, e) => acc + e.amountCents, 0);
    const credits = res.ledgerEntries.filter(e => e.entryType === 'CREDIT').reduce((acc, e) => acc + e.amountCents, 0);

    expect(debits).toBe(credits);
    expect(debits).toBe(125075);
  });
});`;

export function BlueprintExporter() {
  const [selectedTab, setSelectedTab] = useState<'sql' | 'nacha' | 'terraform' | 'tests'>('sql');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (selectedTab) {
      case 'sql':
        return { code: SQL_SCHEMA, filename: '001_double_entry_ledger.sql' };
      case 'nacha':
        return { code: NACHA_SERVICE, filename: 'nachaService.ts' };
      case 'terraform':
        return { code: TERRAFORM_ECS, filename: 'ecs_fargate_sqs.tf' };
      case 'tests':
        return { code: VITEST_TESTS, filename: 'idempotency_invariant.test.ts' };
    }
  };

  const active = getActiveCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([active.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = active.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 whitespace-nowrap shrink-0">
              <FileCode className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Production Code Blueprints
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Turnkey TypeScript, SQL, Terraform &amp; Test Assets
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            Architectural Code Export &amp; Infrastructure Blueprints
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Immediate production-grade building blocks. 100% modular TypeScript, PostgreSQL 16 DDL, AWS Fargate Terraform, and test suites ready for your codebase.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-1 text-xs font-medium">
          <button
            onClick={() => setSelectedTab('sql')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              selectedTab === 'sql'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Postgres DDL
          </button>
          <button
            onClick={() => setSelectedTab('nacha')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              selectedTab === 'nacha'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            NACHA Engine
          </button>
          <button
            onClick={() => setSelectedTab('terraform')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              selectedTab === 'terraform'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            AWS Terraform
          </button>
          <button
            onClick={() => setSelectedTab('tests')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              selectedTab === 'tests'
                ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Vitest Suite
          </button>
        </div>
      </div>

      {/* Code Display & Download Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        {/* Sub-bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              {active.filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap shrink-0"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Download File</span>
            </Button>
          </div>
        </div>

        {/* Code Body */}
        <div className="p-4 max-h-80 overflow-y-auto font-mono text-[11px] text-emerald-400 leading-relaxed">
          <pre>{active.code}</pre>
        </div>
      </div>
    </div>
  );
}
