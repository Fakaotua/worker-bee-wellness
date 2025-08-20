import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

function verifySquareSignature(signature: string | null, rawBody: string, secret: string) {
  if (!signature) return false
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody, 'utf8')
  const expected = hmac.digest('base64')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-square-hmacsha256-signature')
  const secret = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || ''
  const raw = await request.text()

  if (!secret) {
    console.warn('SQUARE_WEBHOOK_SIGNATURE_KEY not set')
  }

  const isValid = secret ? verifySquareSignature(signature, raw, secret) : true

  if (!isValid) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(raw)
    console.log('Square webhook received', {
      type: payload?.type,
      event_id: payload?.event_id,
      created_at: payload?.created_at,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
}
