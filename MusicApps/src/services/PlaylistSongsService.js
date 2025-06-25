const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../exceptions/AuthorizationError");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylist(id_playlist, user_id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id_playlist],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Id playlist tidak ditemukan");
    }

    const id_user = result.rows[0];

    if (id_user.user_id !== user_id) {
      throw new AuthorizationError("Resource tidak ada");
    }
  }

  async addSongToPlaylist(playlist_id, song_id, user_id) {
    const id = `plsong-${nanoid(16)}`;
    const action = "add";
    const time = new Date().toISOString();
    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlist_id, song_id, action, time, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menambahkan song ke plylist");
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistSongService;
