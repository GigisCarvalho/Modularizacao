// Importando o pool de conexões com o banco de dados MySQL a partir do arquivo db.config.js, permitindo que as consultas ao banco de dados sejam feitas de forma eficiente e reutilizável.
const pool = require('../config/db.config.js'); 
const { search } = require('../routes/users.routes.js');

// Funçôes assíncrona que lidam os usuários no banco de dados MySQL e retorna os resultados em formato JSON, utilizando o pool de conexões importado do arquivo db.config.js.
async function getUsers(req, res) { 
    
    try {
        const page = Number.parseInt(req.query.page ?? "1", 10); 
        const limit = Number.parseInt(req.query.limit ?? "10", 10);

        const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');

        if(rowsCount[0].count !== 0) {
            var lastPage = Math.ceil(rowsCount[0].count / limit);
        }else {
            return res.status(404).json({ error: 'Nenhum usuário encontrado' });
        }

        if(page > lastPage){
            return res.status(404).json({ error: 'Esta página não encontrada' });
        }

        var pagination = {
            page: page,
            limit: limit,
            totalRows: rowsCount[0].count,
            totalPages: lastPage,
            LastPage: page > 1 ? page - 1 : null,
            NextPage: page < lastPage ? page + 1 : null
        };
    
        const [rows] = await pool.query('SELECT * FROM usuarios LIMIT ? OFFSET ?', [limit, (page * limit) - limit]);
        return res.json({users: rows, paginationConfig: pagination});
    } catch (e) {
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

async function getUsersByActive(req, res) {
    try{
        const active = req.query.active;
        console.log(active)

        if(active == 1 || active == 0){

            const page = Number.parseInt(req.query.page ?? "1", 10); 
            const limit = Number.parseInt(req.query.limit ?? "10", 10);

            const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios WHERE ativo = ?', [active]);

            if(rowsCount[0].count !== 0) {
                var lastPage = Math.ceil(rowsCount[0].count / limit);
            }else {
                return res.status(404).json({ error: 'Nenhum usuário encontrado' });
            }

            if(page > lastPage){
                return res.status(404).json({ error: 'Esta página não encontrada' });
            }

            var pagination = {
                page: page,
                limit: limit,
                totalRows: rowsCount[0].count,
                totalPages: lastPage,
                LastPage: page > 1 ? page - 1 : null,
                NextPage: page < lastPage ? page + 1 : null
            };
            
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE ativo = ? LIMIT ? OFFSET ?', [active, limit, (page * limit) - limit]);
            return res.json({users: rows, paginationConfig: pagination});
        }
        else{
            return res.status(400).json({erro: 'O ativo informado na URL é inválido'})
        }

    }catch (e) {
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
    
};

async function getUserById(req, res) {
    try{
        const { id } = req.params;

        const [row] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return res.json(row)

    }catch(e){
        return res.status(500).json({error: 'Erro interno no servidor'})
    }
};

async function SearchUsers(req, res) {
    try{
        const page = Number.parseInt(req.query.page ?? "1", 10);
        const limit = Number.parseInt(req.query.limit ?? "10", 10);

        const { nome, email } = req.body;
        

        if (nome || email){

            const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios WHERE nome LIKE ? OR email LIKE ?', [`%${nome}%`, `%${email}%`])

            if (rowsCount[0].count !== 0){
                var lastPage = Math.ceil(rowsCount[0].count / limit);
            } else {
                return res.status(404).json({ error: 'Nenhum usuário encontrado' });
            }

            if(page > lastPage){
                return res.status(404).json({ error: 'Esta página não encontrada' });
            }

            var pagination = {
                page: page,
                limit: limit,
                totalRows: rowsCount[0].count,
                totalPages: lastPage,
                LastPage: page > 1 ? page - 1 : null,
                NextPage: page < lastPage ? page + 1 : null
            };
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE nome LIKE ? OR email LIKE ? LIMIT ? OFFSET ?', [`%${nome}%`, `%${email}%`, limit, (page * limit) - limit]);
            return res.json({Users:rows, paginationConfig: pagination})
        }
    } catch(e){
        return res.status(500).json({error: 'Erro interno no servidor'})
    }
    
};

async function postUser(req, res) {
    try{
        const { nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo } = req.body;
        const [result] = await pool.query("INSERT INTO usuarios (nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		  [nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo]
		);

        return res.status(201).json(result)

    } catch(e){
        return res.status(500).json({error: 'Erro interno no servidor'})
    }   
}

async function putUser(req, res) {
    try {
        const { id } = req.params;
        const { email, telefone, cargo, ativo } = req.body;

        const [result] = await pool.query('UPDATE usuarios SET email = COALESCE(?, email), telefone = COALESCE(?, telefone), cargo = COALESCE(?, cargo), ativo = COALESCE(?, ativo) WHERE id = ?', [email || null, telefone || null, cargo || null, ativo || null, id])

        if(!result.affectedRows){
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return  res.json({ mensagem: "Atualizado com sucesso" });

    } catch(e){
        return res.status(500).json({error: 'Erro interno no servidor'});
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id])

        if(!result.affectedRows){
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return  res.json({ mensagem: "Removido com sucesso" });

    } catch(e){
        return res.status(500).json({error: 'Erro interno no servidor'});
    }
}

module.exports = { getUsers, getUsersByActive, getUserById, SearchUsers, postUser, putUser, deleteUser}; // Exportando as funções para serem utilizadas em outros arquivos do projeto