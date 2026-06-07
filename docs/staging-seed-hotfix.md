# HUB LOCAL - Hotfix Seed Inicial de Staging

Status: pronto para aplicacao em homologacao.

## Arquivo

`supabase/seeds/staging.sql`

## Conteudo

- 3 dominios oficiais.
- 8 categorias.
- 20 empresas ficticias publicadas e verificadas.
- 20 localizacoes.
- 120 registros de horario.
- 40 ofertas.
- 20 sinais `verified`.
- Relacionamentos de dominio e categoria.

Cidades:

- Embu das Artes.
- Taboao da Serra.
- Itapecerica da Serra.

## Seguranca

- Todos os slugs possuem prefixo `stg-`.
- Reaplicar o seed remove e recria apenas empresas com prefixo `stg-`.
- Nenhum dado pessoal real e utilizado.
- O arquivo nao deve ser aplicado automaticamente em Production.

## Aplicacao

Com projeto Staging vinculado:

```text
npx supabase db push
npx supabase db query --linked --file supabase/seeds/staging.sql
```

Antes da aplicacao, confirmar que o projeto vinculado e realmente Staging.

## Validacao Esperada

```sql
select count(*) from businesses where slug like 'stg-%';             -- 20
select count(*) from locations l join businesses b on b.id = l.business_id where b.slug like 'stg-%'; -- 20
select count(*) from offerings o join businesses b on b.id = o.business_id where b.slug like 'stg-%'; -- 40
select count(*) from trust_signals t join businesses b on b.id = t.business_id where b.slug like 'stg-%'; -- 20
```

Depois da carga:

- Home deve exibir empresas publicadas.
- Busca deve retornar resultados.
- Perfis devem carregar pelos slugs `stg-*`.
