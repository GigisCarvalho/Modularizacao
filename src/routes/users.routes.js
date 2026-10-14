const express = require('express');
const { getUsers, getUsersByActive, getUserById, SearchUsers, postUser, putUser, deleteUser } = require('../controllers/users.controllers');// Importando a função getUsers do arquivo users.controllers.js
const routes = express.Router(); // Criando um objeto Router do Express para definir as rotas da aplicação

//Definindo as rotas e chamando os controllers responsáveis por cada ação
routes.post('/', postUser);
routes.get('/', getUsers);
routes.get('/is_active/:active', getUsersByActive);
routes.get('/search/', SearchUsers);
routes.get('/:id', getUserById);
routes.put('/:id', putUser);
routes.delete('/:id', deleteUser)

module.exports = routes; //Exportando o módulo de rotas