require("dotenv").config();
const Jwt = require("@hapi/jwt");
const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const authentications = require("./api/authentications");
const songs = require("./api/songs");
const users = require("./api/users");
const ClientError = require("./exceptions/ClientError.js");
const AlbumsService = require("./services/AlbumService.js");
const AuthenticationsService = require("./services/AuthenticationsService");
const SongService = require("./services/SongService.js");
const UsersService = require("./services/usersService.js");
const TokenManager = require("./tokenize/TokenManager");
const AlbumsValidator = require("./validator/albums");
const AuthenticationsValidator = require("./validator/authentications");
const SongsValidator = require("./validator/songs");
const UsersValidator = require("./validator/users");
const playlists = require("./api/playlists");
const PlaylistsService = require("./services/PlaylistsService");
const playlistValidator = require("./validator/playlists");
const playlistSong = require("./api/playlistSong");
const PlaylistSongService = require("./services/PlaylistSongsService");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongService();
  const userService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongService();

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("musicsapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Number(process.env.ACCESS_TOKEN_AGE),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.register({
    plugin: users,
    options: {
      service: userService,
      validator: UsersValidator,
    },
  });

  await server.register({
    plugin: authentications,
    options: {
      authenticationsService,
      usersService: userService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  });

  await server.register({
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: playlistValidator,
    },
  });

  await server.register({
    plugin: playlistSong,
    options: {
      service: playlistSongsService,
      validator: playlistValidator,
    },
  });

  server.ext("onPreResponse", (Request, h) => {
    const { response } = Request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
