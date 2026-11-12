// src/lib/email/templates/BookingCancelledEmail.tsx
// Sent when a guest cancels on /booking/cancel — to the guest, and to the team
// (with the refund outcome so they can process it).
import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

interface BookingCancelledEmailProps {
  audience: 'guest' | 'admin'
  confirmationCode: string
  name: string
  email: string
  experienceType: string
  preferredDate: string
  preferredTime: string | null
  groupSize: number
  refund: 'full' | 'none'
  depositAmd: number | null
  experienceName: string | null
  reason: string | null
}

const formatAmd = (amount: number) => `${amount.toLocaleString('en-US')} AMD`

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function BookingCancelledEmail({
  audience,
  confirmationCode,
  name,
  email,
  experienceType,
  preferredDate,
  preferredTime,
  groupSize,
  refund,
  depositAmd,
  experienceName,
  reason,
}: BookingCancelledEmailProps) {
  const visit = (
    <>
      <strong>{experienceName ?? experienceType.replace(/_/g, ' ')}</strong> on{' '}
      <strong>
        {formatDate(preferredDate)}
        {preferredTime ? ` at ${preferredTime}` : ''}
      </strong>{' '}
      for{' '}
      <strong>
        {groupSize} {groupSize === 1 ? 'guest' : 'guests'}
      </strong>
    </>
  )

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            {audience === 'guest' ? 'Your booking is cancelled' : 'Booking cancelled by guest'}
          </Heading>
          <Text
            style={{
              color: '#B8924A',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: 0,
            }}
          >
            HOVAZ Wine Rooms · {confirmationCode}
          </Text>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          {audience === 'guest' ? (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              Dear {name}, as you requested, we have cancelled your {visit}.
            </Text>
          ) : (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              {name} ({email}) cancelled their {visit} online.
            </Text>
          )}

          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', margin: '24px 0' }}>
            <Text
              style={{
                color: '#6B1F2A',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              {refund === 'full'
                ? `Full refund${depositAmd ? ` — ${formatAmd(depositAmd)}` : ''}`
                : 'No refund'}
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0', lineHeight: '1.6' }}>
              {audience === 'guest'
                ? refund === 'full'
                  ? 'You cancelled more than 24 hours before your visit, so any deposit you paid will be refunded in full. It will reach the original payment method within 5-7 business days.'
                  : 'You cancelled less than 24 hours before your visit, so under our cancellation policy the deposit is not refundable.'
                : refund === 'full'
                  ? 'Cancelled more than 24 hours before the visit — refund any deposit in full.'
                  : 'Cancelled less than 24 hours before the visit — no refund is due.'}
            </Text>
          </Section>

          {audience === 'admin' && (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              <strong>Reason:</strong> {reason ?? 'not given'}
            </Text>
          )}

          {audience === 'guest' && (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              We would love to host you another time. Browse our experiences at{' '}
              <a href="https://hovazwines.com/events" style={{ color: '#6B1F2A' }}>
                hovazwines.com/events
              </a>
              .
            </Text>
          )}

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          <Text style={{ color: '#8C8279', fontSize: '11px', textAlign: 'center' }}>
            HOVAZ Wine Rooms · Armenia · hovazwines.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
