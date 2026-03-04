[![Pipeline-api-node](https://github.com/FernandoTechSpace/api-node/actions/workflows/ci-cd-.yaml/badge.svg)](https://github.com/FernandoTechSpace/api-node/actions/workflows/ci-cd-.yaml)

# API Node.js com PostgreSQL, Docker e Migrations

API RESTful desenvolvida com Node.js (v25+), Express 5 e PostgreSQL, utilizando arquitetura MVC e Repository Pattern. O projeto foca em escalabilidade, segurança, separação de responsabilidades e automação de banco de dados via Migrations. A API agora é "production-ready", contando com validações estritas, tratamento centralizado de erros avançado, paginação orientada a negócio e testes de integração automatizados.

## Tecnologias

- **Node.js v25**: Runtime JavaScript moderno (com suporte nativo a .env e watch).
- **Express v5**: Framework web (com tratamento de erros assíncronos nativo).
- **PostgreSQL**: Banco de dados relacional (Protegido por Unique Constraints).
- **Docker & Docker Compose**: Containerização do banco de dados.
- **PG (node-postgres)**: Driver de conexão oficial e seguro (Pool de conexões).
- **Node PG Migrate**: Controle de versão do esquema do banco de dados (Migrations).
- **Zod**: Ferramenta premium para declaração de Web Schemas e validação estrita (Fail-Fast) do payload das requisições.
- **Jest & Supertest**: Suite de testes para validação automatizada de rotas e comportamentos da API.

## Arquitetura do Projeto

A estrutura de pastas reflete a separação de responsabilidades do padrão MVC, orientada a domínios seguros:

```text
api-node/
├── .vscode/
│   └── launch.json         # Configurações de Debug do VS Code
├── migrations/             # Arquivos de versionamento do banco (SQL)
├── __tests__/ 
│   ├── integration/        # Testes de unidade e Integração das Rotas contra o Banco
│   └── sanity.test.js      # Base Test Setup
├── node_modules/           # Dependências do projeto
├── src/
│   ├── controllers/
│   │   └── UserController.js   # Lógica de controle (Request/Response + Paginação)
│   ├── database/
│   │   └── index.js            # Configuração de conexão (Pool) com o PostgreSQL
│   ├── middlewares/
│   │   ├── ErrorHandler.js     # Tratamento global de erros (ZodErrors + PG Constraints)
│   │   └── UserMiddleware.js   # Validações de payload rigorosas com (Zod Schemas)
│   ├── repositories/
│   │   └── UserRepository.js   # Abstração de acesso a dados (SQL Queries seguras)
│   ├── index.js            # Entry point e Server
│   └── router.js           # Definição de rotas
├── .env                    # Variáveis de ambiente (Segurança)
├── .gitignore              # Arquivos ignorados pelo Git
├── ci-cd.yaml              # Pipeline de CI/CD
├── docker-compose.yaml     # Definição da infraestrutura (Banco de Dados)
├── package-lock.json       # Versões exatas das dependências
├── package.json            # Scripts e metadados do projeto
└── README.md               # Documentação
```

## Melhorias de Produção Implementadas
- **Validação Estrita:** Todos os requests viajam pelo middleware Zod que barra anomalias (payloads grandes demais, colunas injetadas indevidamente ou dados muito curtos).
- **Tratamento Global de Erros:** Exceções do Zod geram retornos formatados HTTP 400. Exceções estruturais do Postgres (ex: Coluna Unique Violada code 23505) tornam-se HTTP 409 de conflito na API. Erro oculto nunca mais.
- **Paginação Real:** As consultas de listagem aglutinam nativamente query params `?page=&limit=` interceptadas de forma inteligente e enviadas ao Postgres para mitigar "Full Table Scans".

## Executando as Validações (Integração)

Com o repositório clonado e as dependências instaladas, inicialize o banco de dados e utilize o suíte oficial.

1. Suba o container Postgres background:
   ```bash
   docker-compose up -d
   ```
2. Aplique a migração de schema inicial e as proteções de Tabela (DB Constraints):
   ```bash
   npm run migrate
   ```
3. Rode toda a suíte de testes end-to-end:
   ```bash
   npm run test
   ```
