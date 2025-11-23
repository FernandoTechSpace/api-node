import userRepository from '../repositories/UserRepository.js'

class UserController {
  status (requisicao, resposta) {
    return resposta.status(200).json({
      mensagem: 'api funcionando corretamente',
      status: 'sucesso'
    })
  }

  // adicionei ASYNC
  async index (requisicao, resposta) {
    const { cargo } = requisicao.query

    // adicionei AWAIT: espere o banco buscar os dados
    const listaUsuarios = await userRepository.findAll({ cargo })

    return resposta.status(200).json(listaUsuarios)
  }

  async store (requisicao, resposta) {
    const { nome, cargo } = requisicao.body

    // adicionei AWAIT: espere o banco salvar
    const novoUsuario = await userRepository.create({ nome, cargo })

    return resposta.status(201).json({
      mensagem: 'usuario cadastrado com sucesso',
      usuario: novoUsuario
    })
  }

  async update (requisicao, resposta) {
    const { id } = requisicao.params
    const { nome, cargo } = requisicao.body

    // adicionei AWAIT: espere validar se existe
    const usuarioExiste = await userRepository.findById(id)

    if (!usuarioExiste) {
      return resposta.status(404).json({
        erro: 'usuario nao encontrado'
      })
    }

    // adicionei AWAIT: espere atualizar
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

    // adicionei AWAIT: espere deletar
    await userRepository.delete(id)

    return resposta.status(204).send()
  }
}

export default new UserController()
