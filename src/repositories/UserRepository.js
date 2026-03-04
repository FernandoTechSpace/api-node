// importo a conexao nova
import { query } from '../database/index.js'
import { randomUUID } from 'node:crypto'

// Colunas explícitas: evita expor campos internos não intencionais e
// melhora performance ao não transferir dados desnecessários do banco.
const COLUNAS = 'id, nome, cargo, data_cadastro'

class UserRepository {
  // buscar todos com paginação e contagem total
  async findAll (options = {}) {
    let sqlDados = `SELECT ${COLUNAS} FROM usuarios`
    let sqlContagem = 'SELECT COUNT(*) FROM usuarios'
    const valores = []
    let parametroAtual = 1

    // Filtro opcional por cargo
    if (options.cargo) {
      const where = ` WHERE cargo = $${parametroAtual}`
      sqlDados += where
      sqlContagem += where
      valores.push(options.cargo)
      parametroAtual++
    }

    // Ordenacao previsivel para garantir consistencia entre paginas
    sqlDados += ' ORDER BY data_cadastro ASC, id ASC'

    // LIMIT e OFFSET com bind parameters (seguro contra injeção)
    const limit = options.limit || 10
    const offset = options.offset || 0
    sqlDados += ` LIMIT $${parametroAtual} OFFSET $${parametroAtual + 1}`
    valores.push(limit, offset)

    // Executa as duas queries em paralelo para melhor performance
    const [resultadoDados, resultadoContagem] = await Promise.all([
      query(sqlDados, valores),
      query(sqlContagem, options.cargo ? [options.cargo] : [])
    ])

    return {
      dados: resultadoDados.rows,
      total: parseInt(resultadoContagem.rows[0].count, 10)
    }
  }

  // buscar por id
  async findById (id) {
    const sql = `SELECT ${COLUNAS} FROM usuarios WHERE id = $1`
    const resultado = await query(sql, [id])

    // retorno apenas o primeiro (ou undefined se nao achar)
    return resultado.rows[0]
  }

  // criar
  async create ({ nome, cargo }) {
    const id = randomUUID()

    // RETURNING com colunas explícitas — devolve apenas o que o cliente precisa
    const sql = `
      INSERT INTO usuarios (id, nome, cargo)
      VALUES ($1, $2, $3)
      RETURNING ${COLUNAS}
    `

    const resultado = await query(sql, [id, nome, cargo])
    return resultado.rows[0]
  }

  // atualizar
  async update (id, { nome, cargo }) {
    const sql = `
      UPDATE usuarios
      SET nome = $1, cargo = $2
      WHERE id = $3
      RETURNING ${COLUNAS}
    `

    const resultado = await query(sql, [nome, cargo, id])
    return resultado.rows[0]
  }

  // deletar
  async delete (id) {
    const sql = 'DELETE FROM usuarios WHERE id = $1'
    await query(sql, [id])
  }
}

export default new UserRepository()
