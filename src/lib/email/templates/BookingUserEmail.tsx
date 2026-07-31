// src/lib/email/templates/BookingUserEmail.tsx
import { Html, Head, Body, Container, Heading, Text, Hr } from '@react-email/components'

interface Props {
  name: string
  experienceType: string
  preferredDate: string
  groupSize: number
}

export function BookingUserEmail({ name, experienceType, preferredDate, groupSize }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f5f1e8' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Heading style={{ color: '#6B1F2A' }}>Thank you, {name}</Heading>
          <Text>
            We have received your inquiry for <strong>{experienceType}</strong> on{' '}
            <strong>{preferredDate}</strong> for <strong>{groupSize} guests</strong>.
          </Text>
          <Text>Our team will review your request and get back to you within 24 hours.</Text>
          <Hr />
          <Text style={{ color: '#888', fontSize: '12px' }}>HOVAZ Wine Rooms · Armenia</Text>
        </Container>
      </Body>
    </Html>
  )
}
