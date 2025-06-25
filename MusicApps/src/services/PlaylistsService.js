const { nanoid } = require("nanoid");
const { Pool, Query } = require("pg");
const AuthorizationError = require("../exceptions/AuthorizationError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async playlistVerify(id, user_id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];
    if (playlist.user_id !== user_id) {
      throw new AuthorizationError("Playlis tidak ditemukan");
    }
  }

  async verifyNamePlaylist(name) {
    const query = {
      text: "SELECT name FROM playlists WHERE name = $1",
      values: [name],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError("Playlist sudah tersedia");
    }
  }

  async addPlaylist({ name, idUser }) {
    await this.verifyNamePlaylist(name);
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, idUser],
    };

    const result = await this._pool.query(query);
    console.log(result.rows[0]);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylists(user_id) {
    const query = {
      text: "SELECT * FROM playlists WHERE user_id = $1",
      values: [user_id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
      };
    });
  }

  async getPlaylistById(id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
    };
  }

  async editPlaylistById(id, name) {
    const query = {
      text: "UPDATE playlists SET name = $1 WHERE id = $2 RETURNING id",
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal diubah. id tidak ditemukan");
    }
  }

  async deletePlaylistById(id) {
    const time = new Date().toISOString();
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Palylist gagal dihapus. id tidak ditemukan");
    }
  }
}

module.exports = PlaylistsService;
