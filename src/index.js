import express from 'express'
// remove a importacao da lib 'express-async-errors' pois o express 5 ja faz isso nativamente

import router from './router.js'
import errorHandler from './middlewares/ErrorHandler.js'

const app = express()

app.use(express.json())

app.use(router)

// o tratamento de erros continua aqui
app.use(errorHandler)

const porta = process.env.PORT || 3000

app.listen(porta, () => {
  console.log(`servidor rodando na porta ${porta}`)
})
