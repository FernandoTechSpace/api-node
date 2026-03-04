import { z } from 'zod'

// ─────────────────────────────────────────────
// Enum de cargos válidos — define o domínio de negócio aceito pela API.
// Qualquer string fora desta lista será rejeitada com HTTP 400.
// Adicione novos cargos aqui conforme o negócio crescer.
// ─────────────────────────────────────────────
const CARGOS_VALIDOS = [
  'Engenheiro de Software',
  'Tech Lead',
  'Product Manager',
  'QA Engineer',
  'Analista de Dados',
  'DevOps',
  'Desenvolvedor Backend',
  'Desenvolvedor Frontend',
  'Desenvolvedor Fullstack',
  'Designer',
  'Estagiário'
]

// Schema estrito para criacao e atualizacao
const userSchema = z.object({
  nome: z.string({
    required_error: 'o campo nome e obrigatorio',
    invalid_type_error: 'nome deve ser um texto'
  }).min(3, 'nome deve ter pelo menos 3 caracteres').max(100, 'nome não pode exceder 100 caracteres').trim(),
  cargo: z.enum(CARGOS_VALIDOS, {
    errorMap: () => ({
      message: `cargo inválido. Valores aceitos: ${CARGOS_VALIDOS.join(', ')}`
    })
  })
}).strict() // Não permite campos adicionais no payload

// Schema simples para validação de UUID nos parâmetros de rota
const idSchema = z.string().uuid('id invalido: deve ser um UUID valido')

class UserMiddleware {
  // middleware para validar payload contra o Zod Schema
  validatePayload (requisicao, resposta, next) {
    try {
      // Zod lança um ZodError que será interceptado pelo ErrorHandler global
      userSchema.parse(requisicao.body)
      next()
    } catch (error) {
      next(error)
    }
  }

  // middleware para validar se o id é um UUID válido
  validateId (requisicao, resposta, next) {
    try {
      idSchema.parse(requisicao.params.id)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserMiddleware()
