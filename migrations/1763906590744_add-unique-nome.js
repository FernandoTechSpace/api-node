/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.sql('ALTER TABLE usuarios ADD CONSTRAINT unique_nome UNIQUE (nome)')
}

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.sql('ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS unique_nome')
}
