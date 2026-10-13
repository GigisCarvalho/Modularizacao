const dotenv = require("dotenv");
dotenv.config(); // Carregando variáveis de ambiente a partir do arquivo .env. A ordem de execução é importante, pois as variáveis de ambiente precisam ser carregadas antes de serem utilizadas em outros arquivos.

const express = require('express');
const cors = require("cors");
const userRoutes = require('./routes/users.routes'); // Importando as rotas definidas no arquivo users.routes.js, que contém as rotas relacionadas aos usuários da aplicação.

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(userRoutes); // Adicionando as rotas de usuários à aplicação Express, permitindo que as requisições HTTP sejam direcionadas para as funções correspondentes definidas no arquivo users.routes.js.

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});