import { NextResponse } from "next/server"

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export async function GET(_request: Request, { params }: { params: Promise<{ cnpj: string }> }) {
  const { cnpj } = await params
  const cleanCnpj = onlyDigits(cnpj)

  if (cleanCnpj.length !== 14) {
    return NextResponse.json({ error: "invalid_cnpj" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
      cache: "no-store",
      headers: {
        accept: "application/json",
        "user-agent": "Hub Local CNPJ Lookup",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "cnpj_lookup_unavailable" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      legalName: data.razao_social ?? "",
      tradeName: data.nome_fantasia ?? "",
      postalCode: data.cep ?? "",
      city: data.municipio ?? "",
      stateCode: data.uf ?? "",
      neighborhood: data.bairro ?? "",
      addressLine: [data.logradouro, data.numero].filter(Boolean).join(", "),
    })
  } catch {
    return NextResponse.json({ error: "cnpj_lookup_unavailable" }, { status: 503 })
  }
}
