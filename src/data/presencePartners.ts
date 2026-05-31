import type { PresenceCountry } from '@/components/sections/AmericasPresenceMap'

/** Marca asociada a un mercado */
export type PresencePartner = {
  name: string
  /** Slug Simple Icons (respaldo) */
  logo: string
  /** Dominio para Clearbit (fuente principal del logo) */
  domain: string
  /** Color de marca en hex sin # — glow y fallback */
  color: string
}

/** Logos reales por país */
export const PRESENCE_PARTNERS: Record<PresenceCountry['id'], readonly PresencePartner[]> = {
  mx: [
    { name: 'Walmart', logo: 'walmart', domain: 'walmart.com.mx', color: '0071CE' },
    { name: 'Coca-Cola', logo: 'cocacola', domain: 'coca-cola.com', color: 'D00013' },
    { name: 'Nike', logo: 'nike', domain: 'nike.com', color: '111111' },
    { name: 'Amazon', logo: 'amazon', domain: 'amazon.com', color: 'FF9900' },
    { name: 'Microsoft', logo: 'microsoft', domain: 'microsoft.com', color: '0078D4' },
    { name: 'Google', logo: 'google', domain: 'google.com', color: '4285F4' },
  ],
  us: [
    { name: 'Microsoft', logo: 'microsoft', domain: 'microsoft.com', color: '0078D4' },
    { name: 'Stripe', logo: 'stripe', domain: 'stripe.com', color: '635BFF' },
    { name: 'Shopify', logo: 'shopify', domain: 'shopify.com', color: '7AB55C' },
    { name: 'HubSpot', logo: 'hubspot', domain: 'hubspot.com', color: 'FF7A59' },
    { name: 'Salesforce', logo: 'salesforce', domain: 'salesforce.com', color: '00A1E0' },
    { name: 'Adobe', logo: 'adobe', domain: 'adobe.com', color: 'FF0000' },
  ],
  pe: [
    { name: 'Cisco', logo: 'cisco', domain: 'cisco.com', color: '1BA0D7' },
    { name: 'Oracle', logo: 'oracle', domain: 'oracle.com', color: 'F80000' },
    { name: 'Visa', logo: 'visa', domain: 'visa.com', color: '1A1F71' },
    { name: 'Mastercard', logo: 'mastercard', domain: 'mastercard.com', color: 'EB001B' },
    { name: 'Spotify', logo: 'spotify', domain: 'spotify.com', color: '1DB954' },
    { name: 'Uber', logo: 'uber', domain: 'uber.com', color: '000000' },
  ],
  ar: [
    { name: 'Mercado Libre', logo: 'mercadolibre', domain: 'mercadolibre.com', color: 'FFE600' },
    { name: 'Globant', logo: 'globant', domain: 'globant.com', color: 'BFD730' },
    { name: 'Spotify', logo: 'spotify', domain: 'spotify.com', color: '1DB954' },
    { name: 'Uber', logo: 'uber', domain: 'uber.com', color: '000000' },
    { name: 'Google', logo: 'google', domain: 'google.com', color: '4285F4' },
    { name: 'Meta', logo: 'meta', domain: 'meta.com', color: '0467DF' },
  ],
}

/** Fuentes del logo — varias CDNs por si una falla en el navegador */
export function partnerLogoSources(partner: PresencePartner): string[] {
  return [
    `https://logo.clearbit.com/${partner.domain}?size=128`,
    `https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`,
    `https://cdn.simpleicons.org/${partner.logo}/${partner.color}`,
    `https://cdn.simpleicons.org/${partner.logo}`,
  ]
}
