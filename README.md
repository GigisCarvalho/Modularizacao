# Modularização de API de Usuários com Node.js e MySQL

Projeto de estudo desenvolvido para praticar **modularização no Node.js**, separando as responsabilidades da aplicação entre configurações, rotas e controladores.

A API realiza operações de CRUD em usuários, além de oferecer paginação, busca por nome ou e-mail e filtro por status ativo.

## Tecnologias utilizadas

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- CORS
- CommonJS

## Funcionalidades

- Cadastrar usuários
- Listar usuários com paginação
- Buscar usuário por ID
- Pesquisar usuários por nome ou e-mail
- Filtrar usuários pelo status ativo
- Atualizar parcialmente os dados de um usuário
- Excluir usuário
- Configurar o banco de dados por variáveis de ambiente

## Estrutura do projeto

```text
Modularizacao/
├── src/
│   ├── config/
│   │   └── db.config.js
│   ├── controllers/
│   │   └── users.controllers.js
│   ├── routes/
│   │   └── users.routes.js
│   └── index.js
├── .env.example
├── .gitignore
├── dev_db.txt
├── package.json
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

- Node.js 18 ou superior
- MySQL
- npm
- dotenv
- mysql2
- cors

## Instalação

Clone o repositório:

```bash
git clone https://github.com/GigisCarvalho/Modularizacao.git
```

Acesse a pasta do projeto:

```bash
cd Modularizacao
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

> Não envie o arquivo `.env` para o GitHub. Ele pode conter credenciais e informações sensíveis.

## Banco de dados

Crie no MySQL o banco informado em `dev_db.txt`.

## Como executar

Executar normalmente:

```bash
npm start
```

Executar em modo de desenvolvimento, reiniciando após alterações:

```bash
npm run watch
```

A API será iniciada na porta configurada no arquivo `.env`.

## Endpoints

### Listar usuários

```http
GET /
```

Parâmetros opcionais:

```text
?page=1&limit=10
```

Exemplo:

```http
GET /?page=1&limit=10
```

### Filtrar usuários por status

```http
GET /is_active/
```

Parâmetros:

```text
?active=1
```

Parâmetros opcionais:

```text
?page=1&limit=10
```

Use `1` para usuários ativos e `0` para usuários inativos.

### Pesquisar usuários

```http
GET /search/
```

Parâmetros:

```text
?nome=Ana&email=@gmail
```

Parâmetros opcionais:

```text
?page=1&limit=10
```

A pesquisa utiliza correspondência parcial nos campos `nome` e `email`.

### Buscar usuário por ID

```http
GET /:id
```

Exemplo:

```http
GET /1
```

### Cadastrar usuário

```http
POST /
```

Exemplo de corpo da requisição:

```json
{
  "nome": "Ana Souza",
  "email": "ana@email.com",
  "telefone": "11999999999",
  "data_nascimento": "1998-05-20",
  "cidade": "São Paulo",
  "estado": "SP",
  "cargo": "Desenvolvedora",
  "ativo": 1
}
```

### Atualizar usuário

```http
PUT /:id
```

A atualização aceita os campos `email`, `telefone`, `cargo` e `ativo`. Os campos não enviados permanecem com os valores atuais.

Exemplo:

```json
{
  "email": "novoemail@email.com",
  "cargo": "Analista de Sistemas"
}
```

### Excluir usuário

```http
DELETE /:id
```

Exemplo:

```http
DELETE /1
```

## Conceitos praticados

- Modularização de um projeto Node.js
- Separação entre rotas, controladores e configurações
- Criação de API REST com Express
- Conexão com MySQL usando pool de conexões
- Consultas SQL parametrizadas
- Paginação com `LIMIT` e `OFFSET`
- Atualização parcial com `COALESCE`
- Uso de variáveis de ambiente
- Tratamento de erros com `try/catch`

## Autora

Desenvolvido por Giovanna Barbosa de Carvalho como projeto de estudo de Node.js, Express, MySQL e modularização de APIs.
