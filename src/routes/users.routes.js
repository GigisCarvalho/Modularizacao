const express = require('express');
const userControllers = require('../controllers/users.controllers');// Importando a função getUsers do arquivo users.controllers.js
const routes = express.Router(); // Criando um objeto Router do Express para definir as rotas da aplicação
const validate = require('../middlewares/validate.middlewares');
const userValidators = require('../validators/user.validators');

//Definindo as rotas e chamando os controllers responsáveis por cada ação
routes.post('/', userValidators.postUserValidation, validate, userControllers.postUser);
routes.get('/', userValidators.getUsersValidation, validate, userControllers.getUsers);
routes.get('/is_active/:active', userValidators.getUsersByActiveValidation, validate, userControllers.getUsersByActive);
routes.get('/search/', userValidators.SearchUsersValidation, validate, userControllers.SearchUsers);
routes.get('/:id', userValidators.getUserByIdValidation, validate, userControllers.getUserById);
routes.put('/:id', userValidators.putUserValidation, validate, userControllers.putUser);
routes.delete('/:id', userValidators.deleteUserValidation, validate, userControllers.deleteUser);

module.exports = routes; //Exportando o módulo de rotas