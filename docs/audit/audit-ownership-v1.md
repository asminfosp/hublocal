# Hub Local - Audit Ownership V1

## Objetivo

Validar isolamento de dados entre usuarios e negocios.

## Cenarios

Criar:

```txt
Usuario A
Usuario B
```

Validar:

```txt
403
```

em todas as areas privadas quando o usuario nao for proprietario.

## Checklist

- [ ] Usuario A acessa seus proprios negocios
- [ ] Usuario B acessa seus proprios negocios
- [ ] Nao acessa negocio de terceiros
- [ ] Nao altera negocio de terceiros
- [ ] Nao ve dados de terceiros
- [ ] Server Actions validam ownership
- [ ] RPCs validam ownership quando aplicavel
- [ ] Business Console retorna 403 para nao proprietario

## Evidencias

- Usuario A:
- Usuario B:
- Negocio A:
- Negocio B:
- Ambiente:
- Data:

## Resultado

Status: Pendente

Observacoes:
