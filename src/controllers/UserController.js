import userRepository from '../repositories/UserRepository.js'

class UserController {
  status (requisicao, resposta) {
    return resposta.status(200).json({
      mensagem: 'api funcionando corretamente',
      status: 'sucesso'
    })
  }

  // Listagem com suporte a paginacao e metadados de total
  async index (requisicao, resposta) {
    const { cargo, page = 1, limit = 10 } = requisicao.query

    // Converte e garante números seguros para paginação
    const parsedPage = Math.max(1, parseInt(page, 10))
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10))) // limit máximo 100
    const offset = (parsedPage - 1) * parsedLimit

    // O repositório retorna { dados, total } para cálculo das páginas
    const { dados, total } = await userRepository.findAll({
      cargo,
      limit: parsedLimit,
      offset
    })

    return resposta.status(200).json({
      dados,
      paginacao: {
        page: parsedPage,
        limit: parsedLimit,
        total_registros: total,
        total_paginas: Math.ceil(total / parsedLimit)
      }
    })
  }

  async store (requisicao, resposta) {
    const { nome, cargo } = requisicao.body

    // adiciona AWAIT: aguarda o banco salvar
    const novoUsuario = await userRepository.create({ nome, cargo })

    return resposta.status(201).json({
      mensagem: 'usuario cadastrado com sucesso',
      usuario: novoUsuario
    })
  }

  async update (requisicao, resposta) {
    const { id } = requisicao.params
    const { nome, cargo } = requisicao.body

    // adiciona AWAIT: aguarda validar se existe
    const usuarioExiste = await userRepository.findById(id)

    if (!usuarioExiste) {
      return resposta.status(404).json({
        erro: 'usuario nao encontrado'
      })
    }

    // adiciona AWAIT: aguarda atualizar
    const usuarioAtualizado = await userRepository.update(id, { nome, cargo })

    return resposta.status(200).json({
      mensagem: 'usuario atualizado com sucesso',
      usuario: usuarioAtualizado
    })
  }

  async delete (requisicao, resposta) {
    const { id } = requisicao.params

    const usuarioExiste = await userRepository.findById(id)

    if (!usuarioExiste) {
      return resposta.status(404).json({
        erro: 'usuario nao encontrado'
      })
    }

    // adiciona AWAIT: aguarda deletar
    await userRepository.delete(id)

    return resposta.status(204).send()
  }
}

export default new UserController()
