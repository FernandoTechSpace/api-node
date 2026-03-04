// ErrorHandler não precisa mais importar o ZodError explícito

// middleware para tratar erros globais
function ErrorHandler(erro, requisicao, resposta, next) {
  // Tratamento de erros de validacao do Zod (Bad Request)
  if (erro.name === 'ZodError') {
    return resposta.status(400).json({
      status: 'erro_de_validacao',
      erros: erro.issues.map(err => ({
        campo: err.path.join('.'),
        mensagem: err.message
      }))
    })
  }

  // Tratamento de erro do PostgreSQL: 23505 = unique_violation (Conflict)
  // Acontece quando criamos um recurso com dados que não podem ser duplicados
  if (erro.code === '23505') {
    return resposta.status(409).json({
      status: 'erro_de_conflito',
      mensagem: 'já existe um registro conflitante com os dados enviados'
    })
  }

  // Erro genérico/interno (Internal Server Error)
  console.error('[Unhandled Error]', erro)

  return resposta.status(500).json({
    status: 'erro',
    mensagem: 'erro interno do servidor'
  })
}

export default ErrorHandler
