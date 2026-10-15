# Modularização de API de Usuários com Node.js e MySQL

Projeto de estudo desenvolvido para praticar a modularização de uma API com Node.js.

A aplicação separa as responsabilidades entre configurações, rotas, controladores, validadores e middlewares. A API realiza operações de CRUD em usuários e oferece paginação, pesquisa por nome ou e-mail, filtro por status e validação dos dados recebidos.

## Tecnologias utilizadas

- Node.js
- Express
- Express-validator
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
- Validar body, parâmetros de rota e query parameters
- Verificar e-mail e telefone duplicados
- Configurar o banco de dados por variáveis de ambiente
- Retornar respostas com status HTTP

## Validações

A API utiliza o `express-validator` para validar e sanitizar os dados antes que eles sejam processados pelos controladores.

Entre as validações aplicadas estão:

- Verificação de campos obrigatórios
- Remoção de espaços no início e no final dos textos
- Validação do formato de e-mail
- Verificação de e-mail já cadastrado
- Validação de telefone com exatamente 11 dígitos
- Verificação de telefone já cadastrado
- Validação da data de nascimento
- Validação do tamanho mínimo e máximo dos campos
- Validação do estado com exatamente dois caracteres
- Validação do status ativo, aceitando apenas `0` ou `1`
- Validação de IDs inteiros maiores que zero
- Validação dos parâmetros de paginação
- Validação dos campos permitidos na atualização parcial

Quando uma validação falha, a requisição não chega ao controller. O middleware retorna os erros encontrados com o status `400 Bad Request`.

Exemplo de resposta de validação:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "email-invalido",
      "msg": "Email inválido",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## Estrutura do projeto

```text
Modularizacao/
├── src/
│   ├── config/
│   │   └── db.config.js
│   ├── controllers/
│   │   └── users.controllers.js
│   ├── middlewares/
│   │   └── validate.middlewares.js
│   ├── routes/
│   │   └── users.routes.js
│   ├── validators/
│   │   └── user.validators.js
│   └── index.js
├── .env.example
├── .gitignore
├── dev_db.txt
├── package-lock.json
├── package.json
└── README.md
```

### Responsabilidade dos diretórios

- config: configuração da conexão com o banco de dados.
- controllers: regras de execução dos endpoints e consultas ao banco.
- middlewares: processamento intermediário das requisições.
- routes: definição dos endpoints e ligação entre validadores e controllers.
- validators: regras de validação e sanitização dos dados.
- index.js: configuração e inicialização do servidor Express.

## Fluxo da requisição

```text
Requisição
    ↓
Rota
    ↓
Regras do express-validator
    ↓
Middleware de validação
    ↓
Controller
    ↓
Banco de dados
    ↓
Resposta
```

Se uma validação falhar, o middleware retorna a resposta de erro e interrompe o fluxo antes que o controller seja executado.

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

- Node.js 18 ou superior
- MySQL
- npm
- express
- express-validator
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

Instale as dependências

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

Exemplos:

```text
GET /is_active/1
```

```text
GET /is_active/0?page=1&limit=10

```

### Pesquisar usuários

```http
GET /search/
```

Parâmetros:

```text
?nome=Ana
```

```text
?email=@gmail.com
```

Também é possível pesquisar utilizando os dois filtros:

```text
?nome=Ana&email=@gmail
```

Parâmetros opcionais:

```text
?page=1&limit=10
```

Exemplo completo:

```text
GET /search?nome=Ana&page=1&limit=10
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

O ID deve ser um número inteiro maior que zero.

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

Resposta de sucesso:

```JSON
{
  "id": 1,
  "nome": "Ana Souza",
  "email": "ana@email.com"
}
```

Status retornado:

```text
201 Created
```

### Atualizar usuário

```http
PUT /:id
```

A atualização aceita os campos `email`, `telefone`, `cargo` e `ativo`. Os campos não enviados permanecem com os valores atuais.
É necessário enviar pelo menos um campo permitido.

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

Resposta de sucesso:

```JSON
{
  "mensagem": "Removido com sucesso"
}
```

## Status HTTP utilizados
- 200 OK: consulta, atualização ou exclusão realizada com sucesso.
- 201 Created: usuário criado com sucesso.
- 400 Bad Request: dados ou parâmetros inválidos.
- 404 Not Found: usuário, registro ou página não encontrada.
- 409 Conflict: e-mail ou telefone já utilizado.
- 500 Internal Server Error: erro inesperado durante o processamento.

## Conceitos praticados

- Modularização de projetos Node.js
- Separação de responsabilidades
- Criação de API REST com Express
- Configuração de rotas
- Criação de controllers
- Criação de middlewares
- Validação e sanitização com Express Validator
- Validação de body, params e query
- Conexão com MySQL por pool de conexões
- Consultas SQL parametrizadas
- Prevenção básica de SQL Injection
- Paginação com LIMIT e OFFSET
- Atualização parcial com COALESCE
- Uso de variáveis de ambiente
- Tratamento de erros com try/catch
- Uso de status HTTP em APIs REST
- Exportação e importação de módulos com CommonJS

## Autora

Desenvolvido por Giovanna Barbosa de Carvalho como projeto de estudo de Node.js, Express, MySQL e modularização de APIs.
