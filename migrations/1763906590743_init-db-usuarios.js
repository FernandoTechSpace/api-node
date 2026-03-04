/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const up = (pgm) => {
  // criacao da tabela usuarios
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cargo VARCHAR(255),
      data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const down = (pgm) => {
  // desfazer a migracao
  pgm.sql(`
    DROP TABLE IF EXISTS usuarios
  `)
}
