// middleware para tratar erros
function ErrorHandler (erro, requisicao, resposta, next) {
  console.error(erro)

  return resposta.status(500).json({
    status: 'erro',
    mensagem: 'erro interno do servidor'
  })
}

export default ErrorHandler
