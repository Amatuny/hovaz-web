import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

interface ContactAdminEmailProps {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export function ContactAdminEmail({
  name,
  email,
  phone,
  subject,
  message,
}: ContactAdminEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            New Contact Message
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
          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
            <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
              <strong>Email:</strong>{' '}
              <a href={'mailto:' + email} style={{ color: '#6B1F2A' }}>
                {email}
              </a>
            </Text>
            {phone && (
              <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
                <strong>Phone:</strong> {phone}
              </Text>
            )}
            {subject && (
              <Text style={{ color: '#2C2C2C', margin: '8px 0' }}>
                <strong>Subject:</strong> {subject}
              </Text>
            )}
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
              Message
            </Text>
            <Text style={{ color: '#2C2C2C', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>
          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />
          <Text style={{ color: '#8C8279', fontSize: '11px', textAlign: 'center' }}>
            HOVAZ Wine Rooms · hovazwines.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
