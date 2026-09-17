# LedgerFlow Core • Enterprise Fintech & Payments Architecture Engine

> Production-grade double-entry general ledger, NACHA 94-character fixed-width ACH batch generation, sub-2ms PostgreSQL 16 query optimization, and AWS ECS Fargate queue worker processing.

[![Live Demo](https://img.shields.io/badge/Live_Demo-ledgerflow--core.vercel.app-635bff?style=for-the-badge&logo=vercel)](https://ledgerflow-core.vercel.app)
[![Architecture Brief](https://img.shields.io/badge/Architecture-1--Page_PDF-indigo?style=for-the-badge&logo=adobeacrobatreader)](docs/ARCHITECTURE_BRIEF.pdf)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Aurora-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

---

## 🏛️ System Architecture Overview

LedgerFlow Core addresses the four fundamental failure modes of modern high-volume payment infrastructure:

1. **Distributed Idempotency Defense**: Atomic Redis `SET key NX EX 86400` locks intercept network retries and duplicate submissions, re-returning cached results with zero secondary debits.
2. **Strict Double-Entry General Ledger Invariant**: Mathematical consistency where every transaction creates equal and opposite debit and credit entries (`Total Debits === Total Credits`) with zero floating cents.
3. **NACHA 94-Character Fixed-Width ACH Batch Generator**: Specification-compliant ACH batch compiler meeting NACHA Rule 5.1 across File Header (Record 1), Batch Header (Record 5, SEC codes PPD/CCD/WEB), Entry Detail (Record 6, transaction codes 27/22), Batch Control (Record 8), and File Control (Record 9) with FedACH routing checksum verification.
4. **PostgreSQL 16 Query Tuning**: Composite B-Tree covering indexes (`account_id, created_at DESC`) with `INCLUDE (amount_cents, entry_type)` clauses, eliminating disk IOPS and dropping query execution latency from **142.8ms down to 1.4ms (98.9% speedup)**.

---

## 🚀 Live Demo Cockpit

Test the live interactive cockpit at: **[https://ledgerflow-core.vercel.app](https://ledgerflow-core.vercel.app)**

Interactive modules:
- **Interactive ACH Payment Console**: Preset scenarios (Payroll $4.2k, B2B Settlement $18.4k, Web Checkout $89), live 94-character batch viewer, and instant replay attack simulation.
- **PostgreSQL 16 EXPLAIN (ANALYZE, BUFFERS) Profiler**: Direct visual comparison of sequential table scans vs composite covering index scans with live buffer metrics.
- **AWS ECS Fargate & SQS Simulator**: Dynamic worker concurrency scaling (2–32 tasks), live drain rate calculations, full jitter backoff math, and Dead-Letter Queue (DLQ) poison-pill isolation.
- **TCO ROI Calculator**: Comparing self-hosted AWS Aurora Serverless v2 + Fargate (~$98.50/mo) against commercial vendor markups (Modern Treasury / Stripe Treasury) saving $136K–$195K/year.
- **Codebase Blueprints**: Exportable production DDL schemas (`001_double_entry_ledger.sql`), TypeScript NACHA generator (`nachaService.ts`), and Terraform ECS task definitions (`ecs_fargate_sqs.tf`).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5 App Router, React 19, TypeScript, Tailwind CSS, Radix UI Primitives, Lucide Icons.
- **Backend / Compute**: Vercel Fluid Compute Serverless Functions, Node.js 22 LTS, Dual-Provider AI Fallback Chain (OpenAI `gpt-4o-mini` + Gemini `gemini-2.0-flash`).
- **Data & Invariants**: PostgreSQL 16 schema with `CREATE INDEX CONCURRENTLY` zero-downtime migrations, atomic Redis idempotency locks.
- **Cloud Target**: AWS ECS Fargate, AWS SQS FIFO Queues, Amazon Aurora Serverless v2 PostgreSQL.

---

## 📄 Documentation

- [1-Page Architecture Brief (PDF)](docs/ARCHITECTURE_BRIEF.pdf)
- [Technical PRD & Milestones](docs/PRD.md)
- [Proposal & Commercial Calibration](docs/PROPOSAL.md)

---

## 👨‍💻 Engineering Leadership

Engineered by **Shakil Ahmed**  
*Principal Systems Architect & Founder, BarakahSoft LLC*  
*Former Engineering Team Lead at Legiit ($1M ARR Command Center)*  
*Securiti Certified AI Security & Governance Architect (ID: `14B411BCE-14B411A3D-1451CFE76`)*
