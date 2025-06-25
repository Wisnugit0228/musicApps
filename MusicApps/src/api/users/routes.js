const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
  {
    method: "POST",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
  },
];

module.exports = routes;
