// Importa a função que reúne os resultados das validações executadas pelo express-validator.
const { validationResult } = require('express-validator');

/* 
    Este middleware deve ser executado depois dos validadores da rota.
    Se houver erros, interrompe a requisição e retorna o status 400.
    Caso contrário, chama next() para continuar para o controller.
*/

function validate(req, res, next) {
    // Coleta os resultados das validações executadas anteriormente na requisição.
    const errors = validationResult(req);

    // Interrompe a requisição caso exista pelo menos um erro de validação.
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // Encaminha a requisição ao próximo passo, o controller.
    next();
}

// Exporta o middleware para utilização nas rotas da aplicação.
module.exports = validate;