import { createHash } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

type HubDataModule = typeof import("../lib/hub-data")

const outputDirectory = path.resolve("seed")

function stableUuid(value: string) {
  const hash = createHash("sha256").update(`hub-local:${value}`).digest("hex")
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function domainsForCategory(category: string) {
  return category === "Alimentacao" ? ["shop"] : ["services"]
}

async function writeJson(name: string, value: unknown) {
  await writeFile(path.join(outputDirectory, name), `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

async function main() {
const hubDataPath = "../lib/hub-data.ts"
const { businesses, categoryOptions } = (await import(hubDataPath)) as HubDataModule

await mkdir(outputDirectory, { recursive: true })

const domains = [
  { id: "services", name: "Servicos", description: "Prestadores e atividades executadas localmente.", sort_order: 1, active: true },
  { id: "shop", name: "Shop", description: "Lojas, comercio local e referencias de produtos.", sort_order: 2, active: true },
  { id: "mobility", name: "Mobilidade", description: "Opcoes locais de deslocamento e logistica.", sort_order: 3, active: true },
]

const broadCategories = categoryOptions.map((category, index) => ({
  id: stableUuid(`category:${slugify(category.id)}`),
  parent_id: null,
  slug: slugify(category.id),
  name: category.label,
  description: category.description,
  sort_order: index,
  active: true,
}))
const broadByName = new Map(broadCategories.map((category) => [category.name, category]))
const subcategoryNames = [...new Set(businesses.map((business) => business.categoryLabel))]
const categories = [
  ...broadCategories,
  ...subcategoryNames.map((name, index) => {
    const business = businesses.find((item) => item.categoryLabel === name)!
    return {
      id: stableUuid(`category:${slugify(name)}`),
      parent_id: broadByName.get(business.category)!.id,
      slug: slugify(name),
      name,
      description: business.specialty,
      sort_order: index,
      active: true,
    }
  }),
]
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

const businessRows = businesses.map((business) => ({
  id: stableUuid(`business:${business.slug}`),
  slug: business.slug,
  name: business.name,
  description: business.description,
  specialty: business.specialty,
  phone: business.phone,
  whatsapp: business.whatsapp,
  email: null,
  website: null,
  verified: business.badge === "Empresa Verificada",
  status: "published",
  trusted_since: `${business.trustedSince}-01-01`,
}))
const businessBySlug = new Map(businessRows.map((business) => [business.slug, business]))

const relations = {
  category_domains: broadCategories.flatMap((category) =>
    domainsForCategory(category.name).map((domain_id) => ({ category_id: category.id, domain_id })),
  ).concat(
    subcategoryNames.flatMap((name) => {
      const business = businesses.find((item) => item.categoryLabel === name)!
      return domainsForCategory(business.category).map((domain_id) => ({
        category_id: categoryBySlug.get(slugify(name))!.id,
        domain_id,
      }))
    }),
  ),
  business_domains: businesses.flatMap((business) =>
    domainsForCategory(business.category).map((domain_id, index) => ({
      business_id: businessBySlug.get(business.slug)!.id,
      domain_id,
      is_primary: index === 0,
    })),
  ),
  business_categories: businesses.flatMap((business) => [
    {
      business_id: businessBySlug.get(business.slug)!.id,
      category_id: categoryBySlug.get(slugify(business.categoryLabel))!.id,
      is_primary: true,
    },
    {
      business_id: businessBySlug.get(business.slug)!.id,
      category_id: categoryBySlug.get(slugify(business.category))!.id,
      is_primary: false,
    },
  ]),
}

const locations = businesses.map((business) => ({
  id: stableUuid(`location:${business.slug}:primary`),
  business_id: businessBySlug.get(business.slug)!.id,
  label: "Principal",
  city: business.city,
  state_code: "SP",
  neighborhood: business.neighborhood,
  address_line: business.address,
  postal_code: null,
  latitude: null,
  longitude: null,
  service_area: business.serviceArea,
  is_primary: true,
}))

const businessHours = businesses.flatMap((business) =>
  [1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: stableUuid(`hours:${business.slug}:${weekday}`),
    business_id: businessBySlug.get(business.slug)!.id,
    weekday,
    opens_at: "08:00:00",
    closes_at: business.closingTime === "23:00" ? "23:00:00" : "18:00:00",
    is_closed: false,
    timezone: "America/Sao_Paulo",
  })),
)

const businessMedia = businesses.flatMap((business) => [
  { id: stableUuid(`media:${business.slug}:cover`), business_id: businessBySlug.get(business.slug)!.id, type: "cover", url: business.cover, alt_text: null, sort_order: 0 },
  { id: stableUuid(`media:${business.slug}:avatar`), business_id: businessBySlug.get(business.slug)!.id, type: "avatar", url: business.avatar, alt_text: null, sort_order: 0 },
  ...business.gallery.map((url, index) => ({
    id: stableUuid(`media:${business.slug}:gallery:${index}`),
    business_id: businessBySlug.get(business.slug)!.id,
    type: "gallery",
    url,
    alt_text: null,
    sort_order: index,
  })),
])

const offerings = businesses.flatMap((business) =>
  business.services.map((name, index) => ({
    id: stableUuid(`offering:${business.slug}:${index}`),
    business_id: businessBySlug.get(business.slug)!.id,
    category_id: categoryBySlug.get(slugify(business.categoryLabel))!.id,
    type: business.category === "Alimentacao" ? "product_reference" : "service",
    name,
    description: null,
    metadata: {},
    active: true,
  })),
)

const trustSignals = businesses.flatMap((business) => {
  const type =
    business.badge === "Empresa Verificada"
      ? "verified"
      : business.badge === "Melhor Avaliado"
        ? "top_rated"
        : business.badge === "Mais Procurado"
          ? "featured"
          : null
  return type
    ? [{
        id: stableUuid(`trust:${business.slug}:${type}`),
        business_id: businessBySlug.get(business.slug)!.id,
        type,
        source: type === "verified" ? "admin" : "system",
        active: true,
        starts_at: null,
        ends_at: null,
      }]
    : []
})

await Promise.all([
  writeJson("domains.json", domains),
  writeJson("categories.json", categories),
  writeJson("businesses.json", businessRows),
  writeJson("business-relations.json", relations),
  writeJson("locations.json", locations),
  writeJson("business-hours.json", businessHours),
  writeJson("business-media.json", businessMedia),
  writeJson("offerings.json", offerings),
  writeJson("trust-signals.json", trustSignals),
])

console.log(`Seed exportado: ${businessRows.length} negocios, ${categories.length} categorias.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
