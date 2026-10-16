// Importa os validadores para campos enviados pelo body, parâmetros da rota e query string.
const { body, param, query } = require ('express-validator');

// Importa o pool de conexões MySQL para validações que consultam o banco de dados.
const pool = require('../config/db.config.js'); 

const postUserValidation = [
    // Valida o nome do usuário.
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .bail()
        .isLength({ min:3, max: 255 })
        .withMessage('O nome deve possuir ao menos 3 caracteres.')
        .bail()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve possuir apenas letras.'),
        
    // Valida o formato e a disponibilidade do e-mail.
    body('email')
        .trim()
        .notEmpty()
        .withMessage('O email é obrigatório.')
        .bail()
        .isLength({ min:6, max: 255 })
        .withMessage('O email deve possuir ao menos 6 caracteres.')
        .bail()
        .isEmail()
        .withMessage('Email inválido.')      
        .bail()  
        .custom(async (value) => {
            // Consulta se o e-mail informado já pertence a outro usuário.
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [value]);

            // Rejeita o cadastro quando o e-mail já está cadastrado.
            if (rows.length > 0) {
                throw new Error('O email informado já está em uso.');
            }

            // Indica que a validação personalizada foi concluída com sucesso.
            return true;
        }),

    // Valida o formato e a disponibilidade do telefone.
    body('telefone')
        .trim()
        .notEmpty()
        .withMessage('O telefone é obrigatório.')
        .bail()
        .isInt({min: 1})
        .withMessage('O telefone deve ser formado apenas por números.')
        .bail()
        .isLength({ min:11, max:11})
        .withMessage('O telefone deve possuir 11 caracteres.')
        .bail()
        .custom(async (value) => {
            // Consulta se o telefone informado já pertence a outro usuário.
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE telefone = ?', [value]);

            // Rejeita o cadastro quando o telefone já está cadastrado.
            if (rows.length > 0) {
                throw new Error('O telefone informado já está em uso.');
            }

            return true;
        }),
    
    // Valida a data de nascimento.
    body('data_nascimento')
        .trim()
        .notEmpty()
        .withMessage('A data de nascimento é obrigatória.')
        .bail()
        .isDate()
        .withMessage('Data inválida.'),

    // Valida a cidade do usuário.
    body('cidade')
        .trim()
        .notEmpty()
        .withMessage('A cidade é obrigatória.')
        .bail()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('A cidade deve possuir apenas letras.')
        .bail()
        .isLength({ min: 5, max: 255 })
        .withMessage('A cidade deve possuir ao menos 5 caracteres.'),

    // Valida a sigla do estado.
    body('estado')
        .trim()
        .notEmpty()
        .withMessage('O estado é obrigatório.')
        .bail()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O estado deve possuir apenas letras.')
        .bail()
        .isLength({min: 2, max:2})
        .withMessage('O estado deve possuir 2 caracteres.'),

    // Valida o cargo do usuário.
    body('cargo')
        .trim()
        .notEmpty()
        .withMessage('O cargo é obrigatório.')
        .bail()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O cargo deve possuir apenas letras.')
        .bail()
        .isLength({ min: 5, max: 255 })
        .withMessage('O cargo deve possuir ao menos 5 caracteres.'),
    
    // Aceita somente 0 para inativo ou 1 para ativo.
    body('ativo')
        .trim()
        .notEmpty()
        .withMessage('O ativo é obrigatório.')
        .bail()
        .isInt({ min: 0, max: 1 })
        .withMessage('O ativo deve ser um boleano: 1 ou 0.')

];

const getUsersValidation = [ 
    // Valida o número da página quando ele for enviado.
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),
    
    // Valida a quantidade mínima de registros por página.
    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.'),
];

const getUsersByActiveValidation = [
    // Valida o status recebido como parâmetro da rota.
    param('active')
        .trim()
        .isInt({ min: 0, max: 1 })
        .withMessage('O ativo deve ser um boleano: 1 ou 0.'),

    // Valida a página solicitada.
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),

    // Valida a quantidade de registros por página.
    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.')

];

const getUserByIdValidation = [
    //Valida o ID usado na consulta de um único usuário.
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que zero.')
]

const SearchUsersValidation = [
    // Valida a página solicitada.
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),

    // Valida a quantidade de registros por página.
    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.'),

    // Verifica se o body existe e possui pelo menos um campo.
    body().custom((value) => {
        if (!value || Object.keys(value).length === 0) {
            throw new Error(
                'Pesquisa inválida: Informe parcialmente o nome e/ou email para realizar a consulta.'
            );
        }

        return true;
    }),

    // Valida o nome somente quando ele for enviado.
    body('nome')
        .optional()
        .trim()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve possuir apenas letras.'),

    // Valida o e-mail somente quando ele for enviado.
    body('email')
        .optional()
        .trim()
]

const putUserValidation = [
    // Valida o ID recebido pela rota.
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que zero.')
        .bail()
        .custom(async (value) => {
            // Verifica se existe um usuário com o ID informado.
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [value]);

            // Impede a atualização de um usuário inexistente.
            if(rows.length === 0) {
                throw new Error('Usuário não encontrado.');
            }

            return true;
        }),

    // Impede que a atualização seja executada com o body vazio.
    body().custom((value) => {
        if (!value || Object.keys(value).length === 0) {
            throw new Error(
                'Atualização inválida: informe email, telefone, cargo ou ativo.'
            );
        }

        return true;
    }),

    // Valida o novo e-mail quando ele for enviado.
    body('email')
        .optional()
        .trim()
        .isLength({ min:6, max: 255 })
        .withMessage('O email deve possuir ao menos 6 caracteres.')
        .bail()
        .isEmail()
        .withMessage('Email inválido.'),

    // Valida o novo telefone quando ele for enviado.
    body('telefone')
        .optional()
        .trim()
        .isNumeric()
        .withMessage('O telefone deve ser formado apenas por números.')
        .bail()
        .isLength({ min:11, max:11})
        .withMessage('O telefone deve possuir 11 caracteres.'),

    // Valida o novo cargo quando ele for enviado.
    body('cargo')
        .optional()
        .trim()
        .isLength({ min: 5, max: 255 })
        .withMessage('O cargo deve possuir ao menos 5 caracteres.')
        .bail()
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O cargo deve possuir apenas letras.'),

    // Valida o novo ativo quando ele for enviado.
    body('ativo')
        .optional()
        .trim()
        .isInt({ min: 0, max: 1 })
        .withMessage('O ativo deve ser um boleano: 1 ou 0.')

]

const deleteUserValidation = [
    // Valida o ID recebido pela rota.
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que zero.')

]

module.exports = { postUserValidation, getUsersValidation, getUsersByActiveValidation, getUserByIdValidation, SearchUsersValidation, putUserValidation, deleteUserValidation };