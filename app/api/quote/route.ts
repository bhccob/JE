import { NextResponse } from 'next/server';

// Stub endpoint for the quote and contact forms. Wire to email/CRM later.
// The loyalty login never calls this (or anything else); it is front-end only.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  console.log('[quote request]', JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
