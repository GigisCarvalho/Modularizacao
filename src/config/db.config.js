const mysql = require("mysql2/promise"); // Importando o módulo mysql2/promise para criar uma conexão com o banco de dados MySQL usando Promises

const pool = mysql.createPool({ // Criando um pool de conexões com o banco de dados MySQL usando as variáveis de ambiente definidas no arquivo .env
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool; // Exportando o pool de conexões para ser utilizado em outros arquivos do projeto, permitindo que as consultas ao banco de dados sejam feitas de forma eficiente e reutilizável.