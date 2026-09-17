import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'LedgerFlow Core • Enterprise Fintech & Payments Architecture MVP',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    capabilities: [
      'idempotency-key-replay-defense',
      'double-entry-ledger-invariants',
      'nacha-94-char-ach-batch-generation',
      'postgresql-composite-indexing-explain',
      'aws-ecs-fargate-worker-queues',
      'inline-llm-firewall-compliance',
    ],
    architecture: {
      frontend: 'React 19 / Next.js 15 App Router (TypeScript)',
      backend: 'Node.js 22 (TypeScript / REST / Zod)',
      database: 'PostgreSQL 16 (B-Tree composite & partial indexes)',
      infrastructure: 'AWS ECS Fargate, S3, CloudFront, SQS',
      aiTooling: 'Claude / Claude Code native integration',
    },
  });
}
