export type BusinessCategory =
  | "Alimentacao"
  | "Servicos"
  | "Automotivo"
  | "Saude"
  | "Beleza"
  | "Pet"

export type BusinessBadge =
  | "Empresa Verificada"
  | "Mais Procurado"
  | "Melhor Avaliado"
  | "Proximo de Voce"
  | "Aberto Agora"

export type Business = {
  slug: string
  name: string
  category: BusinessCategory
  categoryLabel: string
  specialty: string
  rating: number
  reviews: number
  distanceMeters: number
  isOpen: boolean
  closingTime: string
  openingHours: string
  address: string
  neighborhood: string
  city: string
  phone: string
  whatsapp: string
  description: string
  serviceArea: string
  tags: string[]
  services: string[]
  cover: string
  avatar: string
  trustedSince: string
  highlight: string
  badge: BusinessBadge
  gallery: string[]
  reviewHighlights: {
    name: string
    rating: number
    comment: string
  }[]
}

type CityName = "Embu das Artes" | "Taboao da Serra" | "Cotia" | "Sorocaba"

type SubcategoryConfig = {
  category: BusinessCategory
  label: string
  specialty: string
  terms: string[]
  services: string[]
  names: string[]
  description: string
  imageKey: BusinessCategory
}

type CityConfig = {
  name: CityName
  neighborhoods: string[]
  streets: string[]
  phonePrefix: string
}

export const categoryOptions = [
  { id: "Alimentacao", label: "Alimentacao", description: "Pizzarias, restaurantes e sabores locais" },
  { id: "Servicos", label: "Servicos", description: "Profissionais para resolver hoje" },
  { id: "Automotivo", label: "Automotivo", description: "Oficinas, guincho e manutencao" },
  { id: "Saude", label: "Saude", description: "Clinicas, farmacias e cuidados" },
  { id: "Beleza", label: "Beleza", description: "Barbearias, saloes e estetica" },
  { id: "Pet", label: "Pet", description: "Pet shops, veterinarios e banho" },
] as const

export const popularSearches = [
  "Eletricista",
  "Mecanico",
  "Dentista",
  "Pizzaria",
  "Barbearia",
  "Pet Shop",
  "Chaveiro",
  "Farmacia",
]

const cities: CityConfig[] = [
  {
    name: "Embu das Artes",
    neighborhoods: ["Centro", "Jardim Vista Alegre", "Vila Isis Cristina", "Jardim Santo Eduardo", "Cercado Grande", "Parque Pirajussara"],
    streets: ["Rua da Matriz", "Av. Elias Yazbek", "Rua Nossa Senhora do Rosario", "Estrada de Itapecerica", "Rua Belo Horizonte", "Av. Rotary"],
    phonePrefix: "1198",
  },
  {
    name: "Taboao da Serra",
    neighborhoods: ["Centro", "Parque Assuncao", "Jardim Maria Rosa", "Jardim Record", "Pirajussara", "Vila Sonia"],
    streets: ["Av. Armando Andrade", "Rua do Tesouro", "Estrada Kizaemon Takeuti", "Rua Joao Santucci", "Av. Vida Nova", "Rua Marechal Floriano"],
    phonePrefix: "1197",
  },
  {
    name: "Cotia",
    neighborhoods: ["Centro", "Granja Viana", "Caucaia do Alto", "Jardim Nomura", "Parque Bahia", "Portao"],
    streets: ["Av. Professor Manoel Jose Pedroso", "Estrada da Aldeia", "Rua Senador Feijo", "Av. Sao Camilo", "Rua Jorge Caixe", "Estrada Fernando Nobre"],
    phonePrefix: "1196",
  },
  {
    name: "Sorocaba",
    neighborhoods: ["Centro", "Campolim", "Vila Hortencia", "Jardim Europa", "Jardim Sao Paulo", "Cerrado"],
    streets: ["Av. Afonso Vergueiro", "Rua da Penha", "Av. General Carneiro", "Av. Barata Ribeiro", "Rua Aparecida", "Av. Itavuvu"],
    phonePrefix: "1599",
  },
]

const categoryImages: Record<BusinessCategory, string[]> = {
  Alimentacao: [
    "/businesses/alimentacao-1.jpg",
    "/businesses/alimentacao-2.jpg",
    "/businesses/alimentacao-3.jpg",
    "/businesses/alimentacao-4.jpg",
  ],
  Servicos: [
    "/businesses/servicos-1.jpg",
    "/businesses/servicos-2.jpg",
    "/businesses/servicos-3.jpg",
    "/businesses/servicos-4.jpg",
  ],
  Automotivo: [
    "/businesses/automotivo-1.jpg",
    "/businesses/automotivo-2.jpg",
    "/businesses/automotivo-3.jpg",
    "/businesses/automotivo-4.jpg",
  ],
  Saude: [
    "/businesses/saude-1.jpg",
    "/businesses/saude-2.jpg",
    "/businesses/saude-3.jpg",
    "/businesses/saude-4.jpg",
  ],
  Beleza: [
    "/businesses/beleza-1.jpg",
    "/businesses/beleza-2.jpg",
    "/businesses/beleza-3.jpg",
    "/businesses/beleza-4.jpg",
  ],
  Pet: [
    "/businesses/pet-1.jpg",
    "/businesses/pet-2.jpg",
    "/businesses/pet-3.jpg",
    "/businesses/pet-4.jpg",
  ],
}

const subcategories: SubcategoryConfig[] = [
  {
    category: "Alimentacao",
    label: "Pizzaria",
    specialty: "Pizzas artesanais",
    terms: ["Pizzaria", "Pizza", "Jantar", "Massa"],
    services: ["Pizzas salgadas", "Pizzas doces", "Retirada", "Contato por WhatsApp"],
    names: ["Bella Massa", "Forno da Praca", "Vila Arte Pizzas"],
    description: "Pizzaria local com massa artesanal, sabores classicos e atendimento direto para pedidos e retirada.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Hamburgueria",
    specialty: "Hamburguer artesanal",
    terms: ["Hamburgueria", "Burger", "Lanche", "Jantar"],
    services: ["Burgers artesanais", "Porcoes", "Combos", "Retirada"],
    names: ["Burger Artes", "Brasa Burger", "Garage Burger"],
    description: "Hamburgueria de bairro com carnes preparadas na chapa, paes frescos e atendimento rapido.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Marmitaria",
    specialty: "Comida caseira",
    terms: ["Marmitaria", "Marmita", "Almoco", "Comida caseira"],
    services: ["Prato do dia", "Marmitas executivas", "Saladas", "Retirada"],
    names: ["Tempero da Vila", "Panelinha Local", "Marmita Boa"],
    description: "Marmitaria com comida caseira, cardapio diario e porcoes bem servidas para a rotina da regiao.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Restaurante",
    specialty: "Restaurante familiar",
    terms: ["Restaurante", "Almoco", "Comida", "Familia"],
    services: ["Almoco", "Pratos executivos", "Bebidas", "Mesa familiar"],
    names: ["Casa do Sabor", "Restaurante Central", "Mesa da Cidade"],
    description: "Restaurante familiar com pratos frescos, atendimento local e ambiente acolhedor para almoco.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Lanchonete",
    specialty: "Lanches rapidos",
    terms: ["Lanchonete", "Lanche", "Salgados", "Cafe"],
    services: ["Lanches", "Salgados", "Sucos", "Cafe"],
    names: ["Lanche da Esquina", "Ponto do Lanche", "Vila Snack"],
    description: "Lanchonete local para cafe, salgados e lanches rapidos durante o dia.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Padaria",
    specialty: "Paes e cafe",
    terms: ["Padaria", "Cafe", "Pao", "Confeitaria"],
    services: ["Paes", "Cafe", "Bolos", "Lanches"],
    names: ["Padaria Sao Bento", "Pao da Praca", "Forno Bom"],
    description: "Padaria de bairro com paes frescos, cafe, bolos e atendimento de rotina.",
    imageKey: "Alimentacao",
  },
  {
    category: "Alimentacao",
    label: "Acaiteria",
    specialty: "Acai e cremes",
    terms: ["Acaiteria", "Acai", "Sobremesa", "Creme"],
    services: ["Acai", "Cremes", "Toppings", "Vitaminas"],
    names: ["Acai da Vila", "Tigela Roxa", "Acai Prime"],
    description: "Acaiteria local com tigelas montadas, cremes e acompanhamentos para todos os horarios.",
    imageKey: "Alimentacao",
  },
  {
    category: "Servicos",
    label: "Eletricista",
    specialty: "Eletrica residencial",
    terms: ["Eletricista", "Eletrica", "Chuveiro", "Disjuntor"],
    services: ["Troca de chuveiro", "Disjuntores", "Tomadas", "Manutencao residencial"],
    names: ["Joao Eletricista", "Luz Forte Eletrica", "Circuito Seguro"],
    description: "Eletricista local para instalacoes, manutencao residencial e reparos emergenciais.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Encanador",
    specialty: "Hidraulica residencial",
    terms: ["Encanador", "Hidraulica", "Vazamento", "Cano"],
    services: ["Vazamentos", "Torneiras", "Descargas", "Tubulacao"],
    names: ["Hidro Rapido", "Encanador da Vila", "Cano Certo"],
    description: "Servico hidraulico para vazamentos, instalacoes, reparos e manutencao residencial.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Chaveiro",
    specialty: "Chaves e fechaduras",
    terms: ["Chaveiro", "Chave", "Fechadura", "Emergencia"],
    services: ["Abertura de portas", "Copias de chave", "Fechaduras", "Automotivo"],
    names: ["Chaveiro Central", "Chaves 24h", "Fechadura Segura"],
    description: "Chaveiro local com atendimento rapido para copias, fechaduras e emergencias.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Tecnico de Celular",
    specialty: "Assistencia de celulares",
    terms: ["Tecnico de Celular", "Assistencia Tecnica", "Celular", "Tela"],
    services: ["Troca de tela", "Bateria", "Conector", "Diagnostico"],
    names: ["Tecnocell Assistencia", "Cell Prime", "Smart Reparo"],
    description: "Assistencia tecnica para celulares com diagnostico, reparo de tela, bateria e conectores.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Tecnico de Informatica",
    specialty: "Computadores e redes",
    terms: ["Tecnico de Informatica", "Computador", "Notebook", "Formatacao"],
    services: ["Formatacao", "Backup", "Redes", "Manutencao"],
    names: ["Info Local", "Notebook Pro", "Rede Certa"],
    description: "Tecnico de informatica para notebooks, computadores, redes domesticas e manutencao.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Pintor",
    specialty: "Pintura residencial",
    terms: ["Pintor", "Pintura", "Parede", "Reforma"],
    services: ["Pintura interna", "Textura", "Massa corrida", "Acabamento"],
    names: ["Pintura Boa", "Cor da Casa", "Pintor Central"],
    description: "Pintor residencial com acabamento caprichado, pintura interna e pequenos reparos.",
    imageKey: "Servicos",
  },
  {
    category: "Servicos",
    label: "Marceneiro",
    specialty: "Moveis sob medida",
    terms: ["Marceneiro", "Marcenaria", "Moveis", "Madeira"],
    services: ["Moveis planejados", "Reparos", "Prateleiras", "Portas"],
    names: ["Marcenaria Embu Artes", "Madeira Fina", "Oficina do Moveis"],
    description: "Marcenaria local para moveis sob medida, reparos e instalacoes em madeira.",
    imageKey: "Servicos",
  },
  {
    category: "Automotivo",
    label: "Mecanico",
    specialty: "Mecanica e revisao",
    terms: ["Mecanico", "Oficina", "Revisao", "Freios"],
    services: ["Revisao", "Freios", "Suspensao", "Diagnostico"],
    names: ["Auto Center Embu", "Mecanica Elias", "Box 7 Mecanica"],
    description: "Oficina mecanica para revisao, freios, diagnostico e manutencao automotiva.",
    imageKey: "Automotivo",
  },
  {
    category: "Automotivo",
    label: "Auto Eletrica",
    specialty: "Eletrica automotiva",
    terms: ["Auto Eletrica", "Bateria", "Alternador", "Automotivo"],
    services: ["Bateria", "Alternador", "Partida", "Lampadas"],
    names: ["Auto Eletrica Lider", "Bateria Forte", "Eletrica Car"],
    description: "Auto eletrica para bateria, alternador, partida, lampadas e diagnostico eletrico.",
    imageKey: "Automotivo",
  },
  {
    category: "Automotivo",
    label: "Borracharia",
    specialty: "Pneus e reparos",
    terms: ["Borracharia", "Pneu", "Calibragem", "Conserto"],
    services: ["Conserto de pneu", "Calibragem", "Troca", "Balanceamento"],
    names: ["Borracharia Central", "Pneu Rapido", "Roda Certa"],
    description: "Borracharia de bairro para pneus, calibragem, reparos e trocas rapidas.",
    imageKey: "Automotivo",
  },
  {
    category: "Automotivo",
    label: "Funilaria",
    specialty: "Funilaria e pintura",
    terms: ["Funilaria", "Pintura automotiva", "Lataria", "Martelinho"],
    services: ["Funilaria", "Pintura", "Polimento", "Martelinho"],
    names: ["Funilaria Prime", "Lataria Nova", "Brilho Auto"],
    description: "Funilaria local para pintura, reparos de lataria, polimento e acabamento automotivo.",
    imageKey: "Automotivo",
  },
  {
    category: "Automotivo",
    label: "Guincho",
    specialty: "Guincho local",
    terms: ["Guincho", "Reboque", "Socorro", "Automotivo"],
    services: ["Reboque", "Socorro local", "Remocao", "Atendimento rapido"],
    names: ["Guincho Rota", "Socorro Auto", "Reboque Local"],
    description: "Guincho e reboque para atendimento local, remocao e suporte emergencial.",
    imageKey: "Automotivo",
  },
  {
    category: "Automotivo",
    label: "Troca de Oleo",
    specialty: "Oleo e filtros",
    terms: ["Troca de Oleo", "Oleo", "Filtro", "Revisao"],
    services: ["Troca de oleo", "Filtros", "Fluidos", "Check-up"],
    names: ["Oleo Express", "Filtro Certo", "Pit Stop Oleo"],
    description: "Servico rapido de troca de oleo, filtros e verificacao basica do veiculo.",
    imageKey: "Automotivo",
  },
  {
    category: "Saude",
    label: "Dentista",
    specialty: "Clinica odontologica",
    terms: ["Dentista", "Odontologia", "Clinica", "Limpeza"],
    services: ["Avaliacao", "Limpeza", "Restauracao", "Atendimento familiar"],
    names: ["Sorriso Clinica", "Odonto Prime", "Dental Arte"],
    description: "Clinica odontologica local para avaliacao, limpeza, restauracao e acompanhamento familiar.",
    imageKey: "Saude",
  },
  {
    category: "Saude",
    label: "Psicologo",
    specialty: "Atendimento psicologico",
    terms: ["Psicologo", "Terapia", "Saude mental", "Consulta"],
    services: ["Terapia", "Acompanhamento", "Atendimento adulto", "Orientacao"],
    names: ["Espaco Escuta", "Clinica Serena", "Mente Viva"],
    description: "Atendimento psicologico com acolhimento, escuta profissional e acompanhamento local.",
    imageKey: "Saude",
  },
  {
    category: "Saude",
    label: "Fisioterapia",
    specialty: "Reabilitacao e movimento",
    terms: ["Fisioterapia", "Fisio", "Reabilitacao", "Dor"],
    services: ["Reabilitacao", "Pilates clinico", "Dor lombar", "Alongamento"],
    names: ["Fisio Movimento", "Corpo Ativo", "Clinica Equilibrio"],
    description: "Fisioterapia para reabilitacao, dor, mobilidade e acompanhamento de rotina.",
    imageKey: "Saude",
  },
  {
    category: "Saude",
    label: "Clinica Medica",
    specialty: "Consultas e cuidados",
    terms: ["Clinica Medica", "Medico", "Consulta", "Saude"],
    services: ["Clinico geral", "Consulta", "Retorno", "Orientacao"],
    names: ["Vida Leve Clinica", "Clinica Popular Artes", "Cuidar Bem"],
    description: "Clinica medica local com consultas, orientacao e acompanhamento de cuidados basicos.",
    imageKey: "Saude",
  },
  {
    category: "Saude",
    label: "Farmacia",
    specialty: "Farmacia local",
    terms: ["Farmacia", "Medicamentos", "Saude", "Perfumaria"],
    services: ["Medicamentos", "Perfumaria", "Medicao de pressao", "Orientacao"],
    names: ["Farmacia Viva", "Drogaria Central", "Saude Farma"],
    description: "Farmacia de bairro com medicamentos, itens de cuidado e atendimento proximo.",
    imageKey: "Saude",
  },
  {
    category: "Beleza",
    label: "Barbearia",
    specialty: "Corte e barba",
    terms: ["Barbearia", "Barba", "Corte", "Beleza"],
    services: ["Corte masculino", "Barba", "Acabamento", "Sobrancelha"],
    names: ["Barbearia Rua 7", "Navalha Prime", "Barba da Vila"],
    description: "Barbearia local com cortes modernos, barba alinhada e atendimento de bairro.",
    imageKey: "Beleza",
  },
  {
    category: "Beleza",
    label: "Salao",
    specialty: "Cabelo e beleza",
    terms: ["Salao", "Cabelo", "Escova", "Coloracao"],
    services: ["Corte feminino", "Escova", "Coloracao", "Tratamento"],
    names: ["Studio Beleza Local", "Salao Bella", "Espaco Glam"],
    description: "Salao de beleza com corte, escova, coloracao e tratamentos para a rotina local.",
    imageKey: "Beleza",
  },
  {
    category: "Beleza",
    label: "Manicure",
    specialty: "Unhas e cuidado",
    terms: ["Manicure", "Unhas", "Pedicure", "Esmaltacao"],
    services: ["Manicure", "Pedicure", "Esmaltacao", "Alongamento"],
    names: ["Unhas da Praca", "Studio Nails", "Bella Unha"],
    description: "Servico de manicure e pedicure com cuidado, agenda direta e atendimento local.",
    imageKey: "Beleza",
  },
  {
    category: "Beleza",
    label: "Estetica",
    specialty: "Estetica e bem-estar",
    terms: ["Estetica", "Limpeza de pele", "Massagem", "Beleza"],
    services: ["Limpeza de pele", "Massagem", "Design de sobrancelha", "Cuidados faciais"],
    names: ["Estetica Essencial", "Pele Viva", "Espaco Cuidar"],
    description: "Estetica local para cuidados faciais, bem-estar e procedimentos de rotina.",
    imageKey: "Beleza",
  },
  {
    category: "Pet",
    label: "Pet Shop",
    specialty: "Produtos pet",
    terms: ["Pet Shop", "Racao", "Produtos", "Pet"],
    services: ["Racoes", "Acessorios", "Medicamentos pet", "Atendimento"],
    names: ["Pet Amigo", "Mundo Pet", "Pet Prime"],
    description: "Pet shop de bairro com racoes, produtos, acessorios e atendimento cuidadoso.",
    imageKey: "Pet",
  },
  {
    category: "Pet",
    label: "Veterinario",
    specialty: "Clinica veterinaria",
    terms: ["Veterinario", "Clinica Veterinaria", "Consulta pet", "Vacina"],
    services: ["Consulta", "Vacinas", "Exames", "Orientacao"],
    names: ["Vet Cuidado", "Clinica Pet Vida", "Doutor Pet"],
    description: "Atendimento veterinario local para consultas, vacinas, exames e orientacao.",
    imageKey: "Pet",
  },
  {
    category: "Pet",
    label: "Banho e Tosa",
    specialty: "Higiene pet",
    terms: ["Banho e Tosa", "Banho", "Tosa", "Pet"],
    services: ["Banho", "Tosa higienica", "Hidratacao", "Corte de unhas"],
    names: ["Banho e Tosa Jardim", "Bicho Feliz", "Tosa Prime"],
    description: "Banho e tosa com cuidado, higiene e atendimento carinhoso para caes e gatos.",
    imageKey: "Pet",
  },
]

const reviewNames = [
  "Marina Alves",
  "Carlos Lima",
  "Renata Souza",
  "Diego Martins",
  "Ana Paula",
  "Felipe Nunes",
  "Camila Torres",
  "Rafael Dias",
  "Juliana Prado",
  "Andre Gomes",
  "Luciana Reis",
  "Paulo Henrique",
]

const reviewComments = [
  "Atendimento claro, rapido e com muito cuidado. Passou confianca desde o primeiro contato.",
  "Boa comunicacao, resolveu dentro do combinado e virou referencia aqui na regiao.",
  "Equipe atenciosa, explicou tudo com calma e deixou uma impressao muito profissional.",
  "Lugar organizado, facil de falar pelo WhatsApp e com atendimento acima da media.",
]

const badgeCycle: BusinessBadge[] = [
  "Empresa Verificada",
  "Mais Procurado",
  "Melhor Avaliado",
  "Proximo de Voce",
  "Aberto Agora",
]

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function makePhone(city: CityConfig, index: number) {
  return `+55${city.phonePrefix}${String(500000 + index * 37).padStart(6, "0")}`
}

function makeBusiness(config: SubcategoryConfig, city: CityConfig, cityIndex: number, configIndex: number, variantIndex: number): Business {
  const globalIndex = cityIndex * 1000 + configIndex * 10 + variantIndex
  const neighborhood = city.neighborhoods[(configIndex + variantIndex) % city.neighborhoods.length]
  const street = city.streets[(configIndex + variantIndex) % city.streets.length]
  const images = categoryImages[config.imageKey]
  const image = images[(configIndex + variantIndex) % images.length]
  const secondImage = images[(configIndex + variantIndex + 1) % images.length]
  const thirdImage = images[(configIndex + variantIndex + 2) % images.length]
  const rating = Number((4.4 + ((globalIndex % 6) * 0.1)).toFixed(1))
  const isOpen = globalIndex % 5 !== 1
  const closingTime = ["18:00", "18:30", "19:00", "20:00", "21:00", "22:00", "23:30"][globalIndex % 7]
  const baseName = config.names[variantIndex % config.names.length]
  const suffix = city.name === "Embu das Artes" ? neighborhood : city.name
  const name = `${baseName} ${suffix}`.replace(" Centro", "")
  const phone = makePhone(city, globalIndex)
  const badge = isOpen && globalIndex % 7 === 0 ? "Aberto Agora" : badgeCycle[globalIndex % badgeCycle.length]

  return {
    slug: slugify(`${name}-${config.label}-${city.name}`),
    name,
    category: config.category,
    categoryLabel: config.label,
    specialty: config.specialty,
    rating,
    reviews: 42 + ((globalIndex * 17) % 260),
    distanceMeters: 350 + ((globalIndex * 137) % 8200),
    isOpen,
    closingTime,
    openingHours: isOpen ? `Hoje ate ${closingTime}` : "Abre amanha as 08:00",
    address: `${street}, ${120 + ((globalIndex * 11) % 1800)} - ${neighborhood}, ${city.name}`,
    neighborhood,
    city: city.name,
    phone,
    whatsapp: phone,
    description: `${config.description} Atende ${neighborhood} e bairros proximos de ${city.name}.`,
    serviceArea: `${neighborhood}, Centro e bairros proximos de ${city.name}`,
    tags: [...config.terms, config.category, city.name, neighborhood],
    services: config.services,
    cover: image,
    avatar: image,
    trustedSince: String(2017 + (globalIndex % 8)),
    highlight: ["Responde rapido", "Favorito da regiao", "Atendimento bem avaliado", "Boa reputacao local"][globalIndex % 4],
    badge,
    gallery: [image, secondImage, thirdImage, image],
    reviewHighlights: [
      {
        name: reviewNames[globalIndex % reviewNames.length],
        rating: Math.round(rating),
        comment: reviewComments[globalIndex % reviewComments.length],
      },
      {
        name: reviewNames[(globalIndex + 4) % reviewNames.length],
        rating: Math.max(4, Math.round(rating)),
        comment: reviewComments[(globalIndex + 2) % reviewComments.length],
      },
    ],
  }
}

export const businesses: Business[] = cities.flatMap((city, cityIndex) =>
  subcategories.flatMap((config, configIndex) =>
    [0, 1, 2].map((variantIndex) => makeBusiness(config, city, cityIndex, configIndex, variantIndex)),
  ),
)

export function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters}m`
  }

  return `${(distanceMeters / 1000).toFixed(1).replace(".", ",")} km`
}

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function getBusinessBySlug(slug: string) {
  return businesses.find((business) => business.slug === slug)
}

export function getSimilarBusinesses(business: Business, limit = 8) {
  return businesses
    .filter((item) => item.slug !== business.slug && item.categoryLabel === business.categoryLabel)
    .sort((a, b) => b.rating - a.rating || a.distanceMeters - b.distanceMeters)
    .slice(0, limit)
}

export function getBusinessesByBadge(badge: BusinessBadge, limit = 12) {
  return businesses.filter((business) => business.badge === badge).slice(0, limit)
}

export function searchBusinesses(query = "", category = "", filter = "") {
  const normalizedQuery = normalizeSearch(query)

  return businesses
    .filter((business) => {
      const matchesCategory = category ? business.category === category : true
      const searchable = normalizeSearch(
        [
          business.name,
          business.categoryLabel,
          business.specialty,
          business.description,
          business.serviceArea,
          business.neighborhood,
          business.city,
          business.badge,
          ...business.tags,
          ...business.services,
        ].join(" "),
      )
      const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true
      const matchesFilter =
        filter === "open"
          ? business.isOpen
          : filter === "top"
            ? business.rating >= 4.8
            : filter === "verified"
              ? business.badge === "Empresa Verificada"
              : true

      return matchesCategory && matchesQuery && matchesFilter
    })
    .sort((a, b) => {
      if (filter === "nearby") {
        return a.distanceMeters - b.distanceMeters
      }

      if (filter === "top") {
        return b.rating - a.rating || b.reviews - a.reviews
      }

      if (filter === "verified") {
        return Number(b.badge === "Empresa Verificada") - Number(a.badge === "Empresa Verificada")
      }

      if (filter === "open") {
        return Number(b.isOpen) - Number(a.isOpen) || a.distanceMeters - b.distanceMeters
      }

      return a.distanceMeters - b.distanceMeters
    })
}
