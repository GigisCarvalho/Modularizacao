const pool = require('../config/db.config.js'); // Importando o pool de conexões com o banco de dados MySQL a partir do arquivo db.config.js, permitindo que as consultas ao banco de dados sejam feitas de forma eficiente e reutilizável.

    async function getUsers(req, res) { // Função assíncrona que busca todos os usuários no banco de dados MySQL e retorna os resultados em formato JSON, utilizando o pool de conexões importado do arquivo db.config.js.
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios');
            return res.json(rows);
        } catch (e) {
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    };

module.exports = { getUsers }; // Exportando a função getUsers para ser utilizada em outros arquivos do projeto
