class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(req, h) {
    await this._validator.playlistValidate(req.payload);
    const { name } = req.payload;
    const { id: idUser } = req.auth.credentials;
    const idPlaylist = await this._service.addPlaylist({ name, idUser });
    return {
      status: "success",
      data: {
        id: idPlaylist,
      },
    };
  }

  async getPlaylistsHandler(req, h) {
    const { id: user_id } = req.auth.credentials;

    const playlists = await this._service.getPlaylists(user_id);
    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async getPlaylistByIdHandler(req, h) {
    const { id } = req.params;
    const { id: user_id } = req.auth.credentials;
    await this._service.playlistVerify(id, user_id);

    const playlist = await this._service.getPlaylistById(id);
    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async putPlaylistByIdHandler(req, h) {
    await this._validator.playlistValidate(req.payload);
    const { name } = req.payload;
    const { id } = req.params;
    const { id: user_id } = req.auth.credentials;
    await this._service.playlistVerify(id, user_id);

    await this._service.editPlaylistById(id, name);
    return {
      status: "success",
    };
  }

  async deletePlaylistByIdHandler(req, h) {
    const { id } = req.params;
    const { id: user_id } = req.auth.credentials;
    await this._service.playlistVerify(id, user_id);

    await this._service.deletePlaylistById(id);
    return {
      status: "success",
    };
  }
}

module.exports = PlaylistHandler;
