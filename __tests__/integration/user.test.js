import request from 'supertest'
import app from '../../src/app.js'
import { query, pool } from '../../src/database/index.js'

describe('User Controller — Integration Tests', () => {
  // Limpar a tabela antes de cada teste para garantir isolamento completo
  beforeEach(async () => {
    await query('DELETE FROM usuarios')
  })

  // ─── Encerra o pool após todos os testes para evitar que o Jest fique pendurado
  afterAll(async () => {
    await query('DELETE FROM usuarios')
    await pool.end()
  })

  // ─────────────────────────────────────────────
  // Smoke test: Health Check
  // ─────────────────────────────────────────────
  it('GET / deve retornar status 200 com mensagem da API', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('sucesso')
  })

  // ─────────────────────────────────────────────
  // Cenários de Validação de Input (Zod — HTTP 400)
  // ─────────────────────────────────────────────
  it('deve recusar payload vazio com erros detalhados por campo', async () => {
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

  it('deve recusar nome com menos de 3 caracteres', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'A',
      cargo: 'Tech Lead'
    })

    expect(response.status).toBe(400)
    expect(response.body.erros[0].mensagem).toContain('pelo menos 3 caracteres')
  })

  it('deve recusar um cargo fora do enum de valores validos', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Fernando',
      cargo: 'Invasor' // fora dos cargos permitidos
    })

    expect(response.status).toBe(400)
    expect(response.body.erros[0].mensagem).toContain('Invalid option: expected one of')
  })

  it('deve recusar payload com campos nao permitidos — strict()', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Fernando',
      cargo: 'Tech Lead',
      admin: true // campo invasor
    })

    expect(response.status).toBe(400)
    expect(response.body.status).toBe('erro_de_validacao')
  })

  it('deve retornar 400 ao usar UUID invalido na rota', async () => {
    const response = await request(app).put('/usuarios/nao-e-um-uuid').send({
      nome: 'Teste',
      cargo: 'DevOps'
    })

    expect(response.status).toBe(400)
  })

  // ─────────────────────────────────────────────
  // Cenários de Sucesso (HTTP 201 / 200 / 204)
  // ─────────────────────────────────────────────
  it('deve criar usuario com sucesso e retornar apenas colunas definidas', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Fernando',
      cargo: 'Engenheiro de Software'
    })

    expect(response.status).toBe(201)
    expect(response.body.mensagem).toBe('usuario cadastrado com sucesso')
    expect(response.body.usuario).toHaveProperty('id')
    expect(response.body.usuario).toHaveProperty('data_cadastro')
    expect(response.body.usuario.nome).toBe('Fernando')
  })

  it('deve aplicar paginacao com total_registros e total_paginas corretos', async () => {
    for (let i = 1; i <= 15; i++) {
      await request(app).post('/usuarios').send({
        nome: `User ${i}`,
        cargo: 'QA Engineer'
      })
    }

    const responsePage1 = await request(app).get('/usuarios?page=1&limit=10')

    expect(responsePage1.status).toBe(200)
    expect(responsePage1.body.dados.length).toBe(10)
    expect(responsePage1.body.paginacao.page).toBe(1)
    expect(responsePage1.body.paginacao.total_registros).toBe(15)
    expect(responsePage1.body.paginacao.total_paginas).toBe(2)

    const responsePage2 = await request(app).get('/usuarios?page=2&limit=10')

    expect(responsePage2.status).toBe(200)
    expect(responsePage2.body.dados.length).toBe(5)
  })

  it('deve garantir ordenacao previsivel entre paginas distintas', async () => {
    await request(app).post('/usuarios').send({ nome: 'User A', cargo: 'Designer' })
    await request(app).post('/usuarios').send({ nome: 'User B', cargo: 'Designer' })

    const r1 = await request(app).get('/usuarios?page=1&limit=1')
    const r2 = await request(app).get('/usuarios?page=2&limit=1')

    expect(r1.body.dados[0].id).not.toBe(r2.body.dados[0].id)
  })

  it('deve atualizar usuario com sucesso', async () => {
    const criacao = await request(app).post('/usuarios').send({
      nome: 'Fernando Original',
      cargo: 'Desenvolvedor Backend'
    })
    const { id } = criacao.body.usuario

    const atualizacao = await request(app).put(`/usuarios/${id}`).send({
      nome: 'Fernando Atualizado',
      cargo: 'Tech Lead'
    })

    expect(atualizacao.status).toBe(200)
    expect(atualizacao.body.usuario.nome).toBe('Fernando Atualizado')
    expect(atualizacao.body.usuario.cargo).toBe('Tech Lead')
  })

  it('deve deletar usuario com sucesso e retornar 204', async () => {
    const criacao = await request(app).post('/usuarios').send({
      nome: 'Para Deletar',
      cargo: 'Estagiário'
    })
    const { id } = criacao.body.usuario

    const delecao = await request(app).delete(`/usuarios/${id}`)
    expect(delecao.status).toBe(204)

    // Verifica que o usuario realmente nao existe mais
    const busca = await request(app).put(`/usuarios/${id}`).send({
      nome: 'Fantasma',
      cargo: 'DevOps'
    })
    expect(busca.status).toBe(404)
  })

  // ─────────────────────────────────────────────
  // Cenários de Erro de Negócio (HTTP 404 / 409)
  // ─────────────────────────────────────────────
  it('deve retornar 404 ao atualizar usuario inexistente', async () => {
    const response = await request(app).put('/usuarios/123e4567-e89b-12d3-a456-426614174000').send({
      nome: 'Inexistente',
      cargo: 'Product Manager'
    })

    expect(response.status).toBe(404)
    expect(response.body.erro).toBe('usuario nao encontrado')
  })

  it('deve retornar 404 ao deletar usuario inexistente', async () => {
    const response = await request(app).delete('/usuarios/123e4567-e89b-12d3-a456-426614174000')

    expect(response.status).toBe(404)
  })

  it('deve retornar 409 ao violar unique constraint de nome duplicado', async () => {
    await request(app).post('/usuarios').send({
      nome: 'Nome Unico',
      cargo: 'DevOps'
    })

    const response = await request(app).post('/usuarios').send({
      nome: 'Nome Unico',
      cargo: 'Designer'
    })

    expect(response.status).toBe(409)
    expect(response.body.status).toBe('erro_de_conflito')
  })
})
