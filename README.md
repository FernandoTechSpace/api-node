# API Node.js com PostgreSQL e Docker

API RESTful desenvolvida com Node.js (v25+), Express 5 e PostgreSQL, utilizando arquitetura MVC e Repository Pattern. O projeto foca em escalabilidade, segurança e separação de responsabilidades.

## Tecnologias

- **Node.js v25**: Runtime JavaScript moderno (com suporte nativo a .env e watch).
- **Express v5**: Framework web (com tratamento de erros assíncronos nativo).
- **PostgreSQL**: Banco de dados relacional robusto.
- **Docker & Docker Compose**: Containerização do banco de dados.
- **PG (node-postgres)**: Driver de conexão oficial e seguro (Pool de conexões).

## Arquitetura do Projeto

A estrutura de pastas reflete a separação de responsabilidades do padrão MVC:

```text
api-node/
├── .vscode/
│   └── launch.json         # Configurações de Debug do VS Code
├── node_modules/           # Dependências do projeto
├── src/
│   ├── controllers/
│   │   └── UserController.js   # Lógica de controle (Request/Response)
│   ├── database/
│   │   └── index.js            # Configuração de conexão (Pool) com o PostgreSQL
│   ├── middlewares/
│   │   ├── ErrorHandler.js     # Tratamento global de erros
│   │   └── UserMiddleware.js   # Validações de requisição (ex: campos obrigatórios)
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

Pré-requisitos
. Node.js (v20 ou superior)
. Docker e Docker Compose

Instalar depencias usando o comando: npm install

Endpoints disponiveis para consulta
Método,URL,Descrição
GET,/usuarios,Lista todos os usuários. Aceita filtro query param ?cargo=X
POST,/usuarios,"Cria um novo usuário. Body: { ""nome"": ""..."", ""cargo"": ""..."" }"
PUT,/usuarios/:id,Atualiza um usuário existente por ID.
DELETE,/usuarios/:id,Remove um usuário por ID.

Detalhes tecnicos:
. Repository Pattern: O Controller desconhece a linguagem SQL. Ele apenas solicita operações ao Repositório. Isso desacopla a regra de negócio da persistência de dados.

. Connection Pool: Utilizamos um pool de conexões no diretório database para gerenciar múltiplas requisições de forma eficiente.

. Segurança: Utilização de Parameterized Queries ($1, $2) para prevenção contra SQL Injection e variáveis de ambiente para proteção de credenciais.

. Ambiente: O banco de dados roda isolado em container Docker (imagem postgres:15), garantindo compatibilidade e limpeza do ambiente de desenvolvimento.

### Teste de pipeline
