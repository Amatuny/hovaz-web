// scripts/test-email.ts
import { resend } from '../lib/email/client'

async function main() {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: 'martinamatuny@gmail.com',
    subject: 'HOVAZ email test',
    html: '<h1>It works</h1>',
  })

  if (error) {
    console.error('Failed:', error)
    process.exit(1)
  }

  console.log('Sent:', data)
}

main()
