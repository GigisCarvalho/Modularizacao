const { body, param, query } = require ('express-validator');
const pool = require('../config/db.config.js'); 

const postUserValidation = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('O nome é obrigatório.')
        .bail()
        .isLength({ min:3, max: 255 })
        .withMessage('O nome deve possuir ao menos 3 caracteres'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('O email é obrigatório.')
        .bail()
        .isLength({ min:6, max: 255 })
        .withMessage('O email deve possuir ao menos 6 caracteres')
        .bail()
        .isEmail()
        .withMessage('Email inválido')      
        .bail()  
        .custom(async (value) => {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [value]);

            if (rows.length > 0) {
                throw new Error('O email informado já está em uso.');
            }

            return true;
        }),

    body('telefone')
        .trim()
        .notEmpty()
        .withMessage('O telefone é obrigatório.')
        .bail()
        .isNumeric()
        .withMessage('O telefone deve ser formado apenas por números')
        .bail()
        .isLength({ min:11, max:11})
        .withMessage('O telefone deve possuir 11 caracteres')
        .bail()
        .custom(async (value) => {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE telefone = ?', [value]);

            if (rows.length > 0) {
                throw new Error('O telefone informado já está em uso.');
            }

            return true;
        }),
    
        body('data_nascimento')
            .trim()
            .notEmpty()
            .withMessage('A data de nascimento é obrigatória.')
            .bail()
            .isDate()
            .withMessage('Data inválida'),

        body('cidade')
            .trim()
            .notEmpty()
            .withMessage('A cidade é obrigatória')
            .bail()
            .isLength({ min: 5, max: 255 })
            .withMessage('A cidade deve possuir ao menos 5 caracteres'),

        body('estado')
            .trim()
            .notEmpty()
            .withMessage('O estado é obrigatório')
            .bail()
            .isLength({min: 2, max:2})
            .withMessage('O estado deve possuir 2 caracteres'),

        body('cargo')
            .trim()
            .notEmpty()
            .withMessage('O cargo é obrigatório')
            .bail()
            .isLength({ min: 5, max: 255 })
            .withMessage('O cargo deve possuir ao menos 5 caracteres'),
        
        body('ativo')
            .trim()
            .notEmpty()
            .withMessage('O ativo é obrigatório')
            .bail()
            .isInt({ min: 0, max: 1 })
            .withMessage('O ativo deve ser um boleano: 1 ou 0')

];

const getUsersValidation = [ 
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),

    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.'),
];

const getUsersByActiveValidation = [
    param('active')
        .trim()
        .isInt({ min: 0, max: 1 })
        .withMessage('O ativo deve ser um boleano: 1 ou 0'),

    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),

    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.')

];

const getUserByIdValidation = [
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que ')
]

const SearchUsersValidation = [
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage('A página deve ser um número inteiro maior que zero.'),

    query('limit')
        .optional()
        .isInt({min: 5})
        .withMessage('O limite deve ser um número inteiro maior que 4.'),

    body().custom((value) => {
        if (!value || Object.keys(value).length === 0) {
            throw new Error(
                'Pesquisa inválida: Informe parcialmente o nome e/ou email para realizar a consulta.'
            );
        }

        return true;
    }),

    body('nome')
        .optional()
        .trim()
        .isLength({ min:3, max: 255 })
        .withMessage('O nome deve possuir ao menos 3 caracteres'),

    body('email')
        .optional()
        .trim()
        .isLength({ min:6, max: 255 })
        .withMessage('O email deve possuir ao menos 6 caracteres')
        .bail()
        .isEmail()
        .withMessage('Email inválido'),
]

const putUserValidation = [
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que ')
        .bail()
        .custom(async (value) => {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [value]);

            if(rows.length === 0) {
                throw new Error({ erro: "Usuário não encontrado" });
            }

            return true;
        }),

    body().custom((value) => {
        if (!value || Object.keys(value).length === 0) {
            throw new Error(
                'Atualização inválida: informe email, telefone, cargo ou ativo.'
            );
        }

        return true;
    }),

    body('email')
        .optional()
        .trim()
        .isLength({ min:6, max: 255 })
        .withMessage('O email deve possuir ao menos 6 caracteres')
        .bail()
        .isEmail()
        .withMessage('Email inválido'),

    body('telefone')
        .optional()
        .trim()
        .isNumeric()
        .withMessage('O telefone deve ser formado apenas por números')
        .bail()
        .isLength({ min:11, max:11})
        .withMessage('O telefone deve possuir 11 caracteres'),

    body('cargo')
        .optional()
        .trim()
        .isLength({ min: 5, max: 255 })
        .withMessage('O cargo deve possuir ao menos 5 caracteres'),
    
    body('ativo')
        .optional()
        .trim()
        .isInt({ min: 0, max: 1 })
        .withMessage('O ativo deve ser um boleano: 1 ou 0')

]

const deleteUserValidation = [
    param('id')
        .trim()
        .isInt({min:1})
        .withMessage('O id deve ser um número inteiro maior que ')

]

module.exports = { postUserValidation, getUsersValidation, getUsersByActiveValidation, getUserByIdValidation, SearchUsersValidation, putUserValidation, deleteUserValidation };