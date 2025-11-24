![Pipeline Status](https://github.com/FernandoTechSpace/api-node/actions/workflows/ci-cd.yaml/badge.svg)

# API Node.js com PostgreSQL, Docker e Migrations

API RESTful desenvolvida com Node.js (v25+), Express 5 e PostgreSQL, utilizando arquitetura MVC e Repository Pattern. O projeto foca em escalabilidade, segurança, separação de responsabilidades e automação de banco de dados via Migrations.

## Tecnologias

- **Node.js v25**: Runtime JavaScript moderno (com suporte nativo a .env e watch).
- **Express v5**: Framework web (com tratamento de erros assíncronos nativo).
- **PostgreSQL**: Banco de dados relacional.
- **Docker & Docker Compose**: Containerização do banco de dados.
- **PG (node-postgres)**: Driver de conexão oficial e seguro (Pool de conexões).
- **Node PG Migrate**: Controle de versão do esquema do banco de dados (Migrations).

## Arquitetura do Projeto

A estrutura de pastas reflete a separação de responsabilidades do padrão MVC:

```text
api-node/
├── .vscode/
│   └── launch.json         # Configurações de Debug do VS Code
├── migrations/             # Arquivos de versionamento do banco (SQL)
├── node_modules/           # Dependências do projeto
├── src/
│   ├── controllers/
│   │   └── UserController.js   # Lógica de controle (Request/Response)
│   ├── database/
│   │   └── index.js            # Configuração de conexão (Pool) com o PostgreSQL
│   ├── middlewares/
│   │   ├── ErrorHandler.js     # Tratamento global de erros
│   │   └── UserMiddleware.js   # Validações de requisição
│   ├── repositories/
│   │   └── UserRepository.js   # Abstração de acesso a dados (SQL Queries)
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
