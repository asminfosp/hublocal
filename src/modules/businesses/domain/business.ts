export type BusinessId = string

export type BusinessLocation = {
  city: string
  neighborhood: string
  address: string
  latitude?: number
  longitude?: number
  serviceArea?: string
}

export type BusinessContact = {
  phone?: string
  whatsapp?: string
  email?: string
}

export type BusinessHours = {
  summary: string
  isOpen?: boolean
  closingTime?: string
}

export type BusinessMedia = {
  cover?: string
  avatar?: string
  gallery: string[]
}

export type TrustSignal =
  | "verified"
  | "featured"
  | "open_now"
  | "top_rated"
  | "popular"
  | "nearby"

export type BusinessCategoryRef = {
  id: string
  name: string
}

export type OfferingType = "service" | "product_reference" | "mobility_capability"

export type Offering = {
  id: string
  type: OfferingType
  name: string
  description?: string
}

export type ReviewHighlight = {
  name: string
  rating: number
  comment: string
}

export type Business = {
  id: BusinessId
  slug: string
  name: string
  description: string
  domainIds: string[]
  categories: BusinessCategoryRef[]
  offerings: Offering[]
  contact: BusinessContact
  location: BusinessLocation
  hours: BusinessHours
  media: BusinessMedia
  trustSignals: TrustSignal[]
  rating?: number
  reviewCount?: number
  distanceMeters?: number
  specialty?: string
  tags: string[]
  highlight?: string
  trustedSince?: string
  reviewHighlights: ReviewHighlight[]
  createdAt?: string
  updatedAt?: string
}
