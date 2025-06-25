const PlaylistSongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSong",
  version: "1.0.0",
  register: (server, { service, validator }) => {
    const playlistSongHandler = new PlaylistSongHandler(service, validator);
    server.route(routes(playlistSongHandler));
  },
};
