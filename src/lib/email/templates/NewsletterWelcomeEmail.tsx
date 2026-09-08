import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

export function NewsletterWelcomeEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F5F1E8', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
          <Heading style={{ color: '#6B1F2A', fontSize: '28px', marginBottom: '8px' }}>
            You&apos;re on the list
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
            Thank you for subscribing to <strong>Letters From The Forest</strong>. Expect upcoming
            evenings, new releases, and notes from the cellar — a few times a season.
          </Text>
          <Section style={{ backgroundColor: '#FFFFFF', padding: '24px', margin: '24px 0' }}>
            <Text
              style={{
                color: '#6B1F2A',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              In the meantime
            </Text>
            <Text style={{ color: '#2C2C2C', margin: '8px 0', lineHeight: '1.6' }}>
              Browse our wine experiences at{' '}
              <a href="https://hovazwines.com/events" style={{ color: '#6B1F2A' }}>
                hovazwines.com/events
              </a>
            </Text>
          </Section>
          <Hr style={{ borderColor: '#B8924A', margin: '24px 0' }} />
          <Text style={{ color: '#8C8279', fontSize: '11px', textAlign: 'center' }}>
            HOVAZ Wine Rooms · Armenia · hovazwines.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
