class UserMiddleware {

    // middleware para validar se o nome foi enviado
    validateName(requisicao, resposta, next) {
        const { nome } = requisicao.body;

        // se nao tiver nome, eu retorno erro e a requisicao morre aqui
        if (!nome) {
            return resposta.status(400).json({
                erro: 'o campo nome e obrigatorio'
            });
        }

        // se tiver nome, eu chamo o next()
        // isso diz para o express passar para o proximo passo (o controller)
        next();
    }
    
    // middleware para validar se o id e um uuid valido (opcional mas boa pratica)
    validateId(requisicao, resposta, next) {
        const { id } = requisicao.params;

        // validacao simples de tamanho de uuid
        if (!id || id.length !== 36) {
             return resposta.status(400).json({
                erro: 'id invalido'
            });
        }

        next();
    }
}

export default new UserMiddleware();