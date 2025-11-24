import express from 'express'
import userController from './controllers/UserController.js'
// importa o middleware
import userMiddleware from './middlewares/UserMiddleware.js'

const router = express.Router()

router.get('/', userController.status)
router.get('/usuarios', userController.index)

// adiciona o middleware "validateName" entre a rota e o controller
// a ordem importa: primeiro valida, depois cria
router.post('/usuarios', userMiddleware.validateName, userController.store)

// valida o nome e id antes de atualizar
router.put('/usuarios/:id', userMiddleware.validateId, userMiddleware.validateName, userController.update)

// no delete valida apenas o id
router.delete('/usuarios/:id', userMiddleware.validateId, userController.delete)

export default router
