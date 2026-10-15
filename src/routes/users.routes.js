// Importa o Express para criar o agrupador de rotas da aplicação.
const express = require('express');

// Importa os controllers responsáveis pela lógica das operações de usuários.
const userControllers = require('../controllers/users.controllers');

// Cria um Router para definir os endpoints relacionados aos usuários.
const routes = express.Router();

// Importa o middleware que verifica os resultados das validações.
const validate = require('../middlewares/validate.middlewares');

// Importa os conjuntos de validações utilizados em cada endpoint.
const userValidators = require('../validators/user.validators');

//Definindo as rotas e chamando os controllers responsáveis por cada ação
routes.post(
    '/',
    userValidators.postUserValidation, // Define e executa as regras de validação.
    validate, // Verifica se as regras produziram erros.
    userControllers.postUser // Executa o controller se os dados forem válidos.
);

routes.get(
    '/',
    userValidators.getUsersValidation,
    validate,
    userControllers.getUsers
);

routes.get(
    '/is_active/:active',
    userValidators.getUsersByActiveValidation,
    validate,
    userControllers.getUsersByActive
);

routes.get(
    '/search/',
    userValidators.SearchUsersValidation,
    validate,
    userControllers.searchUsers
);

routes.get(
    '/:id',
    userValidators.getUserByIdValidation,
    validate,
    userControllers.getUserById
);

routes.put(
    '/:id',
    userValidators.putUserValidation,
    validate,
    userControllers.putUser
);

routes.delete(
    '/:id',
    userValidators.deleteUserValidation,
    validate,
    userControllers.deleteUser
);

module.exports = routes; //Exportando o módulo de rotas