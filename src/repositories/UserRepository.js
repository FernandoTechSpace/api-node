// importo a conexao nova
import { query } from '../database/index.js'
import { randomUUID } from 'node:crypto'

class UserRepository {
  // buscar todos
  async findAll (options = {}) {
    // inicia na query padrao
    let sql = 'SELECT * FROM usuarios'
    const valores = []

    // se tiver filtro de cargo, adiciono a condicao WHERE
    if (options.cargo) {
      sql += ' WHERE cargo = $1'
      valores.push(options.cargo)
    }

    // mando pro banco
    const resultado = await query(sql, valores)

    // o postgres devolve os dados dentro de .rows
    return resultado.rows
  }

  // buscar por id
  async findById (id) {
    const sql = 'SELECT * FROM usuarios WHERE id = $1'
    const resultado = await query(sql, [id])

    // retorno apenas o primeiro (ou undefined se nao achar)
    return resultado.rows[0]
  }

  // criar
  async create ({ nome, cargo }) {
    const id = randomUUID()

    // RETURNING * faz o postgres devolver o dado criado na mesma hora
    const sql = `
            INSERT INTO usuarios (id, nome, cargo)
            VALUES ($1, $2, $3)
            RETURNING *
        `

    const valores = [id, nome, cargo]

    const resultado = await query(sql, valores)

    return resultado.rows[0]
  }

  // atualizar
  async update (id, { nome, cargo }) {
    const sql = `
            UPDATE usuarios
            SET nome = $1, cargo = $2
            WHERE id = $3
            RETURNING *
        `

    const valores = [nome, cargo, id]

    const resultado = await query(sql, valores)

    return resultado.rows[0]
  }

  // deletar
  async delete (id) {
    const sql = 'DELETE FROM usuarios WHERE id = $1'

    await query(sql, [id])
  }
}

export default new UserRepository()
