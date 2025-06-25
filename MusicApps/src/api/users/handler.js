class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const { username, password, fullname } = req.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    return {
      status: "success",
      data: {
        userId,
      },
    };
  }

  async getUserByIdHandler(req, h) {
    const { id } = req.params;
    const user = await this._service.getUserById(id);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }
}

module.exports = UserHandler;
