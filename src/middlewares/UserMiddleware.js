import { z } from 'zod'

// Schema estrito para criacao e atualizacao
const userSchema = z.object({
  nome: z.string({
    required_error: 'o campo nome e obrigatorio',
    invalid_type_error: 'nome deve ser um texto'
  }).min(3, 'nome deve ter pelo menos 3 caracteres').max(100, 'nome não pode exceder 100 caracteres'),
  cargo: z.string({
    required_error: 'o campo cargo e obrigatorio',
    invalid_type_error: 'cargo deve ser um texto'
  }).min(2, 'cargo deve ter pelo menos 2 caracteres').max(50, 'cargo não pode exceder 50 caracteres')
}).strict() // Não permite campos adicionais no payload

// Schema simples para o id (uuid)
const idSchema = z.string().uuid('id invalido formatado como uuid')

class UserMiddleware {
  // middleware para validar payload contra o Zod Schema
  validatePayload(requisicao, resposta, next) {
    try {
      // O Zod lança um erro síncrono que será capturado pelo express 5 se usarmos next(error)
      userSchema.parse(requisicao.body)
      next()
    } catch (error) {
      next(error)
    }
  }

  // middleware para validar se o id e um uuid valido
  validateId(requisicao, resposta, next) {
    try {
      idSchema.parse(requisicao.params.id)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserMiddleware()
