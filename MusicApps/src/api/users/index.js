const UserHandler = require("./handler.js");
const routes = require("./routes.js");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const userHandler = new UserHandler(service, validator);
    server.route(routes(userHandler));
  },
};
