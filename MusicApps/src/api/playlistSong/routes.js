const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{playlist_id}/songs",
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: "musicsapp_jwt",
    },
  },
];

module.exports = routes;
