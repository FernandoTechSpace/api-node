import pg from 'pg'

const { Pool } = pg

// ─────────────────────────────────────────────
// Pool de conexões com o PostgreSQL
// Credenciais são injetadas via variáveis de ambiente (nunca hardcode)
// Timeouts configurados para evitar conexões penduradas indefinidamente
// ─────────────────────────────────────────────
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Tempo máximo para aguardar uma conexão disponível no pool
  connectionTimeoutMillis: 5000,
  // Tempo máximo que uma conexão ociosa permanece ativa no pool
  idleTimeoutMillis: 10000,
  // Máximo de conexões simultâneas (ajustar conforme capacidade do servidor PG)
  max: 10
})

// Evento de erro no pool para evitar crash silencioso (defensive programming)
pool.on('error', (erro) => {
  console.error('[DB Pool Error] Conexão inesperadamente encerrada:', erro.message)
})

export async function query (textoSql, parametros) {
  const resultado = await pool.query(textoSql, parametros)
  return resultado
}
