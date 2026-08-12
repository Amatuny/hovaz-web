// src/lib/email/templates/BookingAdminEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
  Row,
  Column,
} from '@react-email/components'

interface BookingAdminEmailProps {
  name: string
  email: string
  phone: string
  experienceType: string
  preferredDate: string
  groupSize: number
  notes?: string
}

export function BookingAdminEmail({
  name,
  email,
  phone,
  experienceType,
  preferredDate,
  groupSize,
  notes,
}: BookingAdminEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          {/* Header */}
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            New Booking Inquiry
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

          {/* Booking details */}
          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '40%' }}>
                <Text
                  style={{
                    color: '#8C8279',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Experience
                </Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2C2C', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                  {experienceType.replace(/_/g, ' ')}
                </Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: '#F0E6E6', margin: '12px 0' }} />

            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '40%' }}>
                <Text
                  style={{
                    color: '#8C8279',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Preferred Date
                </Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2C2C', fontSize: '16px', margin: 0 }}>
                  {new Date(preferredDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: '#F0E6E6', margin: '12px 0' }} />

            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '40%' }}>
                <Text
                  style={{
                    color: '#8C8279',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Group Size
                </Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2C2C', fontSize: '16px', margin: 0 }}>
                  {groupSize} {groupSize === 1 ? 'guest' : 'guests'}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          {/* Guest details */}
          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <Heading as="h2" style={{ color: '#6B1F2A', fontSize: '18px', marginTop: 0 }}>
              Guest Information
            </Heading>
            <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
              <strong>Email:</strong>{' '}
              <a href={'mailto:' + email} style={{ color: '#6B1F2A' }}>
                {email}
              </a>
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
              <strong>Phone:</strong>{' '}
              <a href={'tel:' + phone} style={{ color: '#6B1F2A' }}>
                {phone}
              </a>
            </Text>
            {notes && (
              <>
                <Hr style={{ borderColor: '#F0E6E6', margin: '16px 0' }} />
                <Text
                  style={{
                    color: '#8C8279',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0',
                  }}
                >
                  Notes
                </Text>
                <Text style={{ color: '#2C2C2C', margin: 0, fontStyle: 'italic' }}>{notes}</Text>
              </>
            )}
          </Section>

          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />

          <Text style={{ color: '#8C8279', fontSize: '12px', textAlign: 'center' }}>
            Log in to the admin dashboard to confirm or decline this inquiry.
          </Text>
          <Text style={{ color: '#8C8279', fontSize: '11px', textAlign: 'center' }}>
            HOVAZ Wine Rooms · hovazwines.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
