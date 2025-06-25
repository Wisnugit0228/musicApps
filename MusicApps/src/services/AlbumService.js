const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../exceptions/AuthorizationError.js");
const InvariantError = require("../exceptions/InvariantError.js");
const NotFoundError = require("../exceptions/NotFoundError.js");
const { mapDBToModel } = require("../utils/index.js");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyAlbumOwner({ id, owner }) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = result.rows[0];

    if (album.owner !== owner) {
      throw new AuthorizationError("Resource yang anda minta tidak ditemukan");
    }
  }

  async addAlbum({ name, year, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, name, year, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(({ id, name, year }) => ({ id, name, year }));
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const querySong = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    const song = await this._pool.query(querySong);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = result.rows.map(({ id, name, year }) => ({ id, name, year }))[0];
    return {
      ...album,
      song: song.rows.map(({ id, title, performer }) => ({ id, title, performer })),
    };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumsService;
