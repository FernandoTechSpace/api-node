import express from 'express'
import userController from './controllers/UserController.js'
// importa o middleware
import userMiddleware from './middlewares/UserMiddleware.js'

const router = express.Router()

router.get('/', userController.status)
router.get('/usuarios', userController.index)

// adiciona o middleware de validacao de payload
// a ordem importa: primeiro valida, depois cria
router.post('/usuarios', userMiddleware.validatePayload, userController.store)

// valida o id e o payload da atualizacao
router.put('/usuarios/:id', userMiddleware.validateId, userMiddleware.validatePayload, userController.update)

// no delete valida apenas o id
router.delete('/usuarios/:id', userMiddleware.validateId, userController.delete)

export default router
