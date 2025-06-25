/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql("INSERT INTO users(id, username, password, full_name) VALUES ('old_albums', 'old_albums', 'old_albums', 'old_albums')");

  pgm.sql("UPDATE albums SET owner = 'old_albums' WHERE owner IS NULL");

  pgm.addConstraint("albums", "fk_albums.owner_user.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint("albums", "fk_albums.owner_user.id");

  pgm.sql("UPDATE albums SET owner = NULL WHERE owner = 'old_albums'");

  pgm.sql("DELETE FROM users WHERE id = 'old_albums'");
};
