// src/lib/email/templates/BookingUserEmail.tsx
import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

interface BookingUserEmailProps {
  confirmationCode: string
  name: string
  experienceType: string
  preferredDate: string
  groupSize: number
}

export function BookingUserEmail({
  confirmationCode,
  name,
  experienceType,
  preferredDate,
  groupSize,
}: BookingUserEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          {/* Header */}
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            Thank you, {name}
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
            We have received your inquiry for a <strong>{experienceType.replace(/_/g, ' ')}</strong>{' '}
            on{' '}
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

          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', margin: '24px 0 0 0' }}>
            <Text
              style={{
                color: '#8C8279',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Confirmation number
            </Text>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                margin: '4px 0 0 0',
              }}
            >
              {confirmationCode}
            </Text>
            <Text
              style={{
                color: '#2C2C2C',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: '12px 0 0 0',
              }}
            >
              Need to cancel? Go to{' '}
              <a href="https://hovazwines.com/booking/cancel" style={{ color: '#6B1F2A' }}>
                hovazwines.com/booking/cancel
              </a>{' '}
              and enter this number with your email. Cancel more than 24 hours before your visit for
              a full refund.
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', margin: '24px 0' }}>
            <Text
              style={{
                color: '#6B1F2A',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              What happens next?
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0', lineHeight: '1.6' }}>
              Our team will review your request and get back to you within
              <strong> 24 hours</strong> to confirm availability and share further details.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          <Text
            style={{ color: '#8C8279', fontSize: '12px', textAlign: 'center', lineHeight: '1.6' }}
          >
            Questions? Reply to this email or contact us at{' '}
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
