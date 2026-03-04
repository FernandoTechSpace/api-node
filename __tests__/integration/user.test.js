import request from 'supertest'
import express from 'express'
import router from '../../src/router.js'
import errorHandler from '../../src/middlewares/ErrorHandler.js'
import { query } from '../../src/database/index.js'

const app = express()
app.use(express.json())
app.use(router)
app.use(errorHandler)

describe('User Controller Integration Tests', () => {
  // Limpar a tabela antes de cada teste para garantir isolamento
  beforeEach(async () => {
    await query('DELETE FROM usuarios')
  })

  // Limpar apos os testes
  afterAll(async () => {
    await query('DELETE FROM usuarios')
  })

  it('deve recusar a criacao de um usuario com payload vazio (Zod Error)', async () => {
    const response = await request(app).post('/usuarios').send({})

    expect(response.status).toBe(400)
    expect(response.body.status).toBe('erro_de_validacao')
    expect(response.body.erros).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ campo: 'nome' }),
        expect.objectContaining({ campo: 'cargo' })
      ])
    )
  })

  it('deve recusar a criacao de um usuario com nome muito curto', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'A',
      cargo: 'Dev'
    })

    expect(response.status).toBe(400)
    expect(response.body.erros[0].mensagem).toContain('pelo menos 3 caracteres')
  })

  it('deve recusar payload com campos nao permitidos devido ao strict()', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Fernando',
      cargo: 'Dev',
      admin: true // Campo invasor
    })

    expect(response.status).toBe(400)
    expect(response.body.erros[0].mensagem).toContain('Unrecognized key(s)')
  })

  it('deve criar um usuario com sucesso', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Fernando',
      cargo: 'Engenheiro de Software'
    })

    expect(response.status).toBe(201)
    expect(response.body.mensagem).toBe('usuario cadastrado com sucesso')
    expect(response.body.usuario).toHaveProperty('id')
    expect(response.body.usuario.nome).toBe('Fernando')
  })

  it('deve aplicar paginacao corretamente na listagem de usuarios', async () => {
    // Inserir 15 usuarios
    for (let i = 1; i <= 15; i++) {
      await request(app).post('/usuarios').send({
        nome: `User ${i}`,
        cargo: 'Tester'
      })
    }

    // Buscar primeira pagina com limite 10
    const responsePage1 = await request(app).get('/usuarios?page=1&limit=10')

    expect(responsePage1.status).toBe(200)
    expect(responsePage1.body.dados.length).toBe(10)
    expect(responsePage1.body.paginacao.page).toBe(1)
    expect(responsePage1.body.paginacao.total_retornado).toBe(10)

    // Buscar segunda pagina
    const responsePage2 = await request(app).get('/usuarios?page=2&limit=10')

    expect(responsePage2.status).toBe(200)
    expect(responsePage2.body.dados.length).toBe(5)
    expect(responsePage2.body.paginacao.page).toBe(2)
    expect(responsePage2.body.paginacao.total_retornado).toBe(5)
  })

  it('deve aplicar ordenacao previsivel e offsets consistentes', async () => {
    // A ordem dos itens retornado no request ?page=2&limit=1 não pode ser a mesma de 1 page
    await request(app).post('/usuarios').send({ nome: 'User A', cargo: 'Dev' })
    await request(app).post('/usuarios').send({ nome: 'User B', cargo: 'Dev' })

    const r1 = await request(app).get('/usuarios?page=1&limit=1')
    const r2 = await request(app).get('/usuarios?page=2&limit=1')

    expect(r1.body.dados[0].id).not.toBe(r2.body.dados[0].id)
  })

  it('deve retornar 404 ao tentar atualizar usuario inexistente', async () => {
    const response = await request(app).put('/usuarios/123e4567-e89b-12d3-a456-426614174000').send({
      nome: 'Inexistente',
      cargo: 'Fantasma'
    })

    expect(response.status).toBe(404)
    expect(response.body.erro).toBe('usuario nao encontrado')
  })

  it('deve retornar 400 se o ID for um uuid invalido na atualizacao', async () => {
    const response = await request(app).put('/usuarios/123-id-invalido').send({
      nome: 'Invalido',
      cargo: 'Hacker'
    })

    expect(response.status).toBe(400)
    // O erro sera retornado pelo Zod Validation no validateId
  })

  it('deve retornar 409 ao violar a unique constraint (nome duplicado)', async () => {
    // Insere o primeiro usuario
    await request(app).post('/usuarios').send({
      nome: 'Senhor Unico',
      cargo: 'VIP'
    })

    // Tenta inserir outro com o mesmo nome
    const response = await request(app).post('/usuarios').send({
      nome: 'Senhor Unico',
      cargo: 'Impostor'
    })

    // Deve ser barrado pelo banco de dados (PG error 23505) mapeado como 409 Conflict
    expect(response.status).toBe(409)
    expect(response.body.status).toBe('erro_de_conflito')
  })
})
