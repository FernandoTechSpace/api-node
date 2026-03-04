// ─────────────────────────────────────────────
// Ponto de entrada do servidor (server bootstrap)
// A configuração do app está em app.js para permitir testabilidade
// ─────────────────────────────────────────────
import app from './app.js'
import { validarVariaveisDeAmbiente } from './config/env.js'

// Fail-fast: encerra o processo se variáveis obrigatórias estiverem ausentes
validarVariaveisDeAmbiente()

const porta = process.env.PORT || 3000

app.listen(porta, () => {
  console.log(`[INFO] Servidor rodando na porta ${porta}`)
})
