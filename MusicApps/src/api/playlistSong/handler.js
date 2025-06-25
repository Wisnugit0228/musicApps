class PlaylistSongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(req, h) {
    await this._validator.playlistSongValidate(req.payload);
    const { id: user_id } = req.auth.credentials;
    const { playlist_id } = req.params;
    const { songId } = req.payload;
    await this._service.verifyPlaylist(playlist_id, user_id);
    const id = await this._service.addSongToPlaylist(playlist_id, songId, user_id);

    return {
      status: "success",
      data: {
        id,
      },
    };
  }
}

module.exports = PlaylistSongHandler;
