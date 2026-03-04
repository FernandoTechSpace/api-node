import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import router from './router.js'
import errorHandler from './middlewares/ErrorHandler.js'

const app = express()

// ─────────────────────────────────────────────
// Segurança: Cabeçalhos HTTP defensivos
// Protege contra Clickjacking, XSS, MIME sniffing etc. (OWASP A05)
// ─────────────────────────────────────────────
app.use(helmet())

// ─────────────────────────────────────────────
// Segurança: CORS — somente origens autorizadas
// Origem configurável via variável de ambiente CORS_ORIGIN
// Em produção: definir CORS_ORIGIN para o domínio real do front-end
// ─────────────────────────────────────────────
const corsOpcoes = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOpcoes))

// ─────────────────────────────────────────────
// Segurança: Rate Limiting — proteção contra força bruta e DDoS
// Máximo de 100 requisições por IP a cada 15 minutos
// ─────────────────────────────────────────────
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true, // Retorna RateLimit-* headers (RFC 6585)
  legacyHeaders: false,
  message: {
    status: 'erro_limite_excedido',
    mensagem: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
})
app.use(limitador)

// ─────────────────────────────────────────────
// Body parsing — JSON com limite de tamanho seguro (prevenção de body bomb)
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))

// ─────────────────────────────────────────────
// Rotas e tratamento de erros
// ─────────────────────────────────────────────
app.use(router)
app.use(errorHandler)

export default app
