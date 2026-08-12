// src/lib/turnstile.ts

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    throw new Error('Missing TURNSTILE_SECRET_KEY')
  }

  // In development without a real token — allow through
  if (process.env.NODE_ENV === 'development' && token === 'dev-bypass') {
    return true
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })

  const data: TurnstileVerifyResponse = await response.json()
  return data.success === true
}
