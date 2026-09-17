import { NextRequest, NextResponse } from 'next/server';
import { processFintechPayment, PaymentRequest } from '@/lib/fintech';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const params: PaymentRequest = {
      idempotencyKey: String(body.idempotencyKey || `idemp_${Date.now()}`),
      amount: typeof body.amount === 'number' ? body.amount : 2500.0,
      sourceAccount: String(body.sourceAccount || '1029384756'),
      sourceRouting: String(body.sourceRouting || '121000358'),
      destinationAccount: String(body.destinationAccount || '9876543210'),
      destinationRouting: String(body.destinationRouting || '091000019'),
      secCode: body.secCode === 'CCD' || body.secCode === 'WEB' ? body.secCode : 'PPD',
      memo: String(body.memo || 'ACH Settlement Batch'),
      simulatedOutage: Boolean(body.simulatedOutage),
      aiProvider: body.aiProvider === 'GEMINI' || body.aiProvider === 'OPENAI' ? body.aiProvider : 'AUTO',
    };

    const result = await processFintechPayment(params);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown payment processing error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
