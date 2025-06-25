const InvariantError = require("../../exceptions/InvariantError");
const UsersPayloadSchema = require("./schema.js");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validateResult = UsersPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = UsersValidator;
