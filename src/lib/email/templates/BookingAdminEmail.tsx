// src/lib/email/templates/BookingAdminEmail.tsx
import { Html, Head, Body, Container, Heading, Text, Hr, Section } from '@react-email/components'

interface Props {
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
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f5f1e8' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Heading style={{ color: '#6B1F2A' }}>New Booking Inquiry</Heading>
          <Hr />
          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Phone:</strong> {phone}
            </Text>
            <Text>
              <strong>Experience:</strong> {experienceType}
            </Text>
            <Text>
              <strong>Preferred Date:</strong> {preferredDate}
            </Text>
            <Text>
              <strong>Group Size:</strong> {groupSize}
            </Text>
            {notes && (
              <Text>
                <strong>Notes:</strong> {notes}
              </Text>
            )}
          </Section>
          <Hr />
          <Text style={{ color: '#888', fontSize: '12px' }}>
            Log in to the admin dashboard to confirm or decline this inquiry.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
