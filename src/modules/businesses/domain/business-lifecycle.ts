export const OFFICIAL_BUSINESS_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "published",
  "suspended",
  "rejected",
] as const

export type BusinessLifecycleStatus = (typeof OFFICIAL_BUSINESS_STATUSES)[number] | "archived"

export const businessStatusLabels: Record<BusinessLifecycleStatus, string> = {
  draft: "Rascunho",
  pending_review: "Em analise",
  approved: "Aprovado",
  published: "Publicado",
  suspended: "Suspenso",
  rejected: "Rejeitado",
  archived: "Arquivado",
}

export const businessStatusDescriptions: Record<BusinessLifecycleStatus, string> = {
  draft: "Negocio iniciado mas incompleto.",
  pending_review: "Cadastro aguardando validacao operacional.",
  approved: "Aprovado internamente e pronto para publicacao.",
  published: "Visivel na busca, categorias e perfil publico.",
  suspended: "Oculto temporariamente por revisao operacional.",
  rejected: "Cadastro recusado e oculto publicamente.",
  archived: "Registro arquivado.",
}

export function businessStatusLabel(status: string) {
  return businessStatusLabels[(status as BusinessLifecycleStatus) || "draft"] ?? status
}

export function businessStatusDescription(status: string) {
  return businessStatusDescriptions[(status as BusinessLifecycleStatus) || "draft"] ?? "Status operacional."
}
