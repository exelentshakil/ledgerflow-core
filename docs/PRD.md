# Product Requirements Document (PRD)
## LedgerFlow Core • Production Payments & General Ledger Architecture

**Target Role**: Senior Full-Stack Engineer (Fintech, React/TypeScript, Node.js/TypeScript, PostgreSQL, AWS)  
**Client Engineering Sponsor**: Alexander (Forest Hills, NY • EST Hours)  
**Lead Systems Architect**: Shakil Ahmed (BarakahSoft LLC)  
**Live Prototype URL**: [https://ledgerflow-core.vercel.app](https://ledgerflow-core.vercel.app)  
**Code Repository**: `exelentshakil/ledgerflow-core`  

---

### 1. Executive Summary & Problem Context
Modern fintech platforms processing high-volume transactions face three foundational vulnerabilities:
1. **Double-Debit Replay Attacks**: Network timeouts and client retries causing duplicate settlement debits when endpoints lack distributed atomic idempotency locks.
2. **Ledger Discrepancies & Audit Failures**: Single-entry account updates causing floating money or unbalanced transactions under concurrent execution.
3. **Database Performance Degeneracy**: Multi-million row transaction tables grinding to a halt with sequential scans when queries lack composite B-Tree indexes and covering `INCLUDE` clauses.

**LedgerFlow Core** demonstrates a hardened, production-ready solution to these challenges:
- **Distributed Idempotency Engine**: UUIDv4 keys cached with atomic locks (`SET key NX EX 86400`), guaranteeing identical cached responses and zero duplicate debits upon replay.
- **Strict Double-Entry General Ledger**: Mathematical invariant where every transaction generates balanced debit and credit entries ($\sum\text{Debits} = \sum\text{Credits}$) across operating, clearing, and settlement accounts.
- **NACHA Fixed-Width 94-Character Generator**: FedACH-compliant batch compilation covering Record Types 1 (File Header), 5 (Batch Header), 6 (Entry Detail for PPD, CCD, WEB), 8 (Batch Control), and 9 (File Control) with automated routing checksum verification.
- **PostgreSQL 16 Performance Optimization**: Execution plan acceleration via composite B-Trees (`account_id, created_at DESC`) with `INCLUDE` clauses, slashing execution latency from 142.8ms to 1.4ms (98.9% faster) and eliminating disk reads.
- **AWS ECS Fargate & SQS Fleet**: Event-driven decoupled queues with autoscaling container tasks, exponential backoff retries with full jitter, and Dead-Letter Queue (DLQ) poison-pill isolation.

---

### 2. Architecture & Component Decomposition
```
[ Client Browser / Webhook Client ]
                │
                ▼ (HTTPS / JSON + Idempotency-Key Header)
[ Next.js 15 App Router / Node.js API Gateway ]
        │                               │
        ▼ (Atomic UUIDv4 Lock)          ▼ (Inline LLM Firewall)
[ Redis 7 Distributed Cache ]    [ Claude / GPT-4o-mini Audit ]
        │                               │
        ▼ (Strict Invariant Check)      ▼ (Sanitized Payload)
[ Double-Entry Ledger Engine ] ──► [ FedACH 94-Char NACHA Engine ]
        │                               │
        ▼ (ACID Transaction)            ▼ (SQS FIFO Queue)
[ PostgreSQL 16 Aurora Cluster ] ◄── [ AWS ECS Fargate Worker Fleet ]
  (B-Tree + INCLUDE Indexes)         (Exponential Backoff + DLQ)
```

---

### 3. Core Technical Invariants & Guardrails

#### 3.1 Distributed Idempotency & Replay Defense
- **Requirement**: Any HTTP POST to `/api/payments/process` carrying an identical `Idempotency-Key` header within 24 hours must return the exact cached ledger state without executing any secondary database mutations.
- **Verification**: Tested in the interactive console via the "Test Replay Attack" button. Second execution returns status `DUPLICATE_INTERCEPTED` in sub-10ms with zero ledger variance.

#### 3.2 Double-Entry Accounting Equation
- **Requirement**: Every financial movement must balance to zero variance:
  $$\sum \text{Debits} - \sum \text{Credits} = \$0.00$$
- **Schema Constraints**:
  - `accounts`: UUID primary key, currency, checked balance.
  - `transactions`: Unique idempotency key, SEC code (PPD/CCD/WEB), amount in cents.
  - `ledger_entries`: Foreign key references with `ON DELETE RESTRICT`, entry type (`DEBIT` or `CREDIT`), positive integer `amount_cents`.

#### 3.3 FedACH NACHA 94-Character Fixed-Width Specification
- Every record must measure exactly 94 characters, adhering to NACHA Rule 5.1:
  - **Type 1 (File Header)**: Priority code, immediate destination/origin, file creation date/time, format code.
  - **Type 5 (Company/Batch Header)**: Service class code (200), standard entry class (PPD/CCD/WEB), effective entry date.
  - **Type 6 (Entry Detail)**: Transaction code (27 for debit, 22 for credit), receiving DFI routing (8 digits + 1 check digit), account number (17 chars), amount (10 digits in cents), identification number (15 chars), individual/company name (22 chars).
  - **Type 8 (Batch Control)**: Entry/Addenda count, entry hash, total debit/credit dollar sums.
  - **Type 9 (File Control)**: Batch count, block count, total file debits/credits.

#### 3.4 PostgreSQL 16 EXPLAIN Tuning & Zero-Downtime Indexing
- **Unindexed Baseline**: `Parallel Seq Scan on ledger_entries (cost=0.00..184520.10, actual time=142.8ms, buffers shared hit=8420 read=14200)`.
- **Composite B-Tree Optimized**: `Index Scan using idx_ledger_account_created (cost=0.43..8.45, actual time=1.42ms, buffers shared hit=18 read=0)`.
- **Zero-Downtime Migration**: Index creation executed with `CREATE INDEX CONCURRENTLY` to avoid acquiring `AccessExclusiveLock` on active transaction tables.

#### 3.5 AWS ECS Fargate & SQS Worker Fleet
- **Worker Concurrency**: Auto-scaled from 2 to 32 container tasks based on queue depth.
- **Retry Jitter Formula**: $t = \text{random}(0, \min(\text{max\_backoff}, \text{base} \times 2^{\text{attempt}}))$.
- **Dead-Letter Queue**: Malformed payloads quarantined to `transactions-dlq.fifo` after `maxReceiveCount=3` to prevent head-of-line blocking.

---

### 4. 30-Day Milestone Execution Schedule (Staff Augmentation / 25–35 Hrs/Wk)

| Milestone | Deliverables | Timeline | Hours | Cost (@ $80/hr) |
|---|---|---|---|---|
| **Phase 0** | **Live Prototype Cockpit (ACH + Ledger + Postgres Tuning)** | **Live Now** | **Included** | **$0.00** |
| **Milestone 1** | Codebase Audit, Schema Ingestion & Vitest CI/CD Harness | Week 1 | 25 Hrs | $2,000.00 |
| **Milestone 2** | ACH Engine & NACHA 94-Char Batch Compilation | Week 2 | 25 Hrs | $2,000.00 |
| **Milestone 3** | Double-Entry General Ledger & Distributed Idempotency Locks | Week 3 | 25 Hrs | $2,000.00 |
| **Milestone 4** | PostgreSQL 16 EXPLAIN Query Tuning & Zero-Downtime Migrations | Week 4 | 25 Hrs | $2,000.00 |
| **Milestone 5** | AWS ECS Fargate & SQS Worker Fleet Infrastructure & Runbooks | Week 5 | 25 Hrs | $2,000.00 |
| **Total** | **End-to-End Senior Full-Stack Engineering Engagement** | **Ongoing** | **125 Hrs** | **$80.00/hr Capped** |

---

### 5. Technical Validation & Test Suite
- **Vitest Suite**: `tests/idempotency_invariant.test.ts`
  - Validates zero duplicate debits on concurrent replay attacks.
  - Validates $\sum\text{Debits} = \sum\text{Credits}$ balance equation.
- **NACHA Validation**: 94-character fixed-width string length assertion on all generated batch lines.
- **Database Validation**: EXPLAIN (ANALYZE, BUFFERS) automated test asserting execution time $< 5.0\text{ms}$.
