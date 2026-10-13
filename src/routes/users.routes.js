const express = require('express');
const { getUsers } = require('../controllers/users.controllers');// Importando a função getUsers do arquivo users.controllers.js
const routes = express.Router(); // Criando um objeto Router do Express para definir as rotas da aplicação

routes.get('/', getUsers); // Definindo uma rota GET na raiz ('/') que chama a função getUsers quando acessada

module.exports = routes;