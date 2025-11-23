import express from 'express'
import userController from './controllers/UserController.js'
// importo o middleware
import userMiddleware from './middlewares/UserMiddleware.js'

const router = express.Router()

router.get('/', userController.status)
router.get('/usuarios', userController.index)

// aqui esta o segredo:
// coloco o middleware "validateName" entre a rota e o controller
// a ordem importa: primeiro valida, depois cria
router.post('/usuarios', userMiddleware.validateName, userController.store)

// no update tambem valido o nome antes de atualizar
// adicionei tambem a validacao de id
router.put('/usuarios/:id', userMiddleware.validateId, userMiddleware.validateName, userController.update)

// no delete valido apenas o id
router.delete('/usuarios/:id', userMiddleware.validateId, userController.delete)

export default router
