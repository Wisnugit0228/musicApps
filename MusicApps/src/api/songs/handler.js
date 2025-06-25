class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const { title, year, genre, performer, duration, album_id } = req.payload;

    const songId = await this._service.addSong({ title, year, genre, performer, duration, album_id });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(req, h) {
    const { title, performer } = req.query;
    const songs = await this._service.getSongs({ title, performer });
    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;
    const song = await this._service.getSongById(id);
    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;
    const { title, year, genre, performer, duration, album_id } = req.payload;

    await this._service.editSongById(id, { title, year, genre, performer, duration, album_id });

    return {
      status: "success",
    };
  }

  async deleteSongByIdHandler(req, h) {
    const { id } = req.params;
    await this._service.deleteSongById(id);
    return {
      status: "Success",
    };
  }
}

module.exports = SongsHandler;
