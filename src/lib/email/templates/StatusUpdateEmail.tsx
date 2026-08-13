// src/lib/email/templates/StatusUpdateEmail.tsx
import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

interface StatusUpdateEmailProps {
  name: string
  experienceType: string
  preferredDate: string
  groupSize: number
  status: string
  isConfirmed: boolean
}

export function StatusUpdateEmail({
  name,
  experienceType,
  preferredDate,
  groupSize,
  status,
  isConfirmed,
}: StatusUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            {isConfirmed ? 'Your booking is confirmed!' : 'Booking update'}
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
            HOVAZ Wine Rooms
          </Text>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
            Dear {name},
          </Text>

          {isConfirmed ? (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              We are delighted to confirm your booking for a{' '}
              <strong>{experienceType.replace(/_/g, ' ')}</strong> on{' '}
              <strong>
                {new Date(preferredDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>{' '}
              for{' '}
              <strong>
                {groupSize} {groupSize === 1 ? 'guest' : 'guests'}
              </strong>
              .
            </Text>
          ) : (
            <Text style={{ color: '#2C2C2C', fontSize: '16px', lineHeight: '1.7' }}>
              We regret to inform you that your booking for a{' '}
              <strong>{experienceType.replace(/_/g, ' ')}</strong> on{' '}
              <strong>
                {new Date(preferredDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>{' '}
              has been cancelled.
            </Text>
          )}

          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', margin: '24px 0' }}>
            {isConfirmed ? (
              <>
                <Text
                  style={{
                    color: '#6B1F2A',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0',
                  }}
                >
                  What to expect
                </Text>
                <Text style={{ color: '#2C2C2C', margin: '8px 0', lineHeight: '1.6' }}>
                  We look forward to welcoming you to HOVAZ Wine Rooms. Our team will be in touch
                  with any additional details closer to your visit date.
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: '#6B1F2A',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0',
                  }}
                >
                  Book another experience
                </Text>
                <Text style={{ color: '#2C2C2C', margin: '8px 0', lineHeight: '1.6' }}>
                  We would love to host you on another occasion. Browse our experiences at{' '}
                  <a href="https://hovazwines.com/events" style={{ color: '#6B1F2A' }}>
                    hovazwines.com/events
                  </a>
                </Text>
              </>
            )}
          </Section>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          <Text style={{ color: '#8C8279', fontSize: '12px', textAlign: 'center' }}>
            Questions? Contact us at{' '}
            <a href={'mailto:' + process.env.EMAIL_ADMIN} style={{ color: '#6B1F2A' }}>
              {process.env.EMAIL_ADMIN}
            </a>
          </Text>
          <Text style={{ color: '#8C8279', fontSize: '11px', textAlign: 'center' }}>
            HOVAZ Wine Rooms · Armenia · hovazwines.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
