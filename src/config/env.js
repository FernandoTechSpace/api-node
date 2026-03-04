// ─────────────────────────────────────────────
// Validação de Variáveis de Ambiente (Fail-Fast)
// Se uma variável obrigatória estiver ausente, o servidor não deve subir.
// Isso evita erros silenciosos em tempo de execução.
// ─────────────────────────────────────────────

const VARIAVEIS_OBRIGATORIAS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_NAME'
]

export function validarVariaveisDeAmbiente () {
  const ausentes = VARIAVEIS_OBRIGATORIAS.filter(
    (variavel) => !process.env[variavel]
  )

  if (ausentes.length > 0) {
    console.error(
      `[FATAL] Variáveis de ambiente obrigatórias ausentes: ${ausentes.join(', ')}`
    )
    // Encerra o processo imediatamente com código de erro
    process.exit(1)
  }
}
