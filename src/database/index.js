import pg from 'pg'

const { Pool } = pg

// agora as credenciais vem do process.env
// isso mantem as senhas seguras e fora do codigo fonte
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

export async function query (textoSql, parametros) {
  const resultado = await pool.query(textoSql, parametros)
  return resultado
}
