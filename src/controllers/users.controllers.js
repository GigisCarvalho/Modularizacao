// Importa o pool de conexões MySQL responsável pela comunicação com o banco de dados.
const pool = require('../config/db.config.js'); 

// Funçôes assíncrona que lidam os usuários no banco de dados MySQL e retorna os resultados em formato JSON, utilizando o pool de conexões importado do arquivo db.config.js:

async function getUsers(req, res) {   
    try {
        // Obtém os parâmetros de paginação enviados pela URL.
        const page = Number.parseInt(req.query.page ?? "1", 10); 
        const limit = Number.parseInt(req.query.limit ?? "10", 10);

        // Consulta a quantidade total de usuários cadastrados.
        const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');

        if(rowsCount[0].count !== 0) {
            // Calcula a última página disponível com base na quantidade total de registros.
            var lastPage = Math.ceil(rowsCount[0].count / limit);
        }else {
            return res.status(404).json({ error: 'Nenhum usuário encontrado' });
        }

        if(page > lastPage){
            return res.status(404).json({ error: 'Esta página não encontrada' });
        }

        // Monta o objeto de paginação que será retornado para o cliente.
        var pagination = {
            page: page,
            limit: limit,
            totalRows: rowsCount[0].count,
            totalPages: lastPage,
            LastPage: page > 1 ? page - 1 : null,
            NextPage: page < lastPage ? page + 1 : null
        };
    
        // Busca apenas os registros da página solicitada.
        const [rows] = await pool.query('SELECT * FROM usuarios LIMIT ? OFFSET ?', [limit, (page * limit) - limit]);
        return res.status(200).json({users: rows, paginationConfig: pagination});

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar os usuários.'});
    }
};

async function getUsersByActive(req, res) {
    try{
        const { active } = req.params;

        // Obtém os parâmetros de paginação enviados pela URL.
        const page = Number.parseInt(req.query.page ?? "1", 10); 
        const limit = Number.parseInt(req.query.limit ?? "10", 10);

        // Consulta a quantidade total de usuários cadastrados.
        const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios WHERE ativo = ?', [active]);

        if(rowsCount[0].count !== 0) {
            // Calcula a última página disponível com base na quantidade total de registros.
            var lastPage = Math.ceil(rowsCount[0].count / limit);
        }else {
            return res.status(404).json({ error: 'Nenhum usuário encontrado' });
        }

        if(page > lastPage){
            return res.status(404).json({ error: 'Esta página não encontrada' });
        }

        // Monta o objeto de paginação que será retornado para o cliente.
        var pagination = {
            page: page,
            limit: limit,
            totalRows: rowsCount[0].count,
            totalPages: lastPage,
            LastPage: page > 1 ? page - 1 : null,
            NextPage: page < lastPage ? page + 1 : null
        };
        
        // Busca apenas os registros da página solicitada.
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE ativo = ? LIMIT ? OFFSET ?', [active, limit, (page * limit) - limit]);
        return res.status(200).json({users: rows, paginationConfig: pagination});

    }catch (error) {
        return res.status(500).json({ error: 'Erro ao listar os usuários.'});
    };
};

async function getUserById(req, res) {
    try{
        const { id } = req.params;

        // Executa a consulta pelo ID informado.
        const [row] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if(row.length === 0){
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return res.status(200).json(row[0])

    }catch(error){
        return res.status(500).json({error: 'Erro ao buscar usuário.'})
    }
};

async function searchUsers(req, res) {
    try{
        // Obtém os parâmetros de paginação enviados pela URL.
        const page = Number.parseInt(req.query.page ?? "1", 10);
        const limit = Number.parseInt(req.query.limit ?? "10", 10);

        const { nome, email } = req.body;
        
        if(nome === undefined  && email === undefined){
            return res.status(400).json({ error: 'Pesquisa inválida: Informe parcialmente o nome e/ou email para realizar a consulta.' });
        }
        else {

            // Define filtros vazios caso os campos não tenham sido enviados.
            const nomeFiltro = nome ?? '';
            const emailFiltro = email ?? '';

            // Conta quantos usuários correspondem aos filtros informados.
            const [rowsCount] = await pool.query('SELECT COUNT(*) AS count FROM usuarios WHERE nome LIKE ? OR email LIKE ?', [`%${nomeFiltro}%`, `%${emailFiltro}%`])

            if (rowsCount[0].count !== 0){
                // Calcula a última página disponível com base na quantidade total de registros.
                var lastPage = Math.ceil(rowsCount[0].count / limit);
            } else {
                return res.status(404).json({ error: 'Nenhum usuário encontrado' });
            }

            if(page > lastPage){
                return res.status(404).json({ error: 'Esta página não encontrada' });
            }

            // Monta o objeto de paginação que será retornado para o cliente.
            var pagination = {
                page: page,
                limit: limit,
                totalRows: rowsCount[0].count,
                totalPages: lastPage,
                LastPage: page > 1 ? page - 1 : null,
                NextPage: page < lastPage ? page + 1 : null
            };

            // Busca apenas os registros da página solicitada.
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE nome LIKE ? OR email LIKE ? LIMIT ? OFFSET ?', [`%${nomeFiltro}%`, `%${emailFiltro}%`, limit, (page * limit) - limit]);
            return res.status(200).json({users:rows, paginationConfig: pagination})
        }
    } catch(error){
        return res.status(500).json({error: 'Erro ao buscar usuário'})
    }
    
};

async function postUser(req, res) {
    try{
        const { nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo } = req.body;

        // Insere o novo usuário na tabela usuarios.
        const [result] = await pool.query("INSERT INTO usuarios (nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		  [nome, email, telefone, data_nascimento, cidade, estado, cargo, ativo]
		);

        // Retorna os dados básicos do usuário recém-criado.
        return res.status(201).json({ id: result.insertId, nome, email });

    } catch (error) {
        return res.status(500).json({error: 'Erro ao criar usuário.', details: error.message});
    } 
}

async function putUser(req, res) {
    try {
        const { id } = req.params;

        const { email, telefone, cargo, ativo } = req.body;

        if(email === undefined && telefone === undefined && cargo === undefined && ativo === undefined ){
            return res.status(400).json({ error: 'Atualização inválida: Informe o email, telefone, cargo ou ativo.' });
        }

        if(email){
            // Verifica se existe outro usuário utilizando o mesmo email.
            const [row] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND id <> ?', [email, id]);
            
            if(row.length > 0){
                return res.status(409).json({ error: 'Atualização inválida: O email informado já está em uso.' });
            }
        }
        
        if(telefone){
            // Verifica se existe outro usuário utilizando o mesmo telefone.
            const [row] = await pool.query('SELECT * FROM usuarios WHERE telefone = ? AND id <> ?', [telefone, id]);
            if(row.length > 0){
                return res.status(409).json({ error: 'Atualização inválida: O telefone informado já está em uso.' });
            }
        }

        // Atualiza somente os campos informados utilizando COALESCE.
        const [result] = await pool.query('UPDATE usuarios SET email = COALESCE(?, email), telefone = COALESCE(?, telefone), cargo = COALESCE(?, cargo), ativo = COALESCE(?, ativo) WHERE id = ?', [email ?? null, telefone ?? null, cargo ?? null, ativo ?? null, id])

        //confere se algum usuário foi atualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Usuário não encontrado.'});
        }

        return  res.status(200).json({ mensagem: "Atualizado com sucesso" });

    } catch(error){
        return res.status(500).json({error: 'Erro ao atualizar usuário'});
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        // Remove o usuário correspondente ao ID informado.
        const [result] = await pool.query( 'DELETE FROM usuarios WHERE id = ?',[id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Usuário não encontrado.'});
        }

        return  res.status(200).json({ mensagem: "Removido com sucesso" });

    } catch(error){
        return res.status(500).json({error: 'Erro ao remover usuário'});
    }
}

module.exports = { getUsers, getUsersByActive, getUserById, searchUsers, postUser, putUser, deleteUser}; // Exportando as funções para serem utilizadas em outros arquivos do projeto