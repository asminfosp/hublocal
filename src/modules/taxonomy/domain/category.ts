export const OFFICIAL_DOMAIN_IDS = ["services", "shop", "mobility"] as const

export type DomainId = (typeof OFFICIAL_DOMAIN_IDS)[number]

export type HubDomain = {
  id: DomainId
  name: string
  description: string
}

export type Category = {
  id: string
  slug: string
  name: string
  domainIds: DomainId[]
  parentId?: string
  description?: string
}
